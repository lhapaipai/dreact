import { globals } from "../globals";

export default function useState(initialValue: any) {
  if (!globals.wipFiber) {
    throw new Error("Can't call hook outside fiber");
  }
  const oldHook = globals.wipFiber.alternate?.hooks[globals.hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initialValue,
    queue: [],
  };

  /**
   * les actions appliquées correspondent à l'ancien état
   */
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action: any) => {
    if (action instanceof Function) {
      hook.state = action(hook.state);
    } else {
      hook.state = action;
    }
  });

  const setState = (action) => {
    hook.queue.push(action);

    if (!globals.currentRoot) {
      throw new Error();
    }

    globals.wipRoot = {
      type: globals.currentRoot.type,
      props: globals.currentRoot.props,
      alternate: globals.currentRoot,
      dom: globals.currentRoot.dom,
      parent: null,
      child: null,
      sibling: null,
      hooks: [],
    };
    globals.nextUnitOfWork = globals.wipRoot;
    globals.deletions = [];
  };

  globals.wipFiber.hooks.push(hook);
  globals.hookIndex++;

  return [hook.state, setState];
}
