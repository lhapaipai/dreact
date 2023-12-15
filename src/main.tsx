import DReact from "dreact";
import Counter from "./components/Counter";
import Header from "./components/Header";

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

  DReact.render(element, container);
}

const container = document.getElementById("root")!;
rerender("Hugues");
