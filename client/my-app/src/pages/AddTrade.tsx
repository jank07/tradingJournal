import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

export default function AddTrade() {
  const [formData, setFormData] = useState({
    symbol: "",
    rr: "",
    date: "",
    result: "win", 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn) {
      setError("Musisz być zalogowany, aby dodać trade.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging line to check the token
      await axios.post(
        "http://localhost:8000/trades",
        {
          ...formData,
          rr: parseFloat(formData.rr), // Ensure `rr` is a number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Trade dodany!");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("Błąd dodawania trade’u.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <form
        onSubmit={handleSubmit}
        className="p-8 flex flex-col max-w-md mx-auto mt-20 space-y-4 bg-gray-800 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">Dodaj Trade</h2>

        <input
          type="text"
          name="symbol"
          placeholder="Symbol (np. NASDAQ)"
          value={formData.symbol}
          onChange={handleChange}
          className="p-3 rounded bg-black text-white focus:outline-none"
          required
        />

        <input
          type="number"
          name="rr"
          step="0.01"
          placeholder="RR (np. 2.5)"
          value={formData.rr}
          onChange={handleChange}
          className="p-3 rounded bg-black text-white focus:outline-none"
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-3 rounded bg-black text-white focus:outline-none"
          style={{
            colorScheme: "dark", // Ensures the calendar icon and text adapt to the dark background
          }}
          required
        />

        <select
          name="result"
          value={formData.result}
          onChange={handleChange}
          className="p-3 rounded bg-black text-white focus:outline-none"
          required
        >
          <option value="win">Wygrana</option>
          <option value="lose">Przegrana</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          Dodaj Trade
        </button>
      </form>
    </>
  );
}