import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sales: 4000 },

  { name: "Feb", sales: 2400 },

  { name: "Mar", sales: 8000 },

  { name: "Apr", sales: 5000 },

  { name: "May", sales: 12000 },

  { name: "Jun", sales: 9000 },
];

const SalesChart = () => {
  return (
    <div className="chart">
      <h2>Sales Analytics</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#FFD700"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
