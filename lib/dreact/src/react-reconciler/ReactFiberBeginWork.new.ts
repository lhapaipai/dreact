import { globals } from "~/globals";
import { createInstance } from "~/react-dom/client/ReactDOMHostConfig";

/**
 * Invoque la fonction du composant
 * Génère les fibres de ses enfants
 * Raccorde les fibres.
 */
export function updateFunctionComponent(fiber: Fiber) {
  if (!(fiber.type instanceof Function)) {
    throw new Error("impossible");
  }
  globals.wipFiber = fiber;
  globals.hookIndex = 0;
  globals.wipFiber.hooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

/**
 * Crée le noeud DOM s'il n'existe pas
 * Génère les fibres de ses enfants
 * Raccord les fibres
 */
export function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createInstance(fiber);
  }

  const elements = fiber.props.children;

  reconcileChildren(fiber, elements);
}

/**
 * Crée les fibres de ses enfants, se base de l'historique pour choisir s'il
 * s'agit d'une nouvelle fibre ou d'une mise à jour d'une ancienne fibre.
 */
export function reconcileChildren(wipFiber: Fiber, elements: DreactElement[]) {
  let index = 0;
  let oldChildFiber: Fiber | null =
    wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling: Fiber | null = null;

  if (!elements) {
    return;
  }

  while (index < elements.length || oldChildFiber !== null) {
    const element = elements[index];
    let newFiber: Fiber | null = null;

    const sameType =
      oldChildFiber && element && element.type === oldChildFiber.type;

    if (sameType) {
      if (oldChildFiber === null) {
        throw new Error("impossible");
      }
      /**
       * Lorsque l'ancienne fibre et l'élément ont le même type, nous créons une nouvelle
       * fibre en conservant le nœud DOM de l'ancienne fibre et les props de l'élément.
       */
      newFiber = {
        type: oldChildFiber.type,
        props: element.props,
        dom: oldChildFiber.dom,
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: oldChildFiber,
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
    if (oldChildFiber && !sameType) {
      oldChildFiber.effectTag = "DELETION";
      globals.deletions.push(oldChildFiber);
    }

    if (oldChildFiber) {
      oldChildFiber = oldChildFiber.sibling;
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
