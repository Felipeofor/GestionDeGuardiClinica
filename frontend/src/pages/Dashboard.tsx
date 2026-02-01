import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { Users, Clock, AlertTriangle, Activity, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
    const [stats, setStats] = useState({ active: 0, waiting: 0, critical: 0 });

    useEffect(() => {
        axios.get('/api/admissions').then(res => {
            const data = res.data;
            setStats({
                active: data.length,
                waiting: data.filter((d: any) => d.status === 'EN_ESPERA').length,
                critical: data.filter((d: any) => d.triageLevel === 'ROJO' || d.triageLevel === 'NARANJA').length
            });
        }).catch(err => console.error(err));
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200 hover:shadow-card transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-secondary-500 font-medium tracking-wide uppercase">{title}</p>
                    <h3 className="text-3xl font-bold mt-2 text-secondary-900 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon size={22} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                    <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp size={12} />
                        {trend}
                    </span>
                    <span className="text-secondary-400">vs. mes anterior</span>
                </div>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-secondary-900">Panel de Control</h1>
                <p className="text-secondary-500">Resumen de actividad y estado de la guardia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Pacientes Activos" 
                    value={stats.active} 
                    icon={Users} 
                    colorClass="bg-blue-50 text-blue-600" 
                    trend="+12%"
                />
                <StatCard 
                    title="En Espera" 
                    value={stats.waiting} 
                    icon={Clock} 
                    colorClass="bg-amber-50 text-amber-600"
                    trend="-5%"
                />
                <StatCard 
                    title="Pacientes Críticos" 
                    value={stats.critical} 
                    icon={AlertTriangle} 
                    colorClass="bg-red-50 text-red-600"
                    trend="+2%"
                />
                {/* 
                <StatCard 
                    title="Tiempo Promedio" 
                    value="45m" 
                    icon={Activity} 
                    colorClass="bg-emerald-50 text-emerald-600"
                /> 
                */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-secondary-900">Actividad Reciente</h3>
                        <button className="text-sm text-primary-600 font-medium hover:text-primary-700">Ver todo</button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mb-4">
                            <Activity className="text-secondary-300" />
                        </div>
                        <p className="text-secondary-900 font-medium">Sin actividad reciente</p>
                        <p className="text-sm text-secondary-500 text-center max-w-xs mt-1">
                            Las nuevas admisiones y actualizaciones de triage aparecerán aquí.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">Estado de Unidades</h3>
                    <div className="flex-1 flex items-center justify-center">
                         <div className="text-center">
                            <p className="text-secondary-400 text-sm">Visualización de camillas y boxes</p>
                            <p className="text-xs text-secondary-300 mt-1">(Próximamente)</p>
                         </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
