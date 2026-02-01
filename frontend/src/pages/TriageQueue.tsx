import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { Clock, PlayCircle, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

const TRIAGE_LEVELS = [
    { level: 'ROJO', color: 'bg-red-500', hover: 'hover:bg-red-600', border: 'border-red-200', text: 'text-red-700', bgIdx: 'bg-red-50', label: '1 - Emergencia (Rojo)', desc: 'Atención inmediata. Riesgo vital.' },
    { level: 'NARANJA', color: 'bg-orange-500', hover: 'hover:bg-orange-600', border: 'border-orange-200', text: 'text-orange-700', bgIdx: 'bg-orange-50', label: '2 - Muy Urgente (Naranja)', desc: 'Atención en 10 min. Dolor severo.' },
    { level: 'AMARILLO', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600', border: 'border-yellow-200', text: 'text-yellow-700', bgIdx: 'bg-yellow-50', label: '3 - Urgente (Amarillo)', desc: 'Atención en 30-60 min.' },
    { level: 'VERDE', color: 'bg-green-500', hover: 'hover:bg-green-600', border: 'border-green-200', text: 'text-green-700', bgIdx: 'bg-green-50', label: '4 - Estándar (Verde)', desc: 'Atención en 120 min. Sin riesgo.' },
    { level: 'AZUL', color: 'bg-blue-500', hover: 'hover:bg-blue-600', border: 'border-blue-200', text: 'text-blue-700', bgIdx: 'bg-blue-50', label: '5 - No Urgente (Azul)', desc: 'Atención en 180-240 min.' },
];

export const TriageQueue = () => {
    const [queue, setQueue] = useState<any[]>([]);
    const [selectedAdmission, setSelectedAdmission] = useState<string | null>(null);

    const fetchQueue = () => {
        axios.get('/api/admissions').then(res => {
            setQueue(res.data.filter((a: any) => a.status === 'EN_ESPERA'));
        });
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const submitTriage = async (level: string) => {
        if (!selectedAdmission) return;
        try {
            await axios.put(`/api/admissions/${selectedAdmission}/triage`, { level });
            setSelectedAdmission(null);
            fetchQueue();
        } catch (err) {
            alert('Error actualizando el triage');
        }
    };

    const selectedPatient = queue.find(q => q.id === selectedAdmission);

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <div>
                   <h1 className="text-2xl font-bold text-secondary-900">Cola de Triage</h1>
                    <p className="text-secondary-500">Clasificación de riesgo para pacientes en espera.</p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-white border border-secondary-200 rounded-lg shadow-sm text-sm font-medium text-secondary-600">
                    {queue.length} Pacientes en espera
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans h-[calc(100vh-200px)]">
                {/* Left Panel - Queue List */}
                <div className="lg:col-span-4 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {queue.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-secondary-400 bg-white rounded-2xl border border-dashed border-secondary-200">
                            <CheckCircle size={48} className="mb-3 text-emerald-200" />
                            <p className="font-medium">Todo despejado</p>
                            <p className="text-sm">No hay pacientes esperando triage.</p>
                        </div>
                    )}
                    {queue.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedAdmission(item.id)}
                            className={`
                                p-5 rounded-xl border transition-all duration-200 cursor-pointer group relative overflow-hidden
                                ${selectedAdmission === item.id 
                                    ? 'bg-primary-50 border-primary-500 shadow-md transform scale-[1.02]' 
                                    : 'bg-white border-secondary-200 hover:border-primary-300 hover:shadow-card'
                                }
                            `}
                        >
                            {selectedAdmission === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`font-bold text-lg ${selectedAdmission === item.id ? 'text-primary-900' : 'text-secondary-800'}`}>
                                        {item.patientName}
                                    </h3>
                                    <p className="text-sm text-secondary-500 mt-0.5">DNI: {item.patientDni}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full bg-secondary-100 text-secondary-600">
                                        <Clock size={12} />
                                        <span>{new Date(item.admissionTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Seleccionar para evaluar <ChevronRight size={12} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Panel - Triage Action */}
                <div className="lg:col-span-8 h-full flex flex-col">
                    <div className="bg-white rounded-2xl shadow-card border border-secondary-200 flex-1 flex flex-col overflow-hidden">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-secondary-100 bg-secondary-50/50">
                            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
                                <AlertTriangle className="text-primary-600" size={20} />
                                {selectedAdmission ? 'Evaluación de Triage' : 'Selección de Paciente'}
                            </h3>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {selectedPatient ? (
                                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
                                    <div className="text-center mb-8">
                                        <p className="text-sm text-secondary-500 uppercase tracking-wide font-semibold">Evaluando a</p>
                                        <h2 className="text-3xl font-bold text-secondary-900 mt-1">{selectedPatient.patientName}</h2>
                                        <p className="text-secondary-500 mt-2">DNI {selectedPatient.patientDni}</p>
                                    </div>

                                    <div className="space-y-3">
                                        {TRIAGE_LEVELS.map((t) => (
                                            <button
                                                key={t.level}
                                                onClick={() => submitTriage(t.level)}
                                                className={`
                                                    w-full p-4 rounded-xl border flex items-center justify-between group transition-all duration-200
                                                    bg-white hover:bg-white border-secondary-200 hover:border-transparent hover:shadow-lg hover:scale-[1.01]
                                                `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-lg ${t.color} text-white flex items-center justify-center shadow-sm`}>
                                                        <span className="font-bold text-xl">{t.label.split(' ')[0]}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-bold text-secondary-900 group-hover:text-primary-900 text-lg">{t.label.split('-')[1]}</h4>
                                                        <p className="text-sm text-secondary-500">{t.desc}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="text-secondary-300 group-hover:text-primary-500 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="text-center pt-4">
                                        <button 
                                            onClick={() => setSelectedAdmission(null)}
                                            className="text-secondary-400 hover:text-secondary-600 text-sm font-medium transition-colors"
                                        >
                                            Cancelar evaluación
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <PlayCircle size={32} className="text-secondary-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-900">Esperando selección</h3>
                                    <p className="text-secondary-500 max-w-sm mt-2">
                                        Seleccione un paciente de la lista de la izquierda para comenzar la evaluación de triage y asignar un nivel de prioridad.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
