import React, { useState } from 'react';
import { Home, Users, ClipboardList, LogOut, PlusCircle, HeartPulse, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Panel Principal', path: '/dashboard', icon: Home },
        { name: 'Admitir Paciente', path: '/admit', icon: PlusCircle },
        { name: 'Cola de Triage', path: '/triage', icon: ClipboardList },
        { name: 'Atención Médica', path: '/care', icon: HeartPulse },
        { name: 'Pacientes Activos', path: '/patients', icon: Users },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-surface-dim overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-primary-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Brand */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-700/50 rounded-lg border border-primary-600">
                                <HeartPulse size={24} className="text-primary-300" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">MedicalGuard</h1>
                                <p className="text-xs text-primary-300 opacity-80 font-medium tracking-wider">CLINICAL SUITE</p>
                            </div>
                        </div>
                        <button onClick={toggleSidebar} className="lg:hidden text-white/70 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        <div className="mb-2 px-3 text-xs font-bold text-primary-400 uppercase tracking-wider">Menu Principal</div>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path} 
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-primary-700 text-white shadow-lg shadow-primary-900/20' 
                                            : 'text-primary-100 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon size={20} className={`${isActive ? 'text-primary-300' : 'text-primary-400 group-hover:text-primary-200'}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-300 rounded-l-full" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-white/10 bg-primary-950/30">
                        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-white">{user?.email?.split('@')[0]}</p>
                                <p className="text-xs text-primary-300 truncate">{user?.role}</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={logout} 
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={18} />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-surface-dim shadow-soft flex items-center justify-between px-6 lg:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-50 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-secondary-800 tracking-tight">
                            {navItems.find(i => i.path === location.pathname)?.name || 'Portal Médico'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center text-xs font-medium text-secondary-500 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-100">
                             <Building2 size={14} className="mr-1.5 text-primary-600" />
                            {user?.tenantId || 'Hospital Central'}
                        </div>
                        <button className="relative p-2 text-secondary-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-surface-light p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper component for Icon
import { Building2 } from 'lucide-react';
