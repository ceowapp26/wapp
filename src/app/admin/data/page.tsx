'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api'; 
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Separator } from '@/components/ui/separator';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';

const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={`text-sm leading-none text-gray-700 rounded-md flex items-center h-9 px-3 relative select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${className}`}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
});

SelectItem.displayName = 'SelectItem';

const UserDataPage = () => {
  const [chartType, setChartType] = useState('line');

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Revenue',
        data: [2, 3, 20, 5, 1, 4],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User and Revenue Data',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={{ ...options, cutout: '70%' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">User Analytics Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Data Visualization</h2>
            <Select.Root value={chartType} onValueChange={setChartType}>
              <Select.Trigger className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Select.Value placeholder="Select chart type" />
                <Select.Icon className="ml-2">
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                  <Select.Viewport className="p-1">
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="doughnut">Doughnut Chart</SelectItem>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="w-full h-[400px]">
            {renderChart()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Key Metrics</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold text-indigo-600">10,245</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold text-green-600">8,723</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Revenue</span>
                <span className="font-semibold text-blue-600">$52,389</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-600">New user signed up</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-gray-600">Premium plan purchased</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-gray-600">Support ticket resolved</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDataPage;