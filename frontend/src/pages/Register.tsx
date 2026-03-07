import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Cpu, Mail, Lock, User } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-600/20 blur-[100px] mix-blend-screen animate-pulse duration-10000 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-screen animate-pulse duration-7000 pointer-events-none"></div>

            <div className="glass max-w-md w-full relative z-10 p-10 rounded-3xl mx-4 transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 mb-6 shadow-lg shadow-cyan-500/30">
                        <Cpu size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Create Account
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Join the <span className="text-gradient font-medium">Asset Tracking Platform</span>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center p-3 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-800/80 transition-all font-light"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-slate-800/80 transition-all font-light"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-800/80 transition-all font-light"
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25 transform transition-all active:scale-[0.98] mt-2 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{loading ? 'Creating account...' : 'Create Account'}</span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </button>

                    <div className="pt-6 border-t border-slate-700/50 text-center text-sm">
                        <span className="text-slate-400">Already have an account? </span>
                        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign in instead
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
