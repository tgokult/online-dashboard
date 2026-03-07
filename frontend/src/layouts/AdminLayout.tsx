import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ClipboardList, FileText, LogOut, Bell, Search, History } from 'lucide-react';
import api from '../services/api';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Assets', path: '/assets', icon: <Package size={20} /> },
        { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
        { name: 'Assignments', path: '/assignments', icon: <ClipboardList size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
        { name: 'Audit Logs', path: '/audit-logs', icon: <History size={20} /> },
    ];

    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.unreadCount);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };
        fetchNotifications();

        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-50 font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-900/10 blur-[100px] mix-blend-screen pointer-events-none"></div>

            {/* Sidebar */}
            <aside className="w-72 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 flex flex-col transition-all duration-300 z-20 m-4 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

                <div className="p-8 pb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                        <Package size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Asset<span className="text-cyan-400 font-light">Flow</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`group flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 relative overflow-hidden ${isActive
                                    ? 'text-white shadow-lg'
                                    : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-cyan-500/80 -z-10"></div>
                                )}
                                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </div>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">
                                G
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate">Gokul</p>
                                <p className="text-xs text-slate-400 truncate">Admin</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 w-full px-4 py-3.5 rounded-2xl transition-colors font-medium border border-transparent hover:border-rose-500/20"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 w-full lg:max-w-[calc(100vw-330px)]">
                {/* Header */}
                <header className="h-24 sticky top-0 z-20 flex items-center px-8 justify-between">
                    <div>
                        <h2 className="text-2xl font-bold capitalize text-white tracking-tight">
                            {location.pathname === '/' ? 'Dashboard Overview' : location.pathname.split('/')[1].replace('-', ' ')}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Manage and track your company assets efficiently.</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search anywhere..."
                                className="pl-10 pr-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-64 backdrop-blur-md transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/40 border border-slate-700/50 rounded-full backdrop-blur-md"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-slate-900 rounded-full"></span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
                                        <h3 className="font-semibold text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 text-sm">
                                                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification._id}
                                                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                                                    className={`p-4 border-b last:border-0 border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-slate-800/50' : 'opacity-70'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start gap-3">
                                                        <p className={`text-sm ${!notification.isRead ? 'text-white' : 'text-slate-300'}`}>
                                                            {notification.message}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-2 font-medium">
                                                        {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 pb-8 custom-scrollbar">
                    {/* Page Content Rendered Here */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
