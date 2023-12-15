export function createElement(
  type: string | FunctionComponent,
  props: Props = {},
  ...children: (DidactElement | string)[]
): DidactElement {
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

export function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
