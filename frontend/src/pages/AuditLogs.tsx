import { useState, useEffect } from 'react';
import { History, Search, RefreshCw, ShieldAlert, Cpu, UserCheck } from 'lucide-react';
import api from '../services/api';

const AuditLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async (currentPage = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/auditlogs?page=${currentPage}&limit=20`);
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    const handleRefresh = () => {
        fetchLogs(page);
    };

    const clearLogs = async () => {
        if (window.confirm("Are you sure you want to clear all audit logs? This action cannot be undone.")) {
            try {
                await api.delete('/auditlogs/clear');
                fetchLogs(1);
            } catch (error) {
                console.error("Failed to clear logs", error);
            }
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE': return <Cpu size={16} className="text-emerald-400" />;
            case 'UPDATE': return <RefreshCw size={16} className="text-amber-400" />;
            case 'ASSIGN': return <UserCheck size={16} className="text-indigo-400" />;
            case 'RETURN': return <History size={16} className="text-cyan-400" />;
            case 'DELETE': return <ShieldAlert size={16} className="text-rose-400" />;
            default: return <History size={16} className="text-slate-400" />;
        }
    };

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'UPDATE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'ASSIGN': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'RETURN': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'DELETE': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const filteredLogs = logs.filter(log =>
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full sm:w-64 backdrop-blur-xl transition-all font-light"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleRefresh}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 rounded-xl transition-all shadow-sm backdrop-blur-xl group"
                    >
                        <RefreshCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
                        <span className="font-medium text-sm">Refresh</span>
                    </button>
                    <button
                        onClick={clearLogs}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-all shadow-sm backdrop-blur-xl group"
                    >
                        <ShieldAlert size={16} />
                        <span className="font-medium text-sm">Clear Logs</span>
                    </button>
                </div>
            </div>

            <div className="bg-slate-800/40 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-xl relative z-10">
                {loading && logs.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700 text-slate-500">
                            <History size={32} />
                        </div>
                        <p>No audit logs found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700/50 bg-slate-800/50 text-sm tracking-wide text-slate-400 font-medium">
                                    <th className="py-4 px-6">Timestamp</th>
                                    <th className="py-4 px-6">Action</th>
                                    <th className="py-4 px-6">Details</th>
                                    <th className="py-4 px-6 text-right">Performed By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 text-sm font-light">
                                {filteredLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-700/20 transition-colors group">
                                        <td className="py-4 px-6 whitespace-nowrap text-slate-300">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getActionBadge(log.action)}`}>
                                                {getActionIcon(log.action)}
                                                {log.action}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-300 max-w-md truncate">
                                            {log.details}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                                    {(log.performedBy?.name || 'S')[0]}
                                                </div>
                                                <span className="text-slate-300 font-medium">{log.performedBy?.name || 'System / Admin'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
