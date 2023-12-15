import DReact from "dreact";

export default function Counter() {
  const [count, setCount] = DReact.useState(1);

  function handleClick() {
    setCount((c: number) => c + 1);
  }

  return <button onClick={handleClick}>{`Counter : ${count}`}</button>;
}
