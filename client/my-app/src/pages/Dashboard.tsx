import { useEffect, useState } from 'react';
import api from '../api/axios';
import TradeList from '../components/TradeList';
import TradeStats from '../components/TradeStats';
import TradePieChart from '../components/TradePieChart';
import TradeFilterSelect from '../components/TradeFilterSelect';
import TradeSortSelect from '../components/TradeSortSelect';
import EditTradeModal from '../pages/EditTradeModal';

import { useAuth } from '../context/AuthContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Trade {
  _id: string;
  symbol: string;
  rr: number;
  date: string;
  result: string;
}

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter and sort states
  const [filterResult, setFilterResult] = useState('all');
  const [sortOrder, setSortOrder] = useState('none');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { isLoggedIn } = useAuth();

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trades');
      setTrades(res.data);
    } catch (err) {
      setError('Fail to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/trades/${id}`);
      fetchTrades();
    } catch (err) {
      console.error('Failed to delete trade:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchTrades();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <p>You need to be logged in.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;

  const filteredTrades = trades
    .filter((trade) => {
      if (filterResult === 'win') return trade.result === 'win';
      if (filterResult === 'lose') return trade.result === 'lose';
      return true;
    })
    .filter((trade) => {
      const tradeDate = new Date(trade.date).toISOString().split('T')[0];
      return (
        (!startDate || tradeDate >= startDate) &&
        (!endDate || tradeDate <= endDate)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.rr - b.rr;
      if (sortOrder === 'desc') return b.rr - a.rr;
      return 0;
    });

  // Pie chart data
  const winCount = trades.filter((t) => t.result === 'win').length;
  const loseCount = trades.filter((t) => t.result === 'lose').length;

  const pieData = [
    { name: 'Wins', value: winCount },
    { name: 'Losses', value: loseCount },
  ];

  const COLORS = ['#22c55e', '#ef4444']; // green, red

  // Stats for filtered trades
  const averageRR =
    filteredTrades.length > 0
      ? (
          filteredTrades.reduce((sum, trade) => sum + trade.rr, 0) /
          filteredTrades.length
        ).toFixed(2)
      : '0';

  const bestTrade = filteredTrades.reduce(
    (best, trade) => (!best || trade.rr > best.rr ? trade : best),
    null as Trade | null
  );

  const worstTrade = filteredTrades.reduce(
    (worst, trade) => (!worst || trade.rr < worst.rr ? trade : worst),
    null as Trade | null
  );

  return (
    <div className='bg-gray-800 max-w-5xl mx-auto mt-10 px-4'>
      <h2 className='text-2xl font-bold text-center mb-6'>Your Trades</h2>
      {trades.length === 0 ? (
        <p className='text-center'>No trades.</p>
      ) : (
        <>
          {/* Filters and Sorting */}
          <div className='flex flex-wrap gap-4 justify-center mb-6'>
            <TradeFilterSelect
              value={filterResult}
              onChange={setFilterResult}
            />

            <TradeSortSelect value={sortOrder} onChange={setSortOrder} />

            <input
              type='date'
              className='p-3 rounded bg-black text-white  focus:outline-none'
              style={{
                colorScheme: 'dark', // Ensures the calendar icon and text adapt to the dark background
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type='date'
              className='p-3 rounded bg-black text-white  focus:outline-none'
              style={{
                colorScheme: 'dark', // Ensures the calendar icon and text adapt to the dark background
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Stats */}
          <TradeStats
            averageRR={averageRR}
            bestTrade={
              bestTrade ? { symbol: bestTrade.symbol, rr: bestTrade.rr } : null
            }
            worstTrade={
              worstTrade
                ? { symbol: worstTrade.symbol, rr: worstTrade.rr }
                : null
            }
          />
          {/* Pie Chart */}
          <TradePieChart pieData={pieData} colors={COLORS} />

          {/* Trades List */}
          <TradeList
            trades={filteredTrades}
            onEdit={setEditingTrade}
            onDelete={handleDelete}
          />
        </>
      )}
      {editingTrade && (
        <EditTradeModal
          trade={editingTrade}
          onClose={() => setEditingTrade(null)}
          onSave={() => {
            setEditingTrade(null);
            setLoading(true);
            api
              .get('/trades')
              .then((res) => setTrades(res.data))
              .catch(() => setError('Error fetching trades'))
              .finally(() => setLoading(false));
          }}
        />
      )}
    </div>
  );
}
