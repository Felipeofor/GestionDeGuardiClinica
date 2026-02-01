import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { User, HeartPulse, LogOut, Clipboard, History, Truck, ChevronRight } from 'lucide-react';

const TRIAGE_CONFIG: any = {
    'ROJO': { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    'NARANJA': { color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
    'AMARILLO': { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    'VERDE': { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    'AZUL': { color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' }
};

export const MedicalCare = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    const fetchPatients = () => {
        axios.get('/api/admissions').then(res => {
            setPatients(res.data.filter((a: any) => 
                a.status === 'ESPERANDO_MEDICO' || a.status === 'EN_ATENCION'
            ));
        });
    };

    useEffect(() => {
        fetchPatients();
        const interval = setInterval(fetchPatients, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchHistory = (patientId: string) => {
        axios.get(`/api/admissions/patient/${patientId}/history`).then(res => {
            setHistory(res.data);
        });
    };

    const handleSelect = (admission: any) => {
        setSelected(admission);
        fetchHistory(admission.patientId);
    };

    const updateStatus = async (status: string) => {
        if (!selected) return;
        try {
            await axios.put(`/api/admissions/${selected.id}/status`, { status });
            setSelected(null);
            fetchPatients();
        } catch (err) {
            alert('Error al actualizar el estado');
        }
    };

    return (
        <Layout>
             <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Atención Médica</h1>
                    <p className="text-secondary-500">Gestión clínica y resolución de casos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans h-[calc(100vh-200px)]">
                {/* Left: Queue */}
                <div className="lg:col-span-4 flex flex-col bg-white rounded-2xl shadow-card border border-secondary-200 overflow-hidden">
                    <div className="p-4 border-b border-secondary-100 bg-secondary-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-secondary-700 text-sm uppercase tracking-wide">Pacientes en Espera</h3>
                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">{patients.length}</span>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                        {patients.length === 0 && (
                            <div className="p-8 text-center text-secondary-400">
                                <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User size={20} />
                                </div>
                                No hay pacientes pendientes.
                            </div>
                        )}
                        {patients.map((p) => {
                             const config = TRIAGE_CONFIG[p.triageLevel] || TRIAGE_CONFIG['VERDE'];
                             return (
                                <div 
                                    key={p.id} 
                                    onClick={() => handleSelect(p)}
                                    className={`
                                        p-4 rounded-xl border transition-all cursor-pointer group relative
                                        ${selected?.id === p.id 
                                            ? 'bg-primary-50 border-primary-500 shadow-sm' 
                                            : 'bg-white border-transparent hover:bg-secondary-50 hover:border-secondary-200'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-3">
                                             <div className={`mt-1 w-2.5 h-2.5 rounded-full ${config.color} shadow-sm`} />
                                             <div>
                                                <h4 className={`font-bold text-base ${selected?.id === p.id ? 'text-primary-900' : 'text-secondary-900'}`}>{p.patientName}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'EN_ATENCION' ? 'bg-indigo-100 text-indigo-700' : 'bg-secondary-100 text-secondary-600'}`}>
                                                        {p.status === 'EN_ATENCION' ? 'EN ATENCIÓN' : 'ESPERA'}
                                                    </span>
                                                </div>
                                             </div>
                                        </div>
                                        <ChevronRight size={16} className={`text-secondary-300 ${selected?.id === p.id ? 'text-primary-500' : ''}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Detail & History */}
                <div className="lg:col-span-8 flex flex-col">
                    {selected ? (
                        <div className="bg-white rounded-2xl shadow-card border border-secondary-200 h-full flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
                            {/* Header Panel */}
                            <div className="p-8 border-b border-secondary-100 bg-gradient-to-r from-white to-secondary-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-3xl font-bold text-secondary-900">{selected.patientName}</h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${TRIAGE_CONFIG[selected.triageLevel]?.bg} ${TRIAGE_CONFIG[selected.triageLevel]?.text} ${TRIAGE_CONFIG[selected.triageLevel]?.border}`}>
                                                TRIAGE {selected.triageLevel}
                                            </span>
                                        </div>
                                        <p className="text-secondary-500 font-medium flex items-center gap-2">
                                            <Clipboard size={16} /> DNI: {selected.patientDni}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        {selected.status === 'ESPERANDO_MEDICO' ? (
                                            <button 
                                                onClick={() => updateStatus('EN_ATENCION')}
                                                className="btn-primary py-2.5 px-6 flex items-center gap-2 shadow-lg hover:shadow-primary-500/20"
                                            >
                                                <HeartPulse size={18} /> 
                                                Iniciar Consulta
                                            </button>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => updateStatus('DERIVADO')}
                                                    className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg font-bold transition-colors flex items-center gap-2"
                                                >
                                                    <Truck size={18} />
                                                    Derivar
                                                </button>
                                                <button 
                                                    onClick={() => updateStatus('ALTA')}
                                                    className="px-6 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
                                                >
                                                    <LogOut size={18} />
                                                    Dar de Alta
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 p-8 overflow-y-auto bg-surface-light/30">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-2 mb-6 text-primary-900 border-b border-primary-100 pb-2">
                                        <History size={20} />
                                        <h3 className="font-bold text-lg">Historial Clínico de Ingresos</h3>
                                    </div>
                                    
                                    <div className="relative border-l-2 border-secondary-200 ml-3 space-y-8 pb-8">
                                        {history.map((h, idx) => (
                                            <div key={idx} className="relative pl-8">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary-500" />
                                                <div className="bg-white p-5 rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-secondary-900">{new Date(h.admissionTime).toLocaleDateString()} <span className="text-secondary-400 font-normal text-sm">at {new Date(h.admissionTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></span>
                                                        <span className={`text-xs px-2 py-1 rounded font-bold ${TRIAGE_CONFIG[h.triageLevel]?.bg} ${TRIAGE_CONFIG[h.triageLevel]?.text}`}>
                                                            {h.triageLevel}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-secondary-600">
                                                        <p><span className="font-medium">Estado Final:</span> {h.status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {history.length === 0 && (
                                            <div className="pl-8 text-secondary-400 italic">
                                                Este es el primer ingreso registrado para el paciente en este sistema.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-secondary-200 p-10 text-secondary-400">
                             <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <HeartPulse size={40} className="text-primary-300" />
                            </div>
                            <h2 className="text-xl font-bold text-secondary-700">Área de Atención Médica</h2>
                            <p className="max-w-md text-center mt-2 text-secondary-500">
                                Seleccione un paciente de la lista de espera para visualizar su historial clínico y gestionar su evolución.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
