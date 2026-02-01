import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { Search, Filter, MoreHorizontal, Calendar, CreditCard } from 'lucide-react';

export const PatientList = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get('/api/patients').then(res => setPatients(res.data));
    }, []);

    const filtered = patients.filter(p => 
        p.firstName.toLowerCase().includes(filter.toLowerCase()) || 
        p.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        p.dni.includes(filter)
    );

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Directorio de Pacientes</h1>
                    <p className="text-secondary-500">Gestión y búsqueda del padrón de pacientes.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input 
                            placeholder="Buscar por nombre o DNI..." 
                            className="input-premium !pl-10"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary-50/50 border-b border-secondary-200">
                                <th className="p-5 font-semibold text-xs text-secondary-500 uppercase tracking-wider">Paciente</th>
                                <th className="p-5 font-semibold text-xs text-secondary-500 uppercase tracking-wider">Documento</th>
                                <th className="p-5 font-semibold text-xs text-secondary-500 uppercase tracking-wider">Cobertura</th>
                                <th className="p-5 font-semibold text-xs text-secondary-500 uppercase tracking-wider">Edad / Fecha Nac.</th>
                                <th className="p-5 font-semibold text-xs text-secondary-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-primary-50/30 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors font-medium">
                                                {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-secondary-900">{p.firstName} {p.lastName}</div>
                                                <div className="text-xs text-secondary-400">ID: {p.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-secondary-700">
                                            <CreditCard size={16} className="text-secondary-400" />
                                            <span className="font-medium">{p.dni}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.insurance ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-600'}`}>
                                            {p.insurance || 'Particular'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-secondary-600">
                                            <Calendar size={16} className="text-secondary-400" />
                                            {new Date(p.birthDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-secondary-300" size={24} />
                        </div>
                        <h3 className="text-secondary-900 font-medium">No se encontraron pacientes</h3>
                        <p className="text-secondary-500 text-sm mt-1">Intente ajustar los filtros de búsqueda.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-secondary-500 px-2">
                <p>Mostrando {filtered.length} resultados</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-secondary-200 rounded-md hover:bg-white disabled:opacity-50" disabled>Anterior</button>
                    <button className="px-3 py-1 border border-secondary-200 rounded-md hover:bg-white disabled:opacity-50" disabled>Siguiente</button>
                </div>
            </div>
        </Layout>
    );
};
