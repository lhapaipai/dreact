import { updateDom } from "./DOMPropertyOperations";

/**
 * Crée le noeud Node
 */
export function createInstance(fiber: Fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : // @ts-ignore
        document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}
