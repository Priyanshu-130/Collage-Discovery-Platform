import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-center text-xs font-medium text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} Colla. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Support Desk</a>
        </div>
      </div>
    </footer>
  );
}
