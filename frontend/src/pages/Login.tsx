import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, Building2, Activity, ChevronRight } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { email, password, tenantId: tenantId || undefined });
            login(res.data.token, { email: res.data.email, role: res.data.role, tenantId: res.data.tenantId });
            navigate('/dashboard');
        } catch (err) {
            setError('Credenciales inválidas o ID de clínica incorrecto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-surface-dim">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-800 to-primary-950 relative overflow-hidden items-center justify-center text-white p-12">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                            <Activity className="h-8 w-8 text-primary-300" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">MedicalGuard</h1>
                    </div>
                    <h2 className="text-4xl font-light mb-6 leading-tight">
                        Gestión hospitalaria <br/>
                        <span className="font-semibold text-primary-300">reimaginada.</span>
                    </h2>
                    <p className="text-primary-100 text-lg leading-relaxed border-l-4 border-primary-500 pl-6">
                        Plataforma integral para el control de admisiones, triaje y gestión de pacientes en tiempo real.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20" />
                <div className="absolute top-12 right-12 w-32 h-32 bg-primary-400 rounded-full blur-2xl opacity-20" />
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-secondary-900 tracking-tight">Bienvenido de nuevo</h2>
                        <p className="mt-2 text-secondary-500">
                            Ingrese sus credenciales para acceder al sistema.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-accent-red/10 border-l-4 border-accent-red text-accent-red p-4 rounded-r-md text-sm font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">ID de Clínica</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        className="input-premium !pl-10"
                                        value={tenantId}
                                        onChange={e => setTenantId(e.target.value)}
                                        placeholder="Ej: CLINICA-CENTRAL"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Correo Profesional</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input 
                                        type="email" 
                                        required
                                        className="input-premium !pl-10"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="dr.garcia@medicalguard.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Contraseña</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input 
                                        type="password" 
                                        required
                                        className="input-premium !pl-10"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full btn-primary flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                            ) : (
                                <>
                                    Acceder al Portal
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-secondary-400 mt-8">
                        © 2024 MedicalGuard Platform. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};
