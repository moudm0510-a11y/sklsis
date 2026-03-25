import { LayoutDashboard, Calendar, GraduationCap, BookOpen, Settings, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, role }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar /> },
    { id: 'grades', label: 'Grades', icon: <GraduationCap /> },
    { id: 'cahier', label: 'Cahier de Texte', icon: <BookOpen /> },
  ];

  if (role === 'admin' || role === 'super_admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: <Settings /> });
  }
  if (role === 'super_admin') {
    menuItems.push({ id: 'super', label: 'Super Admin', icon: <ShieldCheck /> });
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r h-full p-6 hidden md:flex flex-col">
      <div className="mb-10 px-2 text-2xl font-black text-blue-700 italic">SCHOOL PROTOTYPE</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-blue-50'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}