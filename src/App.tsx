import { useState, useEffect, useRef } from 'react'
import { Toaster, showToast } from './components/Toaster'
import { Stepper } from './components/Stepper'
import Step1Criteria from './pages/Step1Criteria'
import Step2Candidate from './pages/Step2Candidate'
import Step3Generate from './pages/Step3Generate'
import Step4Selection from './pages/Step4Selection'
import Step5Response from './pages/Step5Response'
import Step6Bilan from './pages/Step6Bilan'
import Dashboard from './pages/Dashboard'
import SchoolLanding from './pages/SchoolLanding'
import LandingPage from './pages/LandingPage'
import FormBuilder from './pages/FormBuilder'
import Onboarding from './pages/Onboarding'
import type { Candidate, Campaign, Form } from './types'

function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<"dashboard" | "funnel" | "school_landing" | "landing" | "forms" | "onboarding">(() => {
    const path = window.location.pathname;
    const qp = new URLSearchParams(window.location.search);
    const view = qp.get('view');
    if (path.endsWith('/school') || view === 'school') return "school_landing";
    if (path.endsWith('/app')    || view === 'app')    return "dashboard";
    return "landing";
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Data
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_campaigns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  const [deletedCampaigns, setDeletedCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_deleted_campaigns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [forms, setForms] = useState<Form[]>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_forms');
      return saved ? JSON.parse(saved) : [{
        id: 'default',
        name: 'Formulaire Standard',
        createdAt: new Date().toISOString(),
        fields: [
          { id: 'firstName', label: 'Prénom', type: 'text', required: true },
          { id: 'lastName', label: 'Nom', type: 'text', required: true },
          { id: 'email', label: 'Email', type: 'email', required: true },
          { id: 'dossier', label: 'Dossier académique & Lettre de motivation', type: 'textarea', required: true }
        ]
      }];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('lighthouse_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('lighthouse_forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('lighthouse_deleted_campaigns', JSON.stringify(deletedCampaigns));
  }, [deletedCampaigns]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lighthouse_campaigns' && e.newValue) {
        setCampaigns(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // App State (Temporary state for the active funnel)
  const [schoolCriteria, setSchoolCriteria] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Helpers Navigation Funnel
  const nextStep = () => {
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, 6);
      setFurthestStep(f => Math.max(f, next));
      return next;
    });
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // --- External Application Receiver ---
  const handleNewApplication = (campaignId: string, candidateData: any) => {
    setCampaigns(prev => {
      let targetId = campaignId;
      // Si l'ID n'est pas trouvé ou vide, on prend la première campagne existante par défaut
      if (!prev.find(c => c.id === targetId) && prev.length > 0) {
        targetId = prev[0].id;
      }

      return prev.map(camp => {
        if (camp.id === targetId) {
          const newCandidate: Candidate = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            name: `${candidateData.firstName} ${candidateData.lastName}`.trim(),
            email: candidateData.email,
            profileData: candidateData.dossier,
            applicationDate: new Date().toISOString(),
            status: 'pending',
            aiAnalysis: '',
            score: 0,
            criteriaScores: {},
            userValidation: 'pending'
          };
          
          return {
            ...camp,
            candidates: [...(camp.candidates || []), newCandidate],
            totalCandidates: (camp.totalCandidates || 0) + 1
          };
        }
        return camp;
      });
    });
  };

  // --- Actions Dashboard ---
  const handleCreateNewCampaign = () => {
    // 1. On nettoie le state temporaire
    setSchoolCriteria("");
    setCandidates([]);
    setCurrentStep(1);
    setFurthestStep(1);
    
    // 2. On crée une coquille vide de campagne
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: "Nouvelle Campagne",
      createdAt: new Date().toISOString(),
      status: "upcoming", // Nouveau statut par défaut
      totalCandidates: 0,
      processedCandidates: 0,
    };
    
    setCampaigns([newCampaign, ...campaigns]);
    setActiveCampaignId(newCampaign.id);
    setCurrentView("funnel");
  };

  const handleUpdateCampaignStatus = (id: string, newStatus: Campaign['status']) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleLinkFormToCampaign = (campaignId: string, formId: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, linkedFormId: formId } : c))
    );
  };

  const handleRenameCampaign = (id: string, newName: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleSelectCampaign = (id: string) => {
    const camp = campaigns.find(c => c.id === id);
    if (!camp) return;

    // On recharge la data dans le funnel
    setSchoolCriteria(camp.schoolCriteria || "");
    setCandidates(camp.candidates || []);
    
  // Logique de reprise : on va là où il s'était arrêté
  if (camp.candidates && camp.candidates.length > 0) {
    if (camp.processedCandidates === camp.totalCandidates) {
      setCurrentStep(6); // Bilan
      setFurthestStep(6);
    }
    else {
      setCurrentStep(4); // Sélection ou Retours
      setFurthestStep(4);
    }
  } else {
    setCurrentStep(1);
    setFurthestStep(1);
  }

    setActiveCampaignId(camp.id);
    setCurrentView("funnel");
  };

  // --- Synchro Active Campaign <-> App State ---
  useEffect(() => {
    if (!activeCampaignId) return;

    setCampaigns(prev => prev.map(camp => {
      if (camp.id === activeCampaignId) {
        // Robust extraction logic matching Step1Criteria
        const extractField = (text: string, startKey: string, nextKeys: string[]) => {
          if (!text) return "";
          const startIndex = text.indexOf(startKey);
          if (startIndex === -1) return "";
          const contentStart = startIndex + startKey.length;
          let endIndex = text.length;
          for (const key of nextKeys) {
            const keyIndex = text.indexOf(key, contentStart);
            if (keyIndex !== -1 && keyIndex < endIndex) {
              endIndex = keyIndex;
            }
          }
          return text.substring(contentStart, endIndex).trim();
        };

        const newName = extractField(schoolCriteria, "Formation visée :", ["\nDate de début :", "\nDate de clôture :", "\nPlaces :", "\nPrérequis académiques/techniques :"]) || camp.name || "Nouvelle Campagne";
        const startDate = extractField(schoolCriteria, "Date de début :", ["\nDate de clôture :", "\nPlaces :", "\nPrérequis académiques/techniques :"]);
        const endDate = extractField(schoolCriteria, "Date de clôture :", ["\nPlaces :", "\nPrérequis académiques/techniques :"]);
        const capacityStr = extractField(schoolCriteria, "Places :", ["\nPrérequis académiques/techniques :"]);
        const parsedCapacity = parseInt(capacityStr, 10);
        const capacity = isNaN(parsedCapacity) ? undefined : parsedCapacity;

        // Auto-calcul du statut basé sur les dates
        let newStatus = camp.status;
        
        const parseDateSafe = (dStr: string): Date | null => {
          if (!dStr) return null;
          const digits = dStr.replace(/\D/g, "");
          if (digits.length === 8) {
            const parsed = new Date(
              `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`
            );
            return isNaN(parsed.getTime()) ? null : parsed;
          }
          const d = dStr.trim();
          if (d.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = d.split("/");
            const parsed = new Date(`${year}-${month}-${day}`);
            return isNaN(parsed.getTime()) ? null : parsed;
          }
          return null;
        };

        const start = parseDateSafe(startDate);
        const end = parseDateSafe(endDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // On compare uniquement les jours
        
        if (start || end) {
          if (start) start.setHours(0, 0, 0, 0);
          if (end) end.setHours(23, 59, 59, 999);
          
          if (start && end) {
            if (now < start) newStatus = 'upcoming';
            else if (now > end) newStatus = 'closed';
            else newStatus = 'active';
          } else if (start) {
            if (now < start) newStatus = 'upcoming';
            else newStatus = 'active';
          } else if (end) {
            if (now > end) newStatus = 'closed';
            else newStatus = 'active';
          }
        }
        // Si aucune date n'est définie, on garde le statut actuel (ex: défini par drag & drop)

        return {
          ...camp,
          name: newName,
          totalCandidates: candidates.length,
          processedCandidates: candidates.filter(c => c.userValidation === 'sent').length,
          candidates: candidates,
          schoolCriteria: schoolCriteria,
          startDate: startDate || camp.startDate,
          endDate: endDate || camp.endDate,
          capacity: capacity || camp.capacity, // Ajout du nombre de places
          status: newStatus, // On met à jour le statut global !
        };
      }
      return camp;
    }));
  }, [schoolCriteria, candidates, activeCampaignId]);

  const handleDeleteCampaign = (id: string) => {
    const target = campaigns.find(c => c.id === id);
    if (target) {
      setDeletedCampaigns(d => [...d, { ...target, deletedAt: new Date().toISOString() }]);
    }
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleRestoreCampaign = (id: string) => {
    setDeletedCampaigns(prev => {
      const target = prev.find(c => c.id === id);
      if (target) {
        const { deletedAt: _deletedAt, ...restored } = target;
        setCampaigns(c => [restored, ...c]);
      }
      return prev.filter(c => c.id !== id);
    });
  };

  const handleEmptyTrash = () => {
    setDeletedCampaigns([]);
  };

  const handleBackToDashboard = () => {
    const activeCamp = campaigns.find(c => c.id === activeCampaignId);
    const isBlank = !activeCamp ||
      ((!activeCamp.candidates || activeCamp.candidates.length === 0) && !activeCamp.schoolCriteria);

    if (isBlank) {
      setCampaigns(prev => prev.filter(c => c.id !== activeCampaignId));
    } else {
      showToast("Brouillon sauvegardé", "success");
    }

    setCurrentView("dashboard");
    setActiveCampaignId(null);
  };


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (currentView === "school_landing") {
    return <SchoolLanding onApply={handleNewApplication} />;
  }

  if (currentView === "onboarding") {
    return <Onboarding onComplete={() => {
      window.history.pushState({}, '', '/app');
      setCurrentView("dashboard");
    }} />;
  }

  if (currentView === "landing") {
    return <LandingPage onGetStarted={() => {
      setCurrentView("onboarding");
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-foreground selection:bg-brand-purple/30 selection:text-brand-dark flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-border py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={handleBackToDashboard}
          >
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Lighthouse Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
            <h1 className="text-xl font-bold tracking-tight font-serif">Lighthouse</h1>
          </div>

          {(currentView === "dashboard" || currentView === "forms") && (
            <nav className="flex space-x-2">
              <button 
                onClick={() => setCurrentView("dashboard")}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${currentView === "dashboard" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Campagnes
              </button>
              <button 
                onClick={() => setCurrentView("forms")}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${currentView === "forms" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Formulaires
              </button>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-5 text-[13px] font-medium text-muted-foreground">
          {/* Team presence */}
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {[
                { initials: "MT", color: "bg-purple-500", name: "Marie T." },
                { initials: "TD", color: "bg-blue-500",   name: "Thomas D." },
                { initials: "JR", color: "bg-emerald-500", name: "Julie R." },
              ].map(m => (
                <div
                  key={m.initials}
                  title={`${m.name} — en ligne`}
                  className={`w-7 h-7 ${m.color} text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white cursor-default select-none`}
                >
                  {m.initials}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">3 en ligne</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>Système Prêt</span>
          <div className="w-px h-4 bg-slate-200" />
          {/* User avatar + menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="w-8 h-8 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white hover:ring-slate-300 transition-all select-none"
              title="Mon compte"
            >
              GA
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">Gauthier A.</p>
                  <p className="text-[11px] text-slate-400 truncate">gadwstudio@gmail.com</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setCurrentView("landing");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 w-full">
        {currentView === "forms" ? (
          <FormBuilder forms={forms} setForms={setForms} />
        ) : currentView === "dashboard" ? (
          <Dashboard
            campaigns={campaigns}
            forms={forms}
            onCreateNew={handleCreateNewCampaign}
            onSelectCampaign={handleSelectCampaign}
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
            onLinkFormToCampaign={handleLinkFormToCampaign}
            onRenameCampaign={handleRenameCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            deletedCampaigns={deletedCampaigns}
            onRestoreCampaign={handleRestoreCampaign}
            onEmptyTrash={handleEmptyTrash}
          />
        ) : (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Bouton Retour */}
            <button 
              onClick={handleBackToDashboard}
              className="text-sm font-semibold text-slate-500 hover:text-brand-dark mb-6 flex items-center transition-colors"
            >
              ← Retour au tableau de bord
            </button>

            <Stepper currentStep={currentStep} furthestStep={furthestStep} onStepClick={setCurrentStep} />
            
            <div className="mt-8">
              {currentStep === 1 && (
                <Step1Criteria 
                  schoolCriteria={schoolCriteria}
                  setSchoolCriteria={setSchoolCriteria}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <Step2Candidate 
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 3 && (
                <Step3Generate 
                  schoolCriteria={schoolCriteria}
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onNext={nextStep}
                />
              )}
              {currentStep === 4 && (
                <Step4Selection 
                  candidates={candidates}
                  setCandidates={setCandidates}
                  capacity={campaigns.find(c => c.id === activeCampaignId)?.capacity || Infinity}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 5 && (
                <Step5Response 
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onPrev={prevStep}
                  onNext={nextStep}
                />
              )}
              {currentStep === 6 && (
                <Step6Bilan
                  candidates={candidates}
                  schoolCriteria={schoolCriteria}
                  onComplete={() => {
                    if (activeCampaignId) {
                      setCampaigns(prev => prev.map(c =>
                        c.id === activeCampaignId ? { ...c, status: "closed" as const } : c
                      ));
                    }
                    handleBackToDashboard();
                    setCurrentStep(1);
                  }}
                  onReset={() => {
                    handleBackToDashboard();
                    setCurrentStep(1);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

export default App
