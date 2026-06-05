'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
interface DashboardLayoutProps {
    children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (<div className="min-h-screen bg-slate-50 flex">
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

      
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)}/>
        
        <main className="flex-1 p-5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>);
}
