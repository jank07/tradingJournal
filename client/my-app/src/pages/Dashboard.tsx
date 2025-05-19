import { useEffect, useState } from 'react';
import axios from 'axios';
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
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/trades', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrades(res.data);
    } catch (err) {
      setError('Fail to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/trades/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh or update state
      fetchTrades(); // or filter out deleted trade from state
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
      <h2 className='text-2xl font-bold text-center mb-6'>Twoje Trade’y</h2>
      {trades.length === 0 ? (
        <p className='text-center'>No trades.</p>
      ) : (
        <>
          {/* Filters and Sorting */}
          <div className='flex flex-wrap gap-4 justify-center mb-6'>
            <select
              className='p-3 rounded bg-black text-white  focus:outline-none'
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
            >
              <option value='all'>All</option>
              <option value='win'>Only wins</option>
              <option value='lose'>Only losses</option>
            </select>

            <select
              className='p-3 rounded bg-black text-white  focus:outline-none'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='none'>No sorting</option>
              <option value='asc'>RR Ascending </option>
              <option value='desc'>RR Descending</option>
            </select>

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
          <div className='text-center mb-6 space-y-2'>
            <p className='text-lg'>
              📊 <strong>Średni RR:</strong> {averageRR}
            </p>
          </div>
          {/* Pie Chart */}
          <div className='w-full md:w-1/2 mx-auto mb-8'>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trades List */}
          <div className='flex flex-wrap gap-4 justify-center'>
            {filteredTrades.map((trade) => (
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
                  <strong>Data:</strong>{' '}
                  {new Date(trade.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Wynik:</strong>{' '}
                  {trade.result === 'win' ? '✅ Wygrana' : '❌ Przegrana'}
                </p>
                <button
                  onClick={() => setEditingTrade(trade)}
                  className='mt-2 bg-white text-black px-3 py-1 rounded'
                >
                  Edytuj
                </button>
                <button
                  className='bg-red-500 text-white px-2 py-1 rounded'
                  onClick={() => handleDelete(trade._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {editingTrade && (
        <EditTradeModal
          trade={editingTrade}
          onClose={() => setEditingTrade(null)}
          onSave={() => {
            setEditingTrade(null);
            setLoading(true);
            axios
              .get('http://localhost:8000/trades', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })
              .then((res) => setTrades(res.data))
              .catch(() => setError('Błąd podczas pobierania trade’ów'))
              .finally(() => setLoading(false));
          }}
        />
      )}
    </div>
  );
}
