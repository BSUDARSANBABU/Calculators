import React from 'react';
import DashboardTab from './components/DashboardTab';

export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans antialiased flex flex-col p-0 m-0">
      
      {/* Container Layout with absolutely zero outer margin top/bottom */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-6 my-0">
        
        {/* Main interactive operational calculator */}
        <DashboardTab />

      </div>

      {/* Modern, subtle background ambient glows */}
      <div className="fixed inset-0 -z-50 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-slate-200 blur-[110px] rounded-full"></div>
      </div>

    </div>
  );
}
