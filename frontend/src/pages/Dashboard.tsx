import { useEffect, useState } from 'react';
import { Package, Clock, AlertTriangle, Users, Activity, ShieldAlert, Wrench, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

interface DashboardAnalytics {
    summary: { totalAssets: number; totalEmployees: number; activeAssignments: number; totalAssignments: number; };
    categories: { name: string; value: number }[];
    statusData: { name: string; value: number }[];
    alerts: { warrantyExpiringSoon: number; maintenanceDueSoon: number };
    recentAssignments: {
        _id: string;
        assetName: string;
        assetTag: string;
        employeeName: string;
        department: string;
        assignDate: string;
        returnDate: string | null;
    }[];
}

const Dashboard = () => {
    const [analytics, setAnalytics] = useState<DashboardAnalytics>({
        summary: { totalAssets: 0, totalEmployees: 0, activeAssignments: 0, totalAssignments: 0 },
        categories: [],
        statusData: [],
        alerts: { warrantyExpiringSoon: 0, maintenanceDueSoon: 0 },
        recentAssignments: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/dashboard');
                if (res.data.success) {
                    setAnalytics(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getStatusCount = (statusName: string) => {
        const item = analytics.statusData.find((s: any) => s.name === statusName);
        return item ? item.value : 0;
    };

    const cards = [
        { title: 'Total Assets', value: analytics.summary.totalAssets, icon: <Package size={24} />, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-indigo-500/20' },
        { title: 'Total Employees', value: analytics.summary.totalEmployees, icon: <Users size={24} />, gradient: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/20' },
        { title: 'Active Assignments', value: analytics.summary.activeAssignments, icon: <Clock size={24} />, gradient: 'from-purple-500 to-fuchsia-500', shadow: 'shadow-purple-500/20' },
        { title: 'Maintenance Assets', value: getStatusCount('Maintenance'), icon: <AlertTriangle size={24} />, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' },
    ];

    const pieData = analytics.statusData.map((item: any) => {
        let color = '#3B82F6';
        if (item.name === 'Available') color = '#10B981';
        if (item.name === 'Assigned') color = '#A855F7';
        if (item.name === 'Maintenance') color = '#F59E0B';
        return { name: item.name, value: item.value, color };
    });

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-medium text-white tracking-tight">System Metrics</h3>
                    <p className="text-slate-400 text-sm mt-1">Real-time overview of your asset allocation.</p>
                </div>
                <Link to="/reports" className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-sm font-medium text-white transition-all backdrop-blur-sm group">
                    <Activity size={16} className="text-cyan-400" />
                    <span>Generate Report</span>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className={`relative overflow-hidden bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50 backdrop-blur-xl group hover:-translate-y-1 transition-all duration-300 shadow-xl ${card.shadow}`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-20`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
                                {card.icon}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
                            <h3 className="text-4xl font-bold text-white tracking-tight">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6 shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Warranty Alerts</p>
                            <h3 className="mt-3 text-4xl font-bold text-white">{analytics.alerts.warrantyExpiringSoon}</h3>
                            <p className="mt-2 text-sm text-slate-300">Assets with warranty expiring in the next 30 days.</p>
                        </div>
                        <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300">
                            <ShieldAlert size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-sky-500/5 p-6 shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Maintenance Due</p>
                            <h3 className="mt-3 text-4xl font-bold text-white">{analytics.alerts.maintenanceDueSoon}</h3>
                            <p className="mt-2 text-sm text-slate-300">Assets due for maintenance in the next 14 days.</p>
                        </div>
                        <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-300">
                            <Wrench size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section - Category Dashboard (BarChart) */}
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl lg:col-span-2 flex flex-col h-[420px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-6 z-10">
                        <h3 className="text-lg font-semibold text-white tracking-tight">Categories Matrix</h3>
                        <div className="px-3 py-1 rounded-full bg-slate-700/50 text-xs font-medium text-slate-300 border border-slate-600/50">
                            Live Data
                        </div>
                    </div>

                    <div className="flex-1 w-full h-full min-h-[300px] z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.categories} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <RechartsTooltip 
                                    cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
                                    contentStyle={{
                                        borderRadius: '16px', border: '1px solid rgba(51, 65, 85, 0.8)',
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', color: '#F8FAFC'
                                    }}
                                />
                                <Bar dataKey="value" fill="#0EA5E9" radius={[6, 6, 0, 0]}>
                                    {analytics.categories.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Matrix (PieChart) */}
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl col-span-1 flex flex-col h-[420px] relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-white tracking-tight mb-4">Status Distribution</h3>
                    <div className="flex-1 w-full h-full min-h-[250px] z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={6} dataKey="value" stroke="none" cornerRadius={8}>
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={pieData[index].color} style={{ filter: `drop-shadow(0px 4px 8px ${pieData[index].color}40)` }} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(value: any) => [`${value} Assets`, 'Quantity']}
                                    contentStyle={{
                                        borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.8)',
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#F8FAFC'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-slate-300 ml-1 font-medium text-sm">{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white tracking-tight">Recent Assignment Activity</h3>
                            <p className="mt-1 text-sm text-slate-400">Latest lifecycle actions across the organization.</p>
                        </div>
                        <div className="rounded-full border border-slate-700/50 bg-slate-900/50 px-3 py-1 text-xs text-slate-300">
                            {analytics.summary.totalAssignments} total events
                        </div>
                    </div>

                    <div className="space-y-4">
                        {analytics.recentAssignments.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-700/60 p-8 text-center text-sm text-slate-400">
                                No assignment activity yet.
                            </div>
                        ) : (
                            analytics.recentAssignments.map((item) => (
                                <div key={item._id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-700/40 bg-slate-900/30 px-4 py-4">
                                    <div>
                                        <p className="font-medium text-white">{item.assetName}</p>
                                        <p className="mt-1 text-sm text-slate-400">{item.assetTag} assigned to {item.employeeName} • {item.department}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="text-slate-200">{new Date(item.assignDate).toLocaleDateString()}</p>
                                        <p className={`mt-1 ${item.returnDate ? 'text-emerald-400' : 'text-cyan-400'}`}>
                                            {item.returnDate ? 'Returned' : 'Active'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all group-hover:bg-indigo-500/20"></div>

                    <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight">Quick Operations</h3>
                        <p className="text-sm text-slate-400 mt-1">Jump into the workflows your admin team uses most.</p>
                    </div>

                    <div className="mt-6 space-y-3">
                        <Link to="/assets/new" className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-xl text-white font-medium shadow-lg shadow-cyan-500/25 transition-all">
                            <Package size={18} />
                            <span>Register Asset</span>
                        </Link>
                        <Link to="/assignments" className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-br from-purple-600 to-fuchsia-700 hover:from-purple-500 hover:to-fuchsia-600 rounded-xl text-white font-medium shadow-lg shadow-purple-500/25 transition-all">
                            <Users size={18} />
                            <span>Assign Asset</span>
                        </Link>
                        <Link to="/reports" className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-3 text-slate-200 transition-all hover:border-cyan-500/40 hover:text-white">
                            <span>Open executive reports</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
