import React from 'react';

interface Trade {
  _id: string;
  symbol: string;
  rr: number;
  date: string;
  result: string;
}

interface TradeListProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

export default function TradeList({
  trades,
  onEdit,
  onDelete,
}: TradeListProps) {
  return (
    <div className='flex flex-wrap gap-4 justify-center'>
      {trades.map((trade) => (
        <div
          key={trade._id}
          className={`w-64 p-4 border rounded shadow text-white ${
            trade.result === 'win' ? 'bg-green-700' : 'bg-red-700'
          }`}
        >
          <p>
            <strong>Symbol:</strong> {trade.symbol}
          </p>
          <p>
            <strong>RR:</strong> {trade.rr}
          </p>
          <p>
            <strong>Data:</strong> {new Date(trade.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Result:</strong>{' '}
            {trade.result === 'win' ? '✅ Win' : '❌ Loss'}
          </p>
          <button
            onClick={() => onEdit(trade)}
            className='mt-2 bg-white text-black px-3 py-1 rounded'
          >
            Edit
          </button>
          <button
            className='bg-red-500 text-white px-2 py-1 rounded'
            onClick={() => onDelete(trade._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
