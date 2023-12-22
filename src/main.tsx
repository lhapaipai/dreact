import DReact from "dreact";
import Counter from "./components/Counter";
import Header from "./components/Header";
import "./index.css";
import reactLogo from "./assets/react.svg";

function rerender(value: string) {
  console.log("render");

  const handleInput = (e: Event) => {
    rerender((e.target! as HTMLInputElement).value);
  };

  const element = (
    <div>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <input className="input-text" onInput={handleInput} value={value} />
      <Header name={value} />
      <Counter />
    </div>
  );

  DReact.render(element, container);
}

const container = document.getElementById("root")!;
rerender("Hugues");
