import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import api from '../services/api';

interface Employee {
    _id: string;
    name: string;
    email: string;
    department: string;
}

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', department: '' });

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/employees', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', department: '' });
            fetchEmployees();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error creating employee');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Delete this employee?')) {
            try {
                await api.delete(`/employees/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-5 rounded-2xl shadow-lg border border-slate-700/50 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white tracking-tight">Team Directory</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage personnel and roles</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="relative z-10 w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-xl hover:from-purple-500 hover:to-indigo-400 shadow-lg shadow-purple-500/25 transition-all font-semibold transform active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                        </div>
                    </div>
                ) : (
                    employees.map(emp => (
                        <div key={emp._id} className="bg-slate-800/40 p-6 rounded-3xl shadow-xl border border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-300 relative group overflow-hidden">
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <button
                                onClick={(e) => handleDelete(emp._id, e)}
                                className="absolute top-4 right-4 text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 p-2.5 rounded-xl transition-all z-10 transform scale-95 group-hover:scale-100"
                                title="Remove employee"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex flex-col items-center text-center relative z-10 mt-2">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-3xl font-bold mb-5 shadow-lg shadow-purple-500/20 ring-4 ring-slate-800">
                                    {emp.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{emp.name}</h3>
                                <p className="text-slate-400 text-sm mb-4 mt-1">{emp.email}</p>

                                <div className="mt-auto pt-4 border-t border-slate-700/50 w-full">
                                    <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-slate-900/50 border border-slate-700 text-cyan-400 text-xs font-semibold rounded-lg">
                                        <Users size={14} />
                                        <span>{emp.department}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md p-8 animate-in zoom-in-95 duration-200 relative overflow-hidden">

                        {/* Modal Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">New Employee</h3>
                            <p className="text-slate-400 text-sm mb-6">Add a team member to the directory.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Full Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-light" placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light" placeholder="jane@company.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Department</label>
                                    <input required type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-light" placeholder="Engineering" />
                                </div>

                                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-700/50">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors font-medium border border-transparent hover:border-slate-600">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-xl hover:from-purple-500 hover:to-indigo-400 font-semibold shadow-lg shadow-purple-500/25 transition-all">Save Member</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
