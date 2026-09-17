import React, { useState } from 'react';

export default function Wyszukiwarka({ articles }) {
    // Stany (zmienne, które React obserwuje i odświeża po ich zmianie)
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Wszystkie");

    // Definiujemy nasze główne kategorie (The Big 5 z TAYA)
    const categories = [
        "Wszystkie",
        "Koszty i Cennik",
        "Porównania Szkół",
        "Problemy i Blokady",
        "Historie Uczniów"
    ];

    // Logika filtrowania w czasie rzeczywistym
    const filteredArticles = articles.filter(article => {
        const content = article.content;
        
        // 1. Filtrowanie po kategorii
        const matchesCategory = activeCategory === "Wszystkie" || content.category === activeCategory;
        
        // 2. Filtrowanie po szukanym słowie
        const searchLower = searchQuery.toLowerCase();
        const titleLower = (content.title || article.name).toLowerCase();
        const excerptLower = (content.excerpt || "").toLowerCase();
        
        const matchesSearch = titleLower.includes(searchLower) || excerptLower.includes(searchLower);

        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            {/* Wyszukiwarka (Pole tekstowe z Hero) */}
            <div className="bg-white border-b border-slate-100 relative z-20 pb-12 -mt-4">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
                    <div className="absolute inset-y-0 left-0 pl-9 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#F38160] transition-colors">
                        <i className="fa-solid fa-magnifying-glass text-xl"></i>
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Np. 'ile kosztuje kurs', 'strach przed mówieniem'..." 
                        className="block w-full pl-14 pr-4 py-5 bg-white border-2 border-slate-100 rounded-2xl text-lg text-slate-900 shadow-sm focus:outline-none focus:ring-0 focus:border-[#F38160] transition-all font-medium placeholder:text-slate-400"
                    />
                    <button className="absolute inset-y-2 right-6 bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl transition-colors">
                        Szukaj
                    </button>
                </div>
            </div>

            {/* PASEK KATEGORII (Sticky) */}
            <section className="py-8 bg-[#F8FAFC] sticky top-24 z-40 border-b border-slate-200/60 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-4 hidden md:block flex-shrink-0">Kategorie:</span>
                        
                        {categories.map((category) => (
                            <button 
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                                    activeCategory === category 
                                    ? "bg-[#0f172a] text-white border-transparent" 
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#F38160] hover:text-[#F38160]"
                                }`}
                            >
                                {category === "Koszty i Cennik" && "💰 "}
                                {category === "Porównania Szkół" && "⚖️ "}
                                {category === "Problemy i Blokady" && "🚧 "}
                                {category === "Historie Uczniów" && "⭐ "}
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* LISTA ARTYKUŁÓW */}
            <main className="py-16 bg-[#F8FAFC] min-h-[50vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((article) => {
                                const content = article.content;
                                const imageUrl = content.image?.filename || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80";
                                
                                return (
                                    <a key={article.uuid} href={`/artykuly/${article.slug}`} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 group">
                                        
                                        <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative bg-slate-100 shrink-0">
                                            <img 
                                                src={imageUrl} 
                                                alt={content.title || article.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {content.category && (
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0f172a] uppercase tracking-wide shadow-sm">
                                                    {content.category}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h2 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#F38160] transition-colors leading-tight">
                                            {content.title || article.name}
                                        </h2>
                                        
                                        <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3 font-medium">
                                            {content.excerpt || "Kliknij, aby przeczytać pełny wpis."}
                                        </p>
                                        
                                        <div className="mt-auto pt-4 border-t border-slate-50 text-[#0f172a] font-bold text-sm flex items-center group-hover:text-[#F38160] transition-colors">
                                            Czytaj dalej 
                                            <i className="fa-solid fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </a>
                                );
                            })
                        ) : (
                            <div className="col-span-1 md:col-span-3 text-center p-12 border-2 border-dashed border-slate-300 rounded-3xl bg-white text-slate-500 font-medium flex flex-col items-center justify-center">
                                <i className="fa-solid fa-ghost text-4xl mb-4 text-slate-300"></i>
                                <p>Nic nie znaleźliśmy dla zapytania: <strong>"{searchQuery}"</strong> w kategorii <strong>"{activeCategory}"</strong>.</p>
                                <button 
                                    onClick={() => { setSearchQuery(""); setActiveCategory("Wszystkie"); }} 
                                    className="mt-4 text-[#F38160] hover:underline font-bold"
                                >
                                    Wyczyść filtry
                                </button>
                            </div>
                        )}
                    </div>
                    
                </div>
            </main>
        </div>
    );
}