import { JSXElementConstructor } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createElement(
  type: string | FunctionComponent,
  props: Props,
  ...children: (DreactElement | string)[]
): DreactElement {
  return {
    type,
    props: {
      ...props,
      children:
        children?.map((child) =>
          typeof child === "string" ? createTextElement(child) : child,
        ) ?? [],
    },
  };
}

function createTextElement(content: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: content,
      children: [],
    },
  };
}

function render(element: DreactElement, container: HTMLElement) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key: string) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

const element = <h1 title="foo">Hello</h1>;
const container = document.getElementById("root")!;

render(element, container);
