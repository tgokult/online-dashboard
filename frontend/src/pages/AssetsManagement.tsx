import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Filter, HardDrive } from 'lucide-react';
import api from '../services/api';

interface Asset {
    _id: string;
    assetId: string;
    assetName: string;
    category: string;
    status: string;
    assignedTo: { name: string } | null;
}

const AssetsManagement = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAssets = async () => {
        try {
            const res = await api.get('/assets');
            setAssets(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await api.delete(`/assets/${id}`);
                fetchAssets();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const filteredAssets = assets.filter(a =>
        a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.assetId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-5 rounded-2xl shadow-lg border border-slate-700/50 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex-1 w-full max-w-md hidden sm:block z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search assets by name or ID..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-light"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto z-10">
                    <button className="flex items-center space-x-2 px-5 py-3 text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-all">
                        <Filter size={18} />
                        <span className="font-medium">Filter</span>
                    </button>
                    <Link
                        to="/assets/new"
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 transition-all font-semibold transform active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Asset</span>
                    </Link>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-slate-800/40 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-xl">
                {loading ? (
                    <div className="p-16 flex justify-center">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-900/40 border-b border-slate-700/50 text-slate-400 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold w-1">Type</th>
                                    <th className="px-6 py-4 font-semibold">Asset ID</th>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Assigned To</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssets.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-16 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <HardDrive size={48} className="text-slate-700" />
                                                <p className="text-lg">No assets found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAssets.map(asset => (
                                        <tr key={asset._id} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-300 group-hover:bg-slate-600 transition-colors">
                                                    <HardDrive size={18} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-slate-400">{asset.assetId}</td>
                                            <td className="px-6 py-4 font-medium text-white">{asset.assetName}</td>
                                            <td className="px-6 py-4 text-slate-300">
                                                <span className="px-3 py-1 bg-slate-700/50 rounded-lg text-xs font-medium border border-slate-600/50">
                                                    {asset.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 text-xs rounded-lg font-medium border flex w-max items-center space-x-1.5
                                                    ${asset.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        asset.status === 'Assigned' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${asset.status === 'Available' ? 'bg-emerald-400' :
                                                            asset.status === 'Assigned' ? 'bg-purple-400' : 'bg-amber-400'
                                                        }`}></div>
                                                    <span>{asset.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                {asset.assignedTo ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">
                                                            {asset.assignedTo.name.charAt(0)}
                                                        </div>
                                                        <span>{asset.assignedTo.name}</span>
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link to={`/assets/edit/${asset._id}`} className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors">
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(asset._id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetsManagement;
