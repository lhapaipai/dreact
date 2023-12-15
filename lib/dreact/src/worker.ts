import { createDom, updateDom } from "./dom";
import { globals } from "./globals";

function performUnitOfWork(fiber: Fiber) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    /**
     * Au lieu de créer l'élément HTML qui n'existe pas,
     * invoque la fonction du composant qui nous donnera ses enfants
     *
     * génère ses fibres enfant
     */
    updateFunctionComponent(fiber);
  } else {
    /**
     * Crée l'élément HTML s'il n'existe pas et
     * lui associe ses attributs et listeners
     *
     * génère ses fibres enfants
     */
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
}

function updateFunctionComponent(fiber: Fiber) {
  if (!(fiber.type instanceof Function)) {
    throw new Error("impossible");
  }
  globals.wipFiber = fiber;
  globals.hookIndex = 0;
  globals.wipFiber.hooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;

  reconcileChildren(fiber, elements);
}

function commitRoot() {
  globals.deletions.forEach(commitWork);
  if (globals.wipRoot?.child) {
    commitWork(globals.wipRoot.child);
  }
  globals.currentRoot = globals.wipRoot;
  globals.wipRoot = null;
}

function commitWork(fiber: Fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;

  while (domParentFiber && !domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber?.dom ?? null;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    domParent?.appendChild(fiber.dom!);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate?.props ?? [], fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    if (domParent && fiber.dom) {
      commitDeletion(fiber, domParent);
    }
  }

  fiber.child && commitWork(fiber.child);
  fiber.sibling && commitWork(fiber.sibling);
}

function commitDeletion(fiber: Fiber, domParent: Dom) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    if (fiber.child) {
      commitDeletion(fiber.child, domParent);
    }
  }
}

export function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (globals.nextUnitOfWork && !shouldYield) {
    globals.nextUnitOfWork = performUnitOfWork(globals.nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!globals.nextUnitOfWork && globals.wipRoot) {
    commitRoot();
  }

  // programme une nouvelle ré-exécution
  requestIdleCallback(workLoop);
}

function reconcileChildren(wipFiber: Fiber, elements: DidactElement[]) {
  let index = 0;
  let oldFiber: Fiber | null = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling: Fiber | null = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber: Fiber | null = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      if (oldFiber === null) {
        throw new Error("impossible");
      }
      /**
       * Lorsque l'ancienne fibre et l'élément ont le même type, nous créons une nouvelle
       * fibre en conservant le nœud DOM de l'ancienne fibre et les props de l'élément.
       */
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: oldFiber,
        effectTag: "UPDATE",
        hooks: [],
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: null,
        effectTag: "PLACEMENT",
        hooks: [],
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      globals.deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
