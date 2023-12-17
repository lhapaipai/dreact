import { createElement, createTextElement } from "./factory";
import { globals } from "./globals";
import { workLoop } from "./react-reconciler/ReactFiberWorkLoop.new";
import { useState } from "./react-reconciler/ReactFiberHooks.new";

function render(element: DidactElement, container: HTMLElement) {
  globals.wipRoot = {
    type: container.tagName,
    props: {
      children: [element],
    },
    alternate: globals.currentRoot,
    dom: container,
    parent: null,
    child: null,
    sibling: null,
    hooks: [],
  };
  globals.deletions = [];
  globals.nextUnitOfWork = globals.wipRoot;
}

requestIdleCallback(workLoop);
export default { createElement, createTextElement, render, globals, useState };
