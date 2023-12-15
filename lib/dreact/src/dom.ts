import { isEvent, isGone, isNew, isProperty } from "./util";

export function createDom(fiber: Fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : // @ts-ignore
        document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

export function updateDom(
  dom: Dom,
  prevProps: Props = {},
  nextProps: Props = {},
) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      (key: string) => !(key in nextProps) || isNew(prevProps, nextProps)(key),
    )
    .forEach((name: string) => {
      const eventType = name.toLowerCase().substring(2);
      // console.log("removeEventListener");
      dom.removeEventListener(eventType, prevProps[name]);
    });

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach((name: string) => {
      // @ts-ignore
      dom[name] = "";
    });

  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name: string) => {
      // @ts-ignore
      dom[name] = nextProps[name];
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name: string) => {
      const eventType = name.toLowerCase().substring(2);
      // console.log("addEventListener");
      dom.addEventListener(eventType, nextProps[name]);
    });
}
