import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PieData {
  name: string;
  value: number;
}

interface TradePieChartProps {
  pieData: PieData[];
  colors?: string[];
}

export default function TradePieChart({
  pieData,
  colors = ['#22c55e', '#ef4444'],
}: TradePieChartProps) {
  return (
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
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
