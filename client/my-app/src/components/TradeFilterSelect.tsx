import React from 'react';

interface TradeFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TradeFilterSelect({
  value,
  onChange,
}: TradeFilterSelectProps) {
  return (
    <select
      className='p-3 rounded bg-black text-white focus:outline-none mb-6'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value='all'>All trades</option>
      <option value='win'>Only wins</option>
      <option value='lose'>Only losses</option>
    </select>
  );
}
