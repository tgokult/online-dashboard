import { useEffect, useState } from 'react';
import { Package, CheckCircle, Clock, AlertTriangle, Activity, ArrowRight, Users } from 'lucide-react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, assigned: 0, available: 0, maintenance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/assets/stats');
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Assets', value: stats.total, icon: <Package size={24} />, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-indigo-500/20' },
        { title: 'Available', value: stats.available, icon: <CheckCircle size={24} />, gradient: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/20' },
        { title: 'Assigned', value: stats.assigned, icon: <Clock size={24} />, gradient: 'from-purple-500 to-fuchsia-500', shadow: 'shadow-purple-500/20' },
        { title: 'Maintenance', value: stats.maintenance, icon: <AlertTriangle size={24} />, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' },
    ];

    const pieData = [
        { name: 'Available', value: stats.available, color: '#10B981' }, // Emerald 500
        { name: 'Assigned', value: stats.assigned, color: '#A855F7' }, // Purple 500
        { name: 'Maintenance', value: stats.maintenance, color: '#F59E0B' }, // Amber 500
    ];

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
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-sm font-medium text-white transition-all backdrop-blur-sm group">
                    <Activity size={16} className="text-cyan-400" />
                    <span>Generate Report</span>
                </button>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl lg:col-span-2 flex flex-col h-[420px] relative overflow-hidden">
                    {/* Subtle glow effect behind chart */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-6 z-10">
                        <h3 className="text-lg font-semibold text-white tracking-tight">Asset Distribution Matrix</h3>
                        <div className="px-3 py-1 rounded-full bg-slate-700/50 text-xs font-medium text-slate-300 border border-slate-600/50">
                            Live Data
                        </div>
                    </div>

                    <div className="flex-1 w-full h-full min-h-[300px] z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90}
                                    outerRadius={130}
                                    paddingAngle={6}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={8}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-md outline-none" style={{ filter: `drop-shadow(0px 4px 8px ${entry.color}40)` }} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value: any) => [`${value} Assets`, 'Quantity']}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid rgba(51, 65, 85, 0.8)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#F8FAFC'
                                    }}
                                    itemStyle={{ color: '#E2E8F0', fontWeight: 500 }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-300 ml-1 font-medium">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl flex flex-col relative overflow-hidden group">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all group-hover:bg-indigo-500/20"></div>

                    <h3 className="text-lg font-semibold text-white tracking-tight mb-6">Quick Operations</h3>

                    <div className="space-y-4 flex-1">
                        <Link to="/assets/new" className="block relative p-5 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl border border-slate-600/30 hover:border-cyan-500/50 transition-all group/card overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.5s_infinite]"></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white block">Register Asset</span>
                                        <span className="text-xs text-slate-400">Add new equipment</span>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-500 group-hover/card:text-cyan-400 group-hover/card:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        <Link to="/assignments" className="block relative p-5 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl border border-slate-600/30 hover:border-purple-500/50 transition-all group/card overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.5s_infinite]"></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white block">Assign Asset</span>
                                        <span className="text-xs text-slate-400">Distribute to team</span>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-500 group-hover/card:text-purple-400 group-hover/card:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-300">System Online</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 pl-5">All services operating normally.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
