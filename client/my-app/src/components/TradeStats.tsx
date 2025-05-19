import React from 'react';

interface TradeStatsProps {
  averageRR: string;
  bestTrade?: { symbol: string; rr: number } | null;
  worstTrade?: { symbol: string; rr: number } | null;
}

export default function TradeStats({
  averageRR,
  bestTrade,
  worstTrade,
}: TradeStatsProps) {
  return (
    <div className='text-center mb-6 space-y-2'>
      <p className='text-lg'>
        📊 <strong>Average RR:</strong> {averageRR}
      </p>
      {bestTrade && (
        <p>
          🏆 <strong>Best trade:</strong> {bestTrade.symbol} (RR: {bestTrade.rr}
          )
        </p>
      )}
      {worstTrade && (
        <p>
          😬 <strong>Worst trade:</strong> {worstTrade.symbol} (RR:{' '}
          {worstTrade.rr})
        </p>
      )}
    </div>
  );
}
