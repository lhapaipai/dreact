interface Globals {
  nextUnitOfWork: Fiber | null;
  wipRoot: Fiber | null;
  currentRoot: Fiber | null;
  deletions: Fiber[];
  wipFiber: Fiber | null;
  hookIndex: number;
}

type Props = {
  [prop: string]: any;
};

type Dom = Text | HTMLElement;

type FunctionComponent = (props: Props) => DidactElement;

interface Fiber {
  type: string | FunctionComponent;
  props: Props;
  dom: Dom | null;
  parent: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  hooks: any[];

  /**
   * un lien vers l'ancienne fibre, la fibre que nous avons commité
   * dans le DOM lors de la phase de commit précédente.
   */
  alternate: Fiber | null;

  effectTag?: "UPDATE" | "PLACEMENT" | "DELETION";
}
interface DidactElement {
  type: string | FunctionComponent;
  props: Props;
}
