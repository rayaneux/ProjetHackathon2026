# Lighthouse — Plateforme d'Admission IA

Outil destiné aux écoles pour gérer leurs campagnes d'admission : import de candidats, analyse IA mockée, décision humaine, génération de réponses personnalisées et envoi.

---

## Stack Technique
- React (Vite) + TypeScript
- Tailwind CSS + shadcn/ui
- localStorage (persistance, pas de DB)
- EmailJS (envoi d'emails de démo)
- Papa Parse (parsing CSV)

---

## Architecture — Vues & Navigation

L'état de navigation est géré dans `App.tsx` via `currentView` :

| Vue | Composant | Description |
|-----|-----------|-------------|
| `landing` | `LandingPage.tsx` | Page marketing publique |
| `dashboard` | `Dashboard.tsx` | Kanban des campagnes |
| `funnel` | Steps 1→6 | Workflow d'une campagne |
| `forms` | `FormBuilder.tsx` | Création de formulaires |
| `school_landing` | `SchoolLanding.tsx` | Formulaire candidat (embeddable) |

---

## Workflow Funnel — 6 étapes

| Étape | Fichier | Description |
|-------|---------|-------------|
| 1 | `Step1Criteria.tsx` | Critères de la campagne (formation, dates, capacité, hard/soft skills, ton) |
| 2 | `Step2Candidate.tsx` | Import CSV ou mock de 100 candidats |
| 3 | `Step3Generate.tsx` | Simulation IA (scoring 40-100, candidat "1" = 98 forcé) |
| 4 | `Step4Selection.tsx` | Revue humaine accept/reject, respect capacité, modal détail |
| 5 | `Step5Response.tsx` | Génération & envoi emails de retour aux refusés (EmailJS) |
| 6 | `Step6Bilan.tsx` | Récapitulatif de campagne |

---

## Types principaux (`types.ts`)

```ts
Candidate      // id, name, email, profileData, score, aiAnalysis, aiEmailDraft, userValidation, status
Campaign       // id, name, status, candidates[], schoolCriteria, startDate, endDate, capacity, linkedFormId
Form           // id, name, fields (FormField[])
FormField      // id, label, type, required, options
```

---

## Fichiers & Responsabilités

```
src/
├── App.tsx                  # Shell principal, state global, navigation, persistance localStorage
├── types.ts                 # Tous les types TypeScript
├── context/
│   └── WorkflowContext.tsx  # (Créé par Claude Code — non utilisé par App.tsx actuellement)
├── data/
│   └── mockData.ts          # (Créé par Claude Code — non utilisé actuellement)
├── components/
│   ├── Stepper.tsx          # Barre de progression 6 étapes, cliquable
│   └── ui/                  # Composants shadcn (button, card, input, label, textarea)
├── pages/
│   ├── LandingPage.tsx      # Marketing (hero, features, pricing, testimonials)
│   ├── Dashboard.tsx        # Kanban drag-and-drop des campagnes
│   ├── FormBuilder.tsx      # Création de formulaires personnalisés + code embed iframe
│   ├── SchoolLanding.tsx    # Formulaire candidat (URL params: formId, campaignId, embed)
│   ├── Step1Criteria.tsx    # Formulaire critères + auto-parse vers schoolCriteria string
│   ├── Step2Candidate.tsx   # Upload CSV (PapaParse) + mock 100 candidats
│   ├── Step3Generate.tsx    # Animation IA + scoring mock + auto-avance
│   ├── Step4Selection.tsx   # Sélection humaine + modal + EmailJS wow-effect
│   ├── Step5Response.tsx    # Emails pédagogiques refusés + EmailJS batch
│   └── Step6Bilan.tsx       # Récap campagne
└── lib/
    └── utils.ts             # cn() helper
```

---

## Points clés à savoir

- **Pas d'API LLM réelle** : tout est mocké (scores aléatoires, textes hardcodés)
- **Candidat "1"** : profil démo avec score forcé à 98, email EmailJS envoyé à gadwstudio@gmail.com à l'acceptation
- **schoolCriteria** : string structuré parsé par `extractField()` dans App.tsx (clés : "Formation visée :", "Date de début :", etc.)
- **Statut campagne** auto-calculé depuis les dates (upcoming / active / closed)
- **WorkflowContext.tsx** et **mockData.ts** créés par Claude Code sont présents mais non intégrés dans App.tsx — à nettoyer ou intégrer si besoin

---

## Protocole de Collaboration Multi-LLM

1. **Read-Before-Write** : toujours lire le fichier avant d'éditer
2. **Éditions ciblées** : pas de réécriture complète de fichiers
3. **Ce fichier** fait foi pour l'état du projet — le mettre à jour après chaque session

---

## Périmètres actuels

- **Cursor (LLM 1)** : UI, design, composants, logique métier (a tout géré jusqu'ici)
- **Claude Code (LLM 2)** : disponible — à assigner sur des tâches spécifiques
