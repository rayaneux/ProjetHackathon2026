import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Plus, Trash2, GripVertical, Settings2, FileText, Code } from "lucide-react"
import type { Form, FormField } from "../types"
import { showToast } from "../components/Toaster"

interface Props {
  forms: Form[];
  setForms: (forms: Form[]) => void;
}

export default function FormBuilder({ forms, setForms }: Props) {
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  const handleCreateNew = () => {
    const newForm: Form = {
      id: Date.now().toString(),
      name: "Nouveau Formulaire",
      createdAt: new Date().toISOString(),
      fields: [
        { id: 'firstName', label: 'Prénom', type: 'text', required: true },
        { id: 'lastName', label: 'Nom', type: 'text', required: true },
        { id: 'email', label: 'Email', type: 'email', required: true },
      ]
    };
    setForms([...forms, newForm]);
    setEditingFormId(newForm.id);
  };

  const activeForm = forms.find(f => f.id === editingFormId);

  const updateActiveForm = (updated: Form) => {
    setForms(forms.map(f => f.id === updated.id ? updated : f));
  };

  const addField = () => {
    if (!activeForm) return;
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: "Nouveau champ",
      type: "text",
      required: false
    };
    updateActiveForm({
      ...activeForm,
      fields: [...activeForm.fields, newField]
    });
  };

  const removeField = (fieldId: string) => {
    if (!activeForm) return;
    updateActiveForm({
      ...activeForm,
      fields: activeForm.fields.filter(f => f.id !== fieldId)
    });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!activeForm) return;
    updateActiveForm({
      ...activeForm,
      fields: activeForm.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    });
  };

  if (activeForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setEditingFormId(null)}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center transition-colors"
          >
            ← Retour aux formulaires
          </button>
          <Button onClick={() => setEditingFormId(null)} className="bg-slate-900 text-white rounded-full px-6">
            Enregistrer
          </Button>
        </div>

        <Card className="shadow-lg border-slate-200/60 overflow-hidden bg-white">
          <div className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom du formulaire</label>
            <input 
              type="text" 
              value={activeForm.name}
              onChange={(e) => updateActiveForm({...activeForm, name: e.target.value})}
              className="text-3xl font-serif font-bold text-slate-900 bg-transparent border-none outline-none placeholder-slate-300 focus:ring-0 p-0"
              placeholder="Ex: Admission Master Design..."
            />
          </div>

          <CardContent className="p-8 space-y-6 bg-[#fcfbf9]">
            <div className="space-y-4">
              {activeForm.fields.map((field) => (
                <div key={field.id} className="group bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-all relative">
                  <div className="pt-2 text-slate-300 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 space-y-1">
                      <label className="text-xs font-medium text-slate-500">Titre du champ</label>
                      <input 
                        type="text" 
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-medium text-slate-500">Type de réponse</label>
                      <select 
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-white"
                      >
                        <option value="text">Texte court</option>
                        <option value="textarea">Texte long / Dossier</option>
                        <option value="email">Email</option>
                        <option value="url">Lien (URL, Portfolio...)</option>
                        <option value="file">Fichier (PDF/Image)</option>
                        <option value="select">Menu déroulant</option>
                        <option value="checkboxes">Choix multiples</option>
                      </select>
                    </div>

                    <div className="md:col-span-3 flex items-center justify-end space-x-2 pt-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900"
                        />
                        <span className="text-xs font-medium text-slate-600">Requis</span>
                      </label>
                    </div>
                    
                    {(field.type === 'select' || field.type === 'checkboxes') && (
                      <div className="md:col-span-12 space-y-1 pt-2">
                        <label className="text-xs font-medium text-slate-500">Options (séparées par une virgule)</label>
                        <input 
                          type="text" 
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          placeholder="Option 1, Option 2, Option 3..."
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => removeField(field.id)}
                    className="absolute -right-3 -top-3 w-8 h-8 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button 
              onClick={addField}
              variant="outline" 
              className="w-full border-dashed border-2 border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 py-8 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un nouveau champ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold font-serif text-slate-900 mb-2">Formulaires</h2>
          <p className="text-slate-500 text-lg">Créez et personnalisez les formulaires d'admission pour vos campagnes.</p>
        </div>
        <Button onClick={handleCreateNew} className="rounded-full px-6 flex items-center shadow-lg hover:shadow-xl transition-all bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Formulaire
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {forms.map(form => (
          <Card key={form.id} className="hover:shadow-lg transition-all border-slate-200 bg-white group cursor-pointer" onClick={() => setEditingFormId(form.id)}>
            <CardHeader className="pb-3 border-b border-slate-50 relative">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold font-serif text-slate-900">{form.name}</CardTitle>
              <div className="text-xs text-slate-400 mt-1">Créé le {new Date(form.createdAt).toLocaleDateString('fr-FR')}</div>
              
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const iframeCode = `<iframe src="${window.location.origin}/school?formId=${form.id}&embed=true" width="100%" height="800" frameborder="0" style="background:transparent; border:none;"></iframe>`;
                    navigator.clipboard.writeText(iframeCode);
                    showToast(`Code d'intégration copié pour « ${form.name} »`, "success");
                  }}
                  className="text-slate-400 hover:text-brand-dark p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Copier le code d'intégration (iframe)"
                >
                  <Code className="w-4 h-4" />
                </button>
                <span className="text-slate-300 group-hover:text-slate-900 transition-colors pointer-events-none">
                  <Settings2 className="w-5 h-5" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Champs configurés</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{form.fields.length}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}