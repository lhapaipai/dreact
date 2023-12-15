import React from "react";
const dummy = React.createElement("h1");

// @ts-ignore
export const REACT_ELEMENT_TYPE = dummy.$$typeof;

export const isEvent = (key: string) => key.startsWith("on");

export const isProperty = (key: string) => key !== "children" && !isEvent(key);

export const isNew = (prev: Props, next: Props) => (key: string) =>
  prev[key] !== next[key];

export const isGone = (next: Props) => (key: string) => !(key in next);
