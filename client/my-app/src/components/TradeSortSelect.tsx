import React from 'react';

interface TradeSortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TradeSortSelect({
  value,
  onChange,
}: TradeSortSelectProps) {
  return (
    <select
      className='p-3 rounded bg-black text-white focus:outline-none mb-6'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value='none'>No sorting</option>
      <option value='asc'>RR Ascending</option>
      <option value='desc'>RR Descending</option>
    </select>
  );
}
