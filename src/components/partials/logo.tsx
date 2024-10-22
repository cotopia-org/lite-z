import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to={`/profile`}>
      <img src='/assets/images/chisco-logo.svg' alt='' />
    </Link>
  );
}
