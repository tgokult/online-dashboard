import { useEffect, useState } from 'react';
import { Download, FileText, BarChart3, ShieldAlert, Wrench } from 'lucide-react';
import api from '../services/api';

const Reports = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [warrantyAlerts, setWarrantyAlerts] = useState<any[]>([]);
    const [maintenanceSchedule, setMaintenanceSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignmentRes, statsRes, warrantyRes, maintenanceRes] = await Promise.all([
                    api.get('/assignments'),
                    api.get('/assets/stats'),
                    api.get('/assets/warranty-alerts'),
                    api.get('/assets/maintenance-schedule'),
                ]);
                setAssignments(assignmentRes.data);
                setStats(statsRes.data);
                setWarrantyAlerts(warrantyRes.data);
                setMaintenanceSchedule(maintenanceRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExportCSV = () => {
        const headers = ['Asset ID', 'Asset Name', 'Employee Name', 'Department', 'Assigned Date', 'Return Date', 'Status'];
        const rows = assignments.map(a => [
            a.assetId?.assetId,
            a.assetId?.assetName,
            a.employeeId?.name,
            a.employeeId?.department,
            new Date(a.assignDate).toLocaleDateString(),
            a.returnDate ? new Date(a.returnDate).toLocaleDateString() : 'N/A',
            a.returnDate ? 'Returned' : 'Currently Assigned'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'asset_tracking_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-6 rounded-3xl shadow-xl border border-slate-700/50 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

                <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">System Reports</h2>
                        <p className="text-sm text-slate-400 mt-1">Export your comprehensive asset tracking logs</p>
                    </div>
                </div>

                <button
                    onClick={handleExportCSV}
                    className="relative z-10 flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-700/50 text-white rounded-xl hover:bg-slate-700 shadow-lg border border-slate-600 transition-all font-semibold w-full sm:w-auto hover:border-cyan-500/50 group"
                >
                    <Download size={18} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Download CSV Log</span>
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                        <p className="text-sm text-slate-400">Inventory</p>
                        <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                        <p className="text-sm text-slate-400">Assigned</p>
                        <p className="mt-2 text-3xl font-bold text-white">{stats.assigned}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                        <p className="text-sm text-slate-400">Warranty Risk</p>
                        <p className="mt-2 text-3xl font-bold text-white">{stats.warrantyExpiringSoon}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                        <p className="text-sm text-slate-400">Maintenance Due</p>
                        <p className="mt-2 text-3xl font-bold text-white">{stats.maintenanceDueSoon}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-amber-500/20 bg-slate-800/40 p-6 shadow-xl">
                    <div className="mb-4 flex items-center gap-3 text-white">
                        <ShieldAlert className="text-amber-400" size={20} />
                        <h3 className="text-lg font-semibold">Warranty Expiry Watchlist</h3>
                    </div>
                    <div className="space-y-3">
                        {warrantyAlerts.length === 0 ? (
                            <p className="text-sm text-slate-400">No assets are approaching warranty expiry.</p>
                        ) : (
                            warrantyAlerts.slice(0, 5).map((asset) => (
                                <div key={asset._id} className="rounded-2xl border border-slate-700/50 bg-slate-900/40 px-4 py-3">
                                    <p className="font-medium text-white">{asset.assetName}</p>
                                    <p className="mt-1 text-sm text-slate-400">{asset.assetId} • expires {new Date(asset.warrantyExpiry).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-cyan-500/20 bg-slate-800/40 p-6 shadow-xl">
                    <div className="mb-4 flex items-center gap-3 text-white">
                        <Wrench className="text-cyan-400" size={20} />
                        <h3 className="text-lg font-semibold">Maintenance Schedule</h3>
                    </div>
                    <div className="space-y-3">
                        {maintenanceSchedule.length === 0 ? (
                            <p className="text-sm text-slate-400">No maintenance items are scheduled.</p>
                        ) : (
                            maintenanceSchedule.slice(0, 5).map((asset) => (
                                <div key={asset._id} className="rounded-2xl border border-slate-700/50 bg-slate-900/40 px-4 py-3">
                                    <p className="font-medium text-white">{asset.assetName}</p>
                                    <p className="mt-1 text-sm text-slate-400">{asset.assetId} • due {asset.maintenanceDue ? new Date(asset.maintenanceDue).toLocaleDateString() : 'in maintenance'}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/40 rounded-3xl shadow-xl border border-slate-700/50 p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] backdrop-blur-xl relative overflow-hidden text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                {loading ? (
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <div className="text-center space-y-6 relative z-10 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 mx-auto bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-700/50 shadow-inner">
                            <FileText size={40} className="text-slate-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-white tracking-tight">Generation Ready</h3>
                            <p className="text-slate-400 max-w-md mx-auto mt-3 leading-relaxed">
                                Successfully retrieved <strong className="text-cyan-400 font-bold">{assignments.length}</strong> lifecycle records. The dataset contains full history logs of all equipment allocations and returns across the organization.
                            </p>
                        </div>

                        <div className="inline-block mt-4">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 transition-all font-semibold active:scale-[0.98]"
                            >
                                <Download size={18} />
                                <span>Generate CSV Export</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
