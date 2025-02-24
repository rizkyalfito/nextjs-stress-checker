import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  date: string;
  score: number;
}

interface LineChartProps {
  data: ChartData[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 40]}
            ticks={[0, 8, 16, 24, 32, 40]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Skor Stress', angle: -90, position: 'insideLeft', offset: 0 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px'
            }}
            formatter={(value: number) => [`Skor: ${value}`]}
            labelFormatter={(label) => `Tanggal: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{
              fill: '#2563eb',
              stroke: 'white',
              strokeWidth: 2,
              r: 4
            }}
            activeDot={{
              fill: '#2563eb',
              stroke: 'white',
              strokeWidth: 2,
              r: 6
            }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};