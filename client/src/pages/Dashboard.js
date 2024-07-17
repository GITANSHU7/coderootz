// write structrued code here
import React from 'react';
import ChartComponent from './ChartComponent';
import RevenueChart from './RevenueChart';

const Dashboard = () => {
    return (
      <div className="  flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6  rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Sales Data</h1>
          <ChartComponent />
        </div>
        <div className="p-6  rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Revenue Data</h1>
          <RevenueChart />
        </div>
      </div>
    </div>
    )
}

export default Dashboard;