import { Button } from "../components/ui/button"
import { useState, useEffect } from "react"
import { GraduationCap, Globe, Users, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import type { Form } from "../types"

interface Props {
  onApply: (campaignId: string, data: any) => void;
}

export default function SchoolLanding({ onApply }: Props) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState<Form | null>(null);

  const params = new URLSearchParams(window.location.search);
  const formId = params.get('formId') || '';
  const campaignIdFromUrl = params.get('campaignId') || '';
  const isEmbed = params.get('embed') === 'true';

  const campaignId = (() => {
    if (campaignIdFromUrl) return campaignIdFromUrl;
    if (!formId) return '';
    try {
      const camps = JSON.parse(localStorage.getItem('lighthouse_campaigns') || '[]');
      const match = camps.find((c: { linkedFormId?: string }) => c.linkedFormId === formId);
      return match?.id || '';
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    try {
      const savedForms = JSON.parse(localStorage.getItem('lighthouse_forms') || '[]');
      const foundForm = savedForms.find((f: any) => f.id === formId);
      if (foundForm) {
        setForm(foundForm);
      } else {
        // Formulaire par défaut si formId non fourni ou introuvable
        setForm({
          id: 'default',
          name: 'Formulaire Standard',
          createdAt: '',
          fields: [
            { id: 'firstName', label: 'Prénom', type: 'text', required: true },
            { id: 'lastName', label: 'Nom', type: 'text', required: true },
            { id: 'email', label: 'Email', type: 'email', required: true },
            { id: 'dossier', label: 'Dossier académique & Lettre de motivation', type: 'textarea', required: true }
          ]
        });
      }
    } catch {
      //
    }
  }, [formId]);

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    
    if (form) {
      form.fields.forEach(f => {
        if (f.type === 'checkboxes') {
          data[f.id] = formData.getAll(f.id).join(', ');
        } else {
          data[f.id] = formData.get(f.id);
        }
      });
      
      data.firstName = formData.get('firstName') || data[form.fields[0]?.id] || 'Candidat';
      data.lastName = formData.get('lastName') || '';
      data.email = formData.get('email') || data[form.fields.find(f => f.type === 'email')?.id || ''] || 'email@example.com';
      
      const dossierParts = form.fields
        .filter(f => f.id !== 'firstName' && f.id !== 'lastName' && f.id !== 'email')
        .map(f => `${f.label}: ${data[f.id]}`);
      
      data.dossier = dossierParts.join('\n\n') || formData.get('dossier') || '';
    }
    
    onApply(campaignId, data);
    
    setApplied(true);
    setTimeout(() => {
      if (!isEmbed) {
        setShowApplyModal(false);
      }
      setApplied(false);
    }, 3000);
  };

  const handlePostulerClick = () => {
    const q = new URLSearchParams();
    if (campaignId) q.set('campaignId', campaignId);
    if (formId) q.set('formId', formId);
    q.set('embed', 'true');
    window.open(`/school?${q.toString()}`, '_blank');
  };

  const formContent = (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden mx-auto">
      {applied ? (
        <div className="p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-slate-900">Candidature Envoyée !</h3>
          <p className="text-slate-600">
            Votre dossier a bien été transmis au jury d'admission. Vous recevrez une réponse prochainement.
          </p>
        </div>
      ) : (
        <>
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-bold font-serif text-slate-900">Déposer un dossier</h3>
            {!isEmbed && (
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            )}
          </div>
          <form onSubmit={handleApply} className="p-8 space-y-6">
            <div className="space-y-4">
              {form?.fields.map(f => (
                <div key={f.id} className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea name={f.id} required={f.required} className="w-full border border-slate-200 rounded-lg px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder="..."></textarea>
                  ) : f.type === 'select' ? (
                    <select name={f.id} required={f.required} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all bg-white">
                      <option value="">Sélectionnez une option</option>
                      {f.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : f.type === 'checkboxes' ? (
                    <div className="space-y-2">
                      {f.options?.map((opt, i) => (
                        <label key={i} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" name={f.id} value={opt} className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900" />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input name={f.id} required={f.required} type={f.type === 'file' ? 'file' : f.type === 'url' ? 'url' : f.type} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder={f.type === 'url' ? 'https://...' : ''} />
                  )}
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              Soumettre ma candidature
            </Button>
          </form>
        </>
      )}
    </div>
  );

  if (isEmbed) {
    return (
      <div className="min-h-screen bg-transparent p-4 flex items-start justify-center font-sans">
        {formContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
              ISI
            </div>
            <span className="font-serif font-bold text-xl text-blue-900 tracking-tight">Institut Supérieur d'Innovation</span>
          </div>
          <nav className="hidden md:flex space-x-8 font-medium text-sm text-slate-600">
            <a href="#" className="hover:text-blue-900">Formations</a>
            <a href="#" className="hover:text-blue-900">Admissions</a>
            <a href="#" className="hover:text-blue-900">Campus</a>
            <a href="#" className="hover:text-blue-900">Alumni</a>
          </nav>
          <Button onClick={handlePostulerClick} className="bg-blue-900 hover:bg-blue-800 text-white rounded-full px-6">
            Postuler
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="text-blue-200 font-semibold tracking-wider uppercase text-sm">Rentrée 2026</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight">
            Master en Management <br/> de l'Innovation
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Formez-vous aux métiers de demain. Un cursus d'excellence alliant stratégie, nouvelles technologies et entrepreneuriat pour transformer les idées en succès.
          </p>
          <div className="pt-8">
            <Button onClick={handlePostulerClick} size="lg" className="bg-white text-blue-900 hover:bg-slate-100 rounded-full px-8 py-6 text-lg font-bold shadow-xl">
              Déposer ma candidature <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Excellence Académique</h3>
            <p className="text-slate-600">Intervenants de haut niveau, chercheurs et professionnels reconnus dans la tech.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Ouverture Internationale</h3>
            <p className="text-slate-600">Un semestre obligatoire à l'étranger et des projets avec des entreprises mondiales.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Réseau Alumni</h3>
            <p className="text-slate-600">Intégrez une communauté puissante de 15 000 diplômés prêts à booster votre carrière.</p>
          </div>
        </div>
      </section>

      {/* Modal de candidature */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="animate-in zoom-in-95 duration-200 w-full flex justify-center">
            {formContent}
          </div>
        </div>
      )}
    </div>
  )
}