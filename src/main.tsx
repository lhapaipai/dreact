import Counter from "./components/Counter";
import Header from "./components/Header";
import DReact from "./dreact";

function rerender(value: string) {
  console.log("rerender");

  const handleInput = (e: Event) => {
    rerender(e.target.value);
  };

  const element = (
    <div>
      <input onInput={handleInput} value={value} />
      <Header name={value} />
      <Counter />
    </div>
  );

  // const element = createElement(
  //   "div",
  //   {},
  //   createElement("input", {
  //     onInput: handleInput,
  //     value: value,
  //   }),
  //   // createElement("h2", {}, `Hello ${value}`),
  //   createElement(Header, { name: value }),
  //   createElement(Counter, {}),
  // );

  DReact.render(element, container);
}

const container = document.getElementById("root")!;
rerender("Hugues");
