import React, { useEffect, useState } from 'react';
import { ArrowLeftRight, CheckSquare, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Assignment = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({ assetId: '', employeeId: '' });

    const fetchData = async () => {
        try {
            const [assnRes, ascRes, empRes] = await Promise.all([
                api.get('/assignments'),
                api.get('/assets'),
                api.get('/employees')
            ]);
            setAssignments(assnRes.data);
            setAssets(ascRes.data.filter((a: any) => a.status === 'Available'));
            setEmployees(empRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/assignments/assign', formData);
            setFormData({ assetId: '', employeeId: '' });
            toast.success('Asset assigned successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error assigning asset');
        }
    };

    const handleReturn = async (id: string) => {
        if (window.confirm('Mark this asset as returned?')) {
            try {
                await api.post(`/assignments/return/${id}`);
                toast.success('Asset marked as returned');
                fetchData();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to mark return');
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in mt-2 fade-in duration-500 relative">
            {/* Background glows */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

            {/* Assign Form */}
            <div className="bg-slate-800/40 p-8 rounded-3xl shadow-xl border border-slate-700/50 backdrop-blur-xl flex flex-col h-fit relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-indigo-500/20"></div>

                <div className="flex items-center space-x-4 mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <ArrowLeftRight size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Assign Asset</h2>
                        <p className="text-slate-400 text-xs mt-1">Deploy equipment to staff</p>
                    </div>
                </div>

                <form onSubmit={handleAssign} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Select Asset <span className="text-emerald-400 text-xs ml-1">(Available Only)</span></label>
                        <select
                            required
                            value={formData.assetId}
                            onChange={e => setFormData({ ...formData, assetId: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right .5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                            <option value="" className="bg-slate-800">-- Choose Asset --</option>
                            {assets.map(a => <option key={a._id} value={a._id} className="bg-slate-800">{a.assetName} ({a.assetId})</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Select Employee</label>
                        <select
                            required
                            value={formData.employeeId}
                            onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-light appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right .5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                            <option value="" className="bg-slate-800">-- Choose Employee --</option>
                            {employees.map(e => <option key={e._id} value={e._id} className="bg-slate-800">{e.name} - {e.department}</option>)}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={!assets.length || !employees.length}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 transition-all font-semibold mt-6 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Create Assignment
                    </button>
                </form>
            </div>

            {/* Active Assignments */}
            <div className="lg:col-span-2 bg-slate-800/40 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                    <h2 className="text-xl font-bold text-white tracking-tight">Assignment Ledger</h2>
                    <div className="px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full text-xs text-slate-400 font-medium">History Logs</div>
                </div>

                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-md z-10 border-b border-slate-700/50">
                            <tr className="text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Asset Details</th>
                                <th className="px-6 py-4 font-semibold">Assigned Engineer</th>
                                <th className="px-6 py-4 font-semibold">Deployment Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-16 text-center">
                                        <div className="relative w-10 h-10 mx-auto">
                                            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : assignments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Clock size={32} className="text-slate-600 mb-2" />
                                            <p>No active assignments found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                assignments.map(assn => (
                                    <tr key={assn._id} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-cyan-400">
                                                    <ArrowLeftRight size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{assn.assetId?.assetName}</p>
                                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{assn.assetId?.assetId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold ring-2 ring-slate-800">
                                                    {assn.employeeId?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{assn.employeeId?.name}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{assn.employeeId?.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-light">
                                            {new Date(assn.assignDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {assn.returnDate ? (
                                                <span className="inline-flex items-center justify-end space-x-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl transition-all">
                                                    <CheckSquare size={16} />
                                                    <span>Returned</span>
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleReturn(assn._id)}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-xl hover:bg-slate-600 hover:text-white hover:border-slate-500 text-sm font-medium transition-all shadow-sm active:scale-95"
                                                >
                                                    Mark Returned
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Assignment;
