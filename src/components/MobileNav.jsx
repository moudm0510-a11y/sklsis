import { LayoutDashboard, Calendar, GraduationCap, Settings } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="md:hidden h-16 bg-white border-t flex justify-around items-center fixed bottom-0 w-full z-50">
      <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}>
        <LayoutDashboard />
      </button>
      <button onClick={() => setActiveTab('schedule')} className={activeTab === 'schedule' ? 'text-blue-600' : 'text-gray-400'}>
        <Calendar />
      </button>
      <button onClick={() => setActiveTab('grades')} className={activeTab === 'grades' ? 'text-blue-600' : 'text-gray-400'}>
        <GraduationCap />
      </button>
      <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'text-blue-600' : 'text-gray-400'}>
        <Settings />
      </button>
    </nav>
  );
}