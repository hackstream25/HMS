import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();

  return (
    <header className="navbar">
      <img src="/logo5.png" className="logo" />
      <div className="nav-right">
        <span>{user.teamName} | {user.teamId}</span>
        <button onClick={() => { logout(); nav("/login"); }}>Logout</button>
      </div>
    </header>
  );
}
