import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">DevFlow Sprint Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Sprint Progress</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">80%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Time Left</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">3 Days</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Completed Points</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">32 / 40</p>
        </div>
      </div>
    </div>
  );
}
