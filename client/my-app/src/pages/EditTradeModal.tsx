// src/components/EditTradeModal.tsx
import { useState } from "react";
import axios from "axios";

interface EditTradeModalProps {
  trade: {
    _id: string;
    symbol: string;
    rr: number;
    date: string;
    result: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export default function EditTradeModal({ trade, onClose, onSave }: EditTradeModalProps) {
  const [symbol, setSymbol] = useState(trade.symbol);
  const [rr, setRR] = useState(trade.rr);
  const [date, setDate] = useState(trade.date.split("T")[0]);
  const [result, setResult] = useState(trade.result);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging line to check the token
    console.log("Data being sent:", { symbol, rr, date, result });
    try {
      const response = await axios.put(
        `http://localhost:8000/trades/${trade._id}`,
        {
          symbol,
          rr,
          date,
          result,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Trade updated successfully", response.data);
      onSave();
    } catch (error) {
      console.error("Error updating trade:", error.response || error);
      alert("Wystąpił błąd podczas aktualizacji trade'u.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-xl shadow-lg space-y-4 w-96">
        <h2 className="text-xl font-bold">Edytuj Trade</h2>

        <input
          className="w-full p-2 border rounded"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol"
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          step="0.1"
          value={rr}
          onChange={(e) => setRR(parseFloat(e.target.value))}
          placeholder="RR"
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          required
        >
          <option value="win">Win</option>
          <option value="lose">Lose</option>
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Anuluj
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Zapisz
          </button>
        </div>
      </form>
    </div>
  );
}
