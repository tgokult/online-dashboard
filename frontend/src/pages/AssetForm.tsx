import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, HardDrive } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AssetForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        assetId: '',
        assetName: '',
        category: '',
        purchaseDate: '',
        status: 'Available',
        location: '',
        vendor: '',
        warrantyExpiry: '',
        maintenanceDue: '',
        purchasePrice: '',
        notes: '',
    });

    useEffect(() => {
        if (isEdit) {
            const fetchAsset = async () => {
                try {
                    const res = await api.get(`/assets/${id}`);
                    const asset = res.data;
                    setFormData({
                        assetId: asset.assetId,
                        assetName: asset.assetName,
                        category: asset.category,
                        purchaseDate: asset.purchaseDate ? asset.purchaseDate.substring(0, 10) : '',
                        status: asset.status,
                        location: asset.location || '',
                        vendor: asset.vendor || '',
                        warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.substring(0, 10) : '',
                        maintenanceDue: asset.maintenanceDue ? asset.maintenanceDue.substring(0, 10) : '',
                        purchasePrice: asset.purchasePrice?.toString() || '',
                        notes: asset.notes || '',
                    });
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAsset();
        }
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : null,
                warrantyExpiry: formData.warrantyExpiry || null,
                maintenanceDue: formData.maintenanceDue || null,
            };

            if (isEdit) {
                await api.put(`/assets/${id}`, payload);
            } else {
                await api.post('/assets', payload);
            }
            toast.success(isEdit ? 'Asset updated successfully' : 'Asset created successfully');
            navigate('/assets');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
            <div className="absolute top-10 left-[-10%] w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>

            <div className="flex items-center space-x-4 relative z-10">
                <Link to="/assets" className="p-2.5 bg-slate-800/50 backdrop-blur-md rounded-xl hover:bg-slate-700/50 border border-slate-700/50 transition-all text-slate-400 hover:text-white group">
                    <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{isEdit ? 'Edit Asset Data' : 'Register New Asset'}</h2>
                    <p className="text-slate-400 text-sm mt-1">{isEdit ? 'Modify existing equipment details' : 'Enter the specifications for the new equipment'}</p>
                </div>
            </div>

            <div className="bg-slate-800/40 rounded-3xl shadow-xl border border-slate-700/50 p-8 md:p-10 backdrop-blur-xl relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="flex items-center space-x-3 pb-6 border-b border-slate-700/50">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <HardDrive size={20} />
                        </div>
                        <h3 className="text-lg font-medium text-white">Hardware Specifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Asset Tag (ID) <span className="text-rose-400">*</span></label>
                            <input
                                required
                                type="text"
                                name="assetId"
                                value={formData.assetId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                                placeholder="e.g. LPT-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Asset Name <span className="text-rose-400">*</span></label>
                            <input
                                required
                                type="text"
                                name="assetName"
                                value={formData.assetName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                                placeholder="e.g. MacBook Pro M2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Category <span className="text-rose-400">*</span></label>
                            <select
                                required
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right .5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                            >
                                <option value="" className="bg-slate-800">Select category</option>
                                <option value="Laptop" className="bg-slate-800">Laptop</option>
                                <option value="Desktop" className="bg-slate-800">Desktop</option>
                                <option value="Monitor" className="bg-slate-800">Monitor</option>
                                <option value="Mobile" className="bg-slate-800">Mobile</option>
                                <option value="Server" className="bg-slate-800">Server</option>
                                <option value="Other" className="bg-slate-800">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Purchase Date <span className="text-rose-400">*</span></label>
                            <input
                                required
                                type="date"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light [color-scheme:dark]"
                            />
                        </div>
                        {isEdit && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Operational Status</label>
                                <select
                                    required
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-light appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right .5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                                >
                                    <option value="Available" className="bg-slate-800">Available</option>
                                    <option value="Maintenance" className="bg-slate-800">Maintenance</option>
                                </select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                                placeholder="Head office / Storage room"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Vendor</label>
                            <input
                                type="text"
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                                placeholder="Dell / Apple / Lenovo"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Warranty Expiry</label>
                            <input
                                type="date"
                                name="warrantyExpiry"
                                value={formData.warrantyExpiry}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Maintenance Due</label>
                            <input
                                type="date"
                                name="maintenanceDue"
                                value={formData.maintenanceDue}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300">Purchase Price</label>
                            <input
                                type="number"
                                name="purchasePrice"
                                value={formData.purchasePrice}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                                placeholder="65000"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                                placeholder="Condition, serial notes, procurement details..."
                            />
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-700/50 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 transition-all font-semibold active:scale-[0.98] disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Saving Data...' : isEdit ? 'Update Asset' : 'Register Asset'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetForm;
