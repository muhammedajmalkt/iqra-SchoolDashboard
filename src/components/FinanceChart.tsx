"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface MonthlyData {
  name: string;
  collected: number;
  pending: number;
  overdue: number;
  total: number;
}

interface FinanceChartProps {
  userId?: string;
  role?: string;
}

const FinanceChart = ({ userId, role }: FinanceChartProps) => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    // Academic year starts in July (month 6)
    return currentMonth >= 6 ? 
      `${currentYear}-${currentYear + 1}` : 
      `${currentYear - 1}-${currentYear}`;
  });

  useEffect(() => {
    fetchFinanceData();
  }, [selectedYear, userId, role]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        academicYear: selectedYear,
        ...(userId && { userId }),
        ...(role && { role }),
      });

      const response = await fetch(`/api/finance/chart?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch finance data');
      }

      const chartData = await response.json();
      setData(chartData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(getDefaultData());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultData = (): MonthlyData[] => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      collected: 0,
      pending: 0,
      overdue: 0,
      total: 0,
    }));
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          <div className="space-y-1">
            <p className="text-green-600">
              <span className="font-medium">Collected: </span>
              {formatCurrency(payload[0]?.value || 0)}
            </p>
            <p className="text-yellow-600">
              <span className="font-medium">Pending: </span>
              {formatCurrency(payload[1]?.value || 0)}
            </p>
            <p className="text-red-600">
              <span className="font-medium">Overdue: </span>
              {formatCurrency(payload[2]?.value || 0)}
            </p>
            <p className="text-blue-600 border-t pt-1">
              <span className="font-medium">Total: </span>
              {formatCurrency((payload[0]?.value || 0) + (payload[1]?.value || 0) + (payload[2]?.value || 0))}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -2; i <= 2; i++) {
      const year = currentYear + i;
      const academicYear = `${year}-${year + 1}`;
      years.push(academicYear);
    }
    return years;
  };

  const getTitle = () => {
    if (role === "student") return "My Fee Payments";
    if (role === "parent") return "Children's Fee Payments";
    return "Fee Collection Overview";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl w-full h-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">{getTitle()}</h1>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">{getTitle()}</h1>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {getYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">Error: {error}</p>
        </div>
      )}

      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            axisLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }} 
            tickLine={false}
            tickMargin={20}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "20px" }}
          />
          <Line
            type="monotone"
            dataKey="collected"
            stroke="#10b981"
            strokeWidth={3}
            name="Collected"
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={3}
            name="Pending"
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="overdue"
            stroke="#ef4444"
            strokeWidth={3}
            name="Overdue"
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Collected</p>
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.collected, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Pending</p>
          <p className="text-lg font-semibold text-yellow-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.pending, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Overdue</p>
          <p className="text-lg font-semibold text-red-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.overdue, 0))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceChart;