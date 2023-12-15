import DReact from "../dreact";

interface HeaderProps {
  name: string;
}
export default function Header({ name }: HeaderProps) {
  return <h1>{`hi ${name}`}</h1>;
}
