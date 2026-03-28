import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Plus, FolderOpen, ArrowRight, CheckCircle2, GripHorizontal, ChevronDown, Trash2, RotateCcw, ChevronUp, Pencil } from "lucide-react"
import type { Campaign, Form } from "../types"
import { showToast } from "../components/Toaster"

interface Props {
  campaigns: Campaign[];
  forms: Form[];
  onCreateNew: () => void;
  onSelectCampaign: (id: string) => void;
  onUpdateCampaignStatus: (id: string, status: Campaign['status']) => void;
  onLinkFormToCampaign: (campaignId: string, formId: string) => void;
  onRenameCampaign: (id: string, newName: string) => void;
  onDeleteCampaign: (id: string) => void;
  deletedCampaigns: Campaign[];
  onRestoreCampaign: (id: string) => void;
  onEmptyTrash: () => void;
}

export default function Dashboard({ campaigns, forms, onCreateNew, onSelectCampaign, onUpdateCampaignStatus, onLinkFormToCampaign, onRenameCampaign, onDeleteCampaign, deletedCampaigns, onRestoreCampaign, onEmptyTrash }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [trashOpen, setTrashOpen] = useState(false);
  const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");

  const TEAM = [
    { initials: "MT", color: "bg-purple-500", name: "Marie T." },
    { initials: "TD", color: "bg-blue-500",   name: "Thomas D." },
    { initials: "JR", color: "bg-emerald-500", name: "Julie R." },
    { initials: "AS", color: "bg-orange-500", name: "Antoine S." },
  ];

  const getAssignedMembers = (campId: string) => {
    const hash = campId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const count = (hash % 2) + 1;
    return Array.from({ length: count }, (_, i) => TEAM[(hash + i) % TEAM.length]);
  };

  const columns: { id: Campaign['status'], title: string, color: string }[] = [
    { id: 'upcoming', title: 'Pas encore ouvert', color: 'bg-slate-100/80 border-slate-200' },
    { id: 'active', title: 'Ouvert', color: 'bg-blue-50/50 border-blue-100' },
    { id: 'closed', title: 'Fini', color: 'bg-green-50/50 border-green-100' },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data to drag
    e.dataTransfer.setData('text/plain', id); 
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Campaign['status']) => {
    e.preventDefault();
    if (draggedId) {
      onUpdateCampaignStatus(draggedId, status);
      setDraggedId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold font-serif text-slate-900 mb-2">Tableau des Admissions</h2>
          <p className="text-slate-500 text-lg">Gérez le flux de vos campagnes par statut.</p>
        </div>
        <Button onClick={onCreateNew} className="rounded-full px-6 flex items-center shadow-lg hover:shadow-xl transition-all bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Campagne
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent shadow-none p-12 text-center flex flex-col items-center justify-center flex-1 min-h-[400px]">
          <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-brand-purple" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Aucune campagne active</h3>
          <p className="text-slate-500 max-w-md mb-8">
            Créez votre première campagne pour configurer l'IA, importer vos candidats et envoyer des réponses personnalisées.
          </p>
          <Button onClick={onCreateNew} size="lg" className="bg-slate-900 text-white hover:bg-slate-800">
            Créer ma première campagne
          </Button>
        </Card>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[600px] items-stretch">
          {columns.map(col => {
            const columnCampaigns = campaigns.filter(c => c.status === col.id);
            
            return (
              <div 
                key={col.id}
                className={`flex-1 min-w-[320px] max-w-[400px] rounded-2xl border ${col.color} p-4 flex flex-col transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-semibold text-slate-700 text-[15px] uppercase tracking-wider">{col.title}</h3>
                  <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {columnCampaigns.length}
                  </span>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  {columnCampaigns.map(camp => {
                    const progress = camp.totalCandidates === 0 
                      ? 0 
                      : Math.round((camp.processedCandidates / camp.totalCandidates) * 100);

                    let statusBadge;
                    if (camp.status === 'upcoming') {
                      statusBadge = <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">Pas encore ouvert</span>;
                    } else if (camp.status === 'active') {
                      statusBadge = <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wider">Ouvert</span>;
                    } else {
                      statusBadge = <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-200 uppercase tracking-wider">Fini</span>;
                    }

                    return (
                      <Card 
                        key={camp.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, camp.id)}
                        className={`hover:border-slate-300 transition-all hover:shadow-md cursor-pointer group flex flex-col bg-white border-slate-200 ${draggedId === camp.id ? 'opacity-50 scale-95' : ''}`}
                        onClick={() => onSelectCampaign(camp.id)}
                      >
                        <CardHeader className="p-4 pb-2 relative">
                          <div className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing">
                            <GripHorizontal className="w-5 h-5" />
                          </div>
                          <div className="flex justify-between items-start mb-2 pr-6">
                            <div className="flex items-center gap-2 flex-wrap">
                              {statusBadge}
                              <span className="text-[11px] font-medium text-slate-400">
                                {new Date(camp.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 relative">
                              {confirmDeleteId === camp.id ? (
                                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1" onClick={e => e.stopPropagation()}>
                                  <span className="text-xs font-semibold text-red-700 whitespace-nowrap">Supprimer ?</span>
                                  <button
                                    type="button"
                                    onClick={() => { onDeleteCampaign(camp.id); setConfirmDeleteId(null); showToast("Campagne déplacée vers la corbeille", "info"); }}
                                    className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded transition-colors"
                                  >
                                    Oui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded transition-colors"
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(camp.id); }}
                                  className="text-slate-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                  title="Supprimer cette campagne"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(openDropdownId === camp.id ? null : camp.id);
                                }}
                                className="text-slate-400 hover:text-brand-dark p-1 rounded hover:bg-slate-100 transition-colors"
                                title="Lier un formulaire à cette campagne"
                                aria-expanded={openDropdownId === camp.id}
                                aria-haspopup="listbox"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              
                              {openDropdownId === camp.id && (
                                <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Connecter un formulaire
                                  </div>
                                  <div className="max-h-48 overflow-y-auto">
                                    {forms.length === 0 ? (
                                      <div className="p-3 text-sm text-slate-500 text-center">Aucun formulaire créé</div>
                                    ) : (
                                      forms.map(form => (
                                        <button
                                          key={form.id}
                                          type="button"
                                          onClick={() => {
                                            onLinkFormToCampaign(camp.id, form.id);
                                            setOpenDropdownId(null);
                                            showToast(`« ${form.name} » connecté à « ${camp.name} »`, "success");
                                          }}
                                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-purple/10 hover:text-brand-purple transition-colors border-b border-slate-50 last:border-0 truncate"
                                        >
                                          {form.name}
                                        </button>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {progress === 100 && camp.status !== 'upcoming' && (
                                <span className="text-green-500"><CheckCircle2 className="w-4 h-4 shrink-0" /></span>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg font-bold font-serif leading-tight">
                            {editingNameId === camp.id ? (
                              <input
                                autoFocus
                                value={editingNameValue}
                                onChange={e => setEditingNameValue(e.target.value)}
                                onBlur={() => {
                                  if (editingNameValue.trim()) onRenameCampaign(camp.id, editingNameValue.trim());
                                  setEditingNameId(null);
                                }}
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    if (editingNameValue.trim()) onRenameCampaign(camp.id, editingNameValue.trim());
                                    setEditingNameId(null);
                                  }
                                  if (e.key === "Escape") setEditingNameId(null);
                                }}
                                onClick={e => e.stopPropagation()}
                                className="w-full border-b border-slate-400 bg-transparent outline-none text-lg font-bold font-serif text-slate-900"
                              />
                            ) : (
                              <span className="flex items-center gap-2 group/title">
                                <span className="line-clamp-2">{camp.name}</span>
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setEditingNameId(camp.id);
                                    setEditingNameValue(camp.name);
                                  }}
                                  className="opacity-0 group-hover/title:opacity-100 text-slate-300 hover:text-slate-600 transition-all shrink-0"
                                  title="Renommer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            )}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-2 pb-3">
                          {(() => {
                            const linked = camp.linkedFormId ? forms.find(f => f.id === camp.linkedFormId) : undefined;
                            if (!linked) return null;
                            return (
                              <p className="text-xs text-slate-600 mb-3 leading-snug border-l-2 border-brand-purple/40 pl-2.5">
                                <span className="font-semibold text-slate-800">{linked.name}</span>
                                <span className="text-slate-500"> connecté à </span>
                                <span className="font-medium text-slate-700">{camp.name}</span>
                              </p>
                            );
                          })()}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                              <span>Progression</span>
                              <span>{camp.processedCandidates} / {camp.totalCandidates}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-brand-purple to-brand-orange'}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-3 border-t border-slate-50 bg-slate-50/50 mt-auto rounded-b-2xl">
                          <div className="w-full flex justify-between items-center">
                            <div className="flex -space-x-1.5">
                              {(() => {
                                const active = getAssignedMembers(camp.id);
                                return TEAM.map(m => {
                                  const isActive = active.some(a => a.initials === m.initials);
                                  return (
                                    <div
                                      key={m.initials}
                                      title={isActive ? `${m.name} — actif` : m.name}
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white cursor-default select-none transition-all ${
                                        isActive ? `${m.color} text-white` : 'bg-slate-200 text-slate-400'
                                      }`}
                                    >
                                      {m.initials}
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-brand-dark transition-colors">
                              <span>{progress === 100 ? "Voir le rapport" : "Ouvrir le dossier"}</span>
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                  
                  {columnCampaigns.length === 0 && (
                    <div className="flex-1 border-2 border-dashed border-slate-300/50 rounded-xl flex items-center justify-center text-slate-400 text-sm font-medium">
                      Glissez une campagne ici
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Corbeille */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setTrashOpen(o => !o)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-500">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Corbeille</span>
            {deletedCampaigns.length > 0 && (
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {deletedCampaigns.length}
              </span>
            )}
          </div>
          {trashOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {trashOpen && (
          <div className="border-t border-slate-100 px-5 py-4 space-y-2">
            {deletedCampaigns.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-2">La corbeille est vide.</p>
            ) : (
              <>
                <div className="space-y-2">
                  {deletedCampaigns.map(camp => (
                    <div key={camp.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{camp.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Supprimée le {camp.deletedAt ? new Date(camp.deletedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { onRestoreCampaign(camp.id); showToast("Campagne restaurée", "success"); }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-brand-dark bg-brand-purple/5 hover:bg-brand-purple/10 border border-brand-purple/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restaurer
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  {confirmEmptyTrash ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Vider définitivement ?</span>
                      <button
                        type="button"
                        onClick={() => { onEmptyTrash(); setConfirmEmptyTrash(false); }}
                        className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                      >
                        Oui, vider
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmEmptyTrash(false)}
                        className="text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmEmptyTrash(true)}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Vider la corbeille
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}