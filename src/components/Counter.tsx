import DReact from "../dreact";
import Dreact from "../dreact";

export default function Counter() {
  const [count, setCount] = Dreact.useState(1);

  function handleClick() {
    setCount((c) => c + 1);
  }

  return <button onClick={handleClick}>{`Counter : ${count}`}</button>;
}
