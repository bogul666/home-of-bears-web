import React, { useState, useEffect } from 'react';

const pricingData = {
    pandas: {
        freq1: { duration: "40 minut", new: { lessons: 31, total: 2205 }, continuing: { lessons: 34, total: 2205 } },
        freq2: { duration: "30 minut", new: { lessons: 62, total: 2760 }, continuing: { lessons: 68, total: 2760 } }
    },
    cubs_youngsters: {
        freq1: { duration: "90 minut", new: { lessons: 31, total: 3110 }, continuing: { lessons: 34, total: 3110 } },
        freq2: { duration: "60 minut", new: { lessons: 62, total: 3700 }, continuing: { lessons: 68, total: 3700 } }
    },
    polars: {
        freq1: { duration: "90 minut", new: { lessons: 31, total: 3330 }, continuing: { lessons: 34, total: 3330 } },
        freq2: { duration: "60 minut", new: { lessons: 62, total: 4070 }, continuing: { lessons: 68, total: 4070 } }
    }
};

export default function PricingCalculator({ title }) {
    const [courseType, setCourseType] = useState("");
    const [frequency, setFrequency] = useState("");
    const [studentStatus, setStudentStatus] = useState("");
    const [installments, setInstallments] = useState("");

    const isFreqEnabled = !!courseType;
    const isStatusEnabled = !!frequency;
    const isInstallmentEnabled = !!studentStatus;

    useEffect(() => { setFrequency(""); setStudentStatus(""); setInstallments(""); }, [courseType]);
    useEffect(() => { setStudentStatus(""); setInstallments(""); }, [frequency]);
    useEffect(() => { setInstallments(""); }, [studentStatus]);

    const renderInstallmentOptions = () => {
        if (!studentStatus) return <option value="" disabled>Wybierz status kursanta</option>;
        
        let options = [<option key="1" value="1">1 wpłata (Z góry - zyskujesz 5% rabatu)</option>];
        if (studentStatus === 'new') {
            options.push(
                <option key="3" value="3">3 równe raty</option>,
                <option key="4" value="4">4 równe raty</option>,
                <option key="9" value="9">9 równych rat</option>,
                <option key="10" value="10">10 równych rat</option>
            );
        } else if (studentStatus === 'continuing') {
            options.push(<option key="12" value="12">12 rat (Pakiet lojalnościowy)</option>);
        }
        return [<option key="def" value="" disabled>Wybierz plan płatności...</option>, ...options];
    };

    let resultData = null;
    
    if (courseType && frequency && studentStatus && installments) {
        const freqKey = `freq${frequency}`;
        const data = pricingData[courseType][freqKey];
        const baseTotal = data[studentStatus].total;
        const numInstallments = parseInt(installments);
        
        let finalTotal = baseTotal;
        let diff = 0;
        
        if (studentStatus === 'continuing') {
            diff = data['continuing'].lessons - data['new'].lessons;
        }

        let installmentContent = null;
        if (numInstallments === 1) {
            finalTotal = baseTotal * 0.95;
            installmentContent = (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 font-medium mt-4">
                    Płatność jednorazowa. Oszczędzasz 5% kwoty bazowej.
                </div>
            );
        } else if (studentStatus === 'continuing' && numInstallments === 12) {
            const upfrontTotal = 300;
            const remainingInstallment = ((baseTotal - upfrontTotal) / 10).toFixed(2).replace('.', ',');
            installmentContent = (
                <div className="bg-[#fef5f3] text-[#e56742] p-4 rounded-xl border border-[#fbc5b6] font-medium mt-4">
                    Rata I i II: 150 zł / każda <br/>
                    Raty III-XII: {remainingInstallment} zł / każda
                </div>
            );
        } else {
            const amount = (baseTotal / numInstallments).toFixed(2).replace('.', ',');
            installmentContent = (
                <div className="bg-slate-50 text-slate-700 p-4 rounded-xl border border-slate-200 font-medium mt-4">
                    {numInstallments} równych wpłat po {amount} zł
                </div>
            );
        }

        resultData = {
            duration: data.duration,
            lessons: data[studentStatus].lessons,
            diff,
            baseTotal,
            finalTotal: finalTotal.toFixed(2).replace('.00', '').replace('.', ','),
            installmentContent
        };
    }

    return (
        <section id="cennik" className="py-24 bg-white border-t border-slate-100 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-[#F38160] font-bold uppercase tracking-wider text-sm mb-3">{title || "Zasada transparentności"}</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] leading-tight">Ile kosztuje nauka u nas?</h3>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-8 space-y-6 bg-slate-50/50">
                        
                        <div>
                            <label className="block text-sm font-bold text-[#0f172a] mb-2">1. Grupa wiekowa</label>
                            <select value={courseType} onChange={(e) => setCourseType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-4 font-medium outline-none focus:ring-2 focus:ring-[#F38160] cursor-pointer">
                                <option value="" disabled>Wybierz kurs...</option>
                                <option value="pandas">Pandas (Przedszkolaki 3-6 lat)</option>
                                <option value="cubs_youngsters">Grizzly Cubs & Youngsters (7-12 lat)</option>
                                <option value="polars">Polars (Młodzież 13+)</option>
                            </select>
                        </div>

                        <div className={`transition-opacity duration-300 ${isFreqEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                            <label className="block text-sm font-bold text-[#0f172a] mb-2">2. Częstotliwość spotkań</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {['1', '2'].map(val => (
                                    <label key={val} className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${frequency === val ? 'border-[#F38160] bg-[#fef5f3]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                        <input type="radio" value={val} checked={frequency === val} onChange={(e) => setFrequency(e.target.value)} className="hidden" />
                                        <span className="font-bold block text-center">{val} {val === '1' ? 'raz' : 'razy'} w tyg.</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={`transition-opacity duration-300 ${isStatusEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                            <label className="block text-sm font-bold text-[#0f172a] mb-2">3. Status kursanta</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${studentStatus === 'new' ? 'border-[#F38160] bg-[#fef5f3]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                    <input type="radio" value="new" checked={studentStatus === 'new'} onChange={(e) => setStudentStatus(e.target.value)} className="hidden" />
                                    <span className="font-bold block text-center">Nowy uczeń</span>
                                </label>
                                <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${studentStatus === 'continuing' ? 'border-[#F38160] bg-[#fef5f3]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                    <input type="radio" value="continuing" checked={studentStatus === 'continuing'} onChange={(e) => setStudentStatus(e.target.value)} className="hidden" />
                                    <span className="font-bold block text-center">Kontynuuję naukę</span>
                                </label>
                            </div>
                        </div>

                        <div className={`transition-opacity duration-300 ${isInstallmentEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                            <label className="block text-sm font-bold text-[#0f172a] mb-2">4. Plan płatności</label>
                            <select value={installments} onChange={(e) => setInstallments(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-4 font-medium outline-none focus:ring-2 focus:ring-[#F38160] cursor-pointer">
                                {renderInstallmentOptions()}
                            </select>
                        </div>

                    </div>

                    {}
                    {resultData && (
                        <div className="p-8 bg-white border-t border-slate-100">
                            <h3 className="text-lg font-bold text-[#0f172a] mb-6">Podsumowanie inwestycji:</h3>
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Spotkań w roku</p>
                                    <p className="text-3xl font-extrabold text-[#0f172a]">{resultData.lessons}</p>
                                    {resultData.diff > 0 && <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-xs font-bold text-green-700 rounded-md">+{resultData.diff} zajęć dla kontynuujących</span>}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Całkowita inwestycja</p>
                                    <p className="text-4xl font-extrabold text-[#F38160]">{resultData.finalTotal} zł</p>
                                    {installments === '1' && <p className="text-sm text-slate-400 line-through">{resultData.baseTotal} zł</p>}
                                </div>
                            </div>
                            
                            {resultData.installmentContent}
                            
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => window.toggleModal && window.toggleModal('eduskyModal')} 
                                    className="flex-1 block text-center bg-[#0f172a] text-white font-bold py-4 px-6 rounded-xl shadow-md hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Zapisz na kurs
                                </button>
                                <button 
                                    onClick={() => window.toggleModal && window.toggleModal('lekcjaModal')} 
                                    className="flex-1 block text-center bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl hover:border-[#F38160] hover:text-[#F38160] transition-colors cursor-pointer shadow-sm"
                                >
                                    Darmowa lekcja
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}