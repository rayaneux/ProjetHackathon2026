export default function Step4Response() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100 mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Étape 4 : Visualisation & Réponse</h2>
      <p className="text-slate-500 mb-8">
        Vérifiez et validez la réponse générée avant l'envoi au candidat.
        (En attente d'implémentation)
      </p>
      
      <div className="h-48 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 bg-slate-50">
        Zone de prévisualisation du message
      </div>
      
      <div className="mt-6 flex justify-end space-x-4">
        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors font-medium">
          Modifier
        </button>
        <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-medium">
          Valider & Envoyer
        </button>
      </div>
    </div>
  );
}
