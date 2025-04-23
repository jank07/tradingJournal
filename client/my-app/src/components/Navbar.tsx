import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="w-full bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/add-trade" className="hover:underline">Dodaj trade</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>

      {isLoggedIn && (
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Wyloguj się
        </button>
      )}
    </nav>
  );
}
