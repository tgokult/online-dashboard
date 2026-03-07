import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Cpu, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[100px] mix-blend-screen animate-pulse duration-10000 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-cyan-500/20 blur-[100px] mix-blend-screen animate-pulse duration-7000 pointer-events-none"></div>

            <div className="glass max-w-md w-full relative z-10 p-10 rounded-3xl mx-4 transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 mb-6 shadow-lg shadow-indigo-500/30">
                        <Cpu size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Access your <span className="text-gradient font-medium">Asset Tracking Dashboard</span>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center p-3 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
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
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-slate-800/80 transition-all font-light"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25 transform transition-all active:scale-[0.98] mt-2 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{loading ? 'Authenticating...' : 'Sign in'}</span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </button>

                    <div className="pt-6 border-t border-slate-700/50 text-center text-sm">
                        <span className="text-slate-400">Don't have an account? </span>
                        <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                            Apply for access
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
