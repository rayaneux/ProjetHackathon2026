export default function Step3Generate() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100 mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Étape 3 : Génération de l'Analyse</h2>
      <p className="text-slate-500 mb-8">
        L'IA analyse le dossier en fonction de vos critères...
        (En attente d'implémentation)
      </p>
      
      <div className="h-48 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p>Simulation de chargement...</p>
      </div>
    </div>
  );
}
