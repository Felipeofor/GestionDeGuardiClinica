import { useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { Search, Plus, UserPlus, Fingerprint, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdmitPatient = () => {
    const [dni, setDni] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [newPatient, setNewPatient] = useState({ firstName: '', lastName: '', dni: '', insurance: '', birthDate: '' });
    const navigate = useNavigate();

    const search = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/api/patients?dni=${dni}`);
            setPatients(res.data);
            setSearched(true);
            setShowRegister(res.data.length === 0);
            if (res.data.length === 0) {
                setNewPatient(prev => ({ ...prev, dni }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const admit = async (patientId: string) => {
        try {
            await axios.post('/api/admissions', { patientId });
            navigate('/dashboard');
        } catch (err) {
            alert('Error al admitir paciente');
        }
    };

    const registerAndAdmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/patients', newPatient);
            await admit(res.data.id);
        } catch (err) {
            alert('Error al registrar paciente');
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-secondary-900">Admisión de Pacientes</h1>
                    <p className="text-secondary-500 mt-2">Busque un paciente existente o registre uno nuevo para ingreso a guardia.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-card border border-secondary-200 mb-8 transform transition-all hover:shadow-lg">
                    <form onSubmit={search} className="relative">
                        <label className="block text-sm font-medium text-secondary-700 mb-2 ml-1">Buscar por Documento</label>
                        <div className="flex gap-4">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Ingrese DNI o Pasaporte..." 
                                    className="block w-full !pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                                    value={dni}
                                    onChange={e => setDni(e.target.value)}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="px-8 py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 focus:ring-4 focus:ring-primary-500/30 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <Search size={20} />
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>

                {searched && patients.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-bold text-secondary-800 ml-1">Resultados de Búsqueda</h3>
                        {patients.map((p: any) => (
                            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200 flex flex-col sm:flex-row justify-between items-center hover:border-primary-300 transition-all group">
                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                    <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center text-lg font-bold border border-primary-100">
                                        {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-secondary-900">{p.firstName} {p.lastName}</h3>
                                        <div className="flex items-center gap-3 text-sm text-secondary-500 mt-1">
                                            <span className="flex items-center gap-1"><Fingerprint size={14} /> {p.dni}</span>
                                            <span className="w-1 h-1 bg-secondary-300 rounded-full"></span>
                                            <span className="flex items-center gap-1 text-primary-600 font-medium"><CreditCard size={14} /> {p.insurance || 'Particular'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => admit(p.id)} 
                                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} /> 
                                    Admitir a Guardia
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {showRegister && (
                    <div className="bg-white p-8 rounded-2xl shadow-card border border-secondary-200 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-secondary-100">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-secondary-900">Paciente No Encontrado</h3>
                                <p className="text-sm text-secondary-500">Complete el formulario para registrar un nuevo paciente.</p>
                            </div>
                        </div>

                        <form onSubmit={registerAndAdmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-secondary-700">Nombre</label>
                                    <input 
                                        required 
                                        className="input-premium"
                                        placeholder="Ej: Juan"
                                        value={newPatient.firstName} 
                                        onChange={e => setNewPatient({...newPatient, firstName: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-secondary-700">Apellido</label>
                                    <input 
                                        required 
                                        className="input-premium"
                                        placeholder="Ej: Pérez"
                                        value={newPatient.lastName} 
                                        onChange={e => setNewPatient({...newPatient, lastName: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-secondary-700">Documento (DNI)</label>
                                    <div className="relative">
                                        <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                        <input 
                                            required 
                                            className="input-premium !pl-10"
                                            value={newPatient.dni} 
                                            onChange={e => setNewPatient({...newPatient, dni: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-secondary-700">Fecha de Nacimiento</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                                        <input 
                                            type="date" 
                                            required 
                                            className="input-premium !pl-10"
                                            value={newPatient.birthDate} 
                                            onChange={e => setNewPatient({...newPatient, birthDate: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondary-700">Obra Social / Prepaga</label>
                                <input 
                                    className="input-premium"
                                    placeholder="Ej: OSDE, Swiss Medical (Opcional)"
                                    value={newPatient.insurance} 
                                    onChange={e => setNewPatient({...newPatient, insurance: e.target.value})} 
                                />
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full btn-primary py-3 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                    <UserPlus size={20} />
                                    Registrar y Admitir
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
};
