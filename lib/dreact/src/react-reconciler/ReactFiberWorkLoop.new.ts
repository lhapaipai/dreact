import { globals } from "~/globals";
import { completeWork } from "./ReactFiberCompleteWork.new";
import {
  updateFunctionComponent,
  updateHostComponent,
} from "./ReactFiberBeginWork.new";

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

export function commitRoot() {
  globals.deletions.forEach(completeWork);
  if (globals.wipRoot?.child) {
    completeWork(globals.wipRoot.child);
  }
  globals.currentRoot = globals.wipRoot;
  globals.wipRoot = null;
}

/**
 * Effectue son travail sur la fibre et retourne la fibre suivante sur laquelle travailler
 */
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
