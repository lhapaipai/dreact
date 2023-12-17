export function commitDeletion(fiber: Fiber, domParent: Dom) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    // dans le cas de Composant Fonctionnel fiber.dom est null
    if (fiber.child) {
      commitDeletion(fiber.child, domParent);
    }
  }
}
