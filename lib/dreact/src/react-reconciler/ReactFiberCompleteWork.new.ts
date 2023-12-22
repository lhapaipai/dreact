import { updateDom } from "~/react-dom/client/DOMPropertyOperations";
import { commitDeletion } from "./ReactFiberCommitWork.new";

/**
 * En fonction de l'effet de la fibre
 * - PLACEMENT : ajoute le Noeud dans le DOM
 * - UPDATE : met à jour les attributs et listeners
 * - DELETION : retire le noeud Node de l'arbre DOM.
 *
 * Lance un commit sur son 1er fils
 * Lance un commit sur son prochain frère
 */
export function completeWork(fiber: Fiber) {
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

  fiber.child && completeWork(fiber.child);
  fiber.sibling && completeWork(fiber.sibling);
}
