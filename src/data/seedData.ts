import type { Candidate, Campaign } from '../types'

// ─── Name pools ───────────────────────────────────────────────────────────────
const FN = ["Léa","Thomas","Marie","Hugo","Camille","Lucas","Chloé","Antoine","Sarah","Paul","Julie","Arthur","Emma","Maxime","Manon","Alexandre","Laura","Victor","Alice","Nicolas","Océane","Baptiste","Inès","Théo","Juliette","Romain","Margot","Clément","Pauline","Florian","Yanis","Jade","Nathan","Lucie","Axel","Mathilde","Kevin","Anaïs","Tristan","Elisa","Dylan","Maëlle","Quentin","Solène","Adrien","Noémie","Valentin","Céline","Raphaël","Amélie"]
const LN = ["Martin","Bernard","Thomas","Petit","Robert","Richard","Durand","Dubois","Moreau","Laurent","Simon","Michel","Lefevre","Leroy","Roux","David","Bertrand","Morel","Fournier","Girard","Bonnet","Garnier","Fontaine","Chevalier","Robin","Muller","Clement","Gauthier","Perrin","Dupont","Blanc","Guerin","Boyer","Leclerc","Leclercq","Arnaud","Rousseau","Perez","Renard","Mercier","Brun","Dumas","Roger","Denis","Henry","Picard","Vasseur","Noel","Lepage","Marchand"]

// ─── Profile templates ────────────────────────────────────────────────────────
const PROFILES_HIGH = [
  () => `• Stage Consultant Junior — Cabinet de conseil stratégique (4 mois)\n  Mission de transformation digitale, livrable présenté au COMEX\n• Président·e association étudiante — 80 membres, budget 8 000 €\n• TOEIC 920, Espagnol B2\n• Double formation Droit des affaires + Management`,
  () => `• Analyste Produit — Scale-up SaaS B2B (5 mois)\n  Roadmap feature, +25% d'adoption en 3 mois\n• Fondateur·trice d'une micro-entreprise (CA 12k€/an)\n• TOEFL 105/120, Allemand B1\n• École d'Ingénieurs + spécialisation Management`,
  () => `• Chef de projet Marketing — Agence internationale (4 mois)\n  Campagnes multi-pays, budget 80 000 €\n• Vice-Président·e Junior Entreprise — 35 missions réalisées\n• Cambridge C1 Advanced, Chinois HSK3\n• Licence Économie mention Très Bien`,
  () => `• Business Developer — Start-up deeptech (6 mois)\n  50 comptes B2B, pipeline 300k€\n• Délégué·e BDE Trésorerie — 12 000 € gérés\n• IELTS 7.5, Espagnol courant\n• DUT GEA + Licence Pro Management`,
  () => `• Chargé·e de mission RSE — Groupe CAC 40 (3 mois)\n  Rapport CSRD, cartographie fournisseurs\n• Bénévole coordinateur·trice ONG internationale\n• TOEIC 895, Arabe natif\n• Master 1 Sciences Politiques`,
]

const PROFILES_MID = [
  () => `• Stage Assistant Marketing — PME régionale (2 mois)\n  Community management, veille concurrentielle\n• Membre actif·ve association culturelle\n• TOEIC 730, Espagnol A2\n• Licence AES mention Bien`,
  () => `• Employé·e commerce — Grande enseigne (saison)\n  Gestion clientèle, merchandising\n• Délégué·e de classe 2 ans\n• Anglais B1 (scolaire), Notions d'italien\n• BTS Management Commercial`,
  () => `• Stagiaire RH — Cabinet de recrutement (6 semaines)\n  Sourcing, rédaction de fiches de poste\n• Trésorier·ère association sportive\n• TOEIC 680, Espagnol B1\n• Licence Psychologie du Travail`,
]

const PROFILES_LOW = [
  () => `• Aucune expérience professionnelle significative\n• Anglais scolaire niveau A2\n• Dossier incomplet — pièces manquantes\n• Licence 1re année sans mention`,
  () => `• Stage non qualifié (1 semaine, bac pro)\n• Aucune expérience associative\n• TOEIC non passé\n• Redoublant·e, dossier académique faible`,
]

const ANALYSES_HIGH = [
  "Profil très solide. Expérience professionnelle pertinente, leadership associatif avéré, compétences linguistiques au-dessus du seuil requis. Cohérence forte entre parcours et projet.",
  "Excellent dossier. Exposition terrain rare pour ce niveau d'études. Soft skills clairement articulés, lettre de motivation précise et ciblée.",
  "Profil distinctif. Compétence rare en lien direct avec nos critères prioritaires. Autonomie démontrée dans des contextes complexes.",
]
const ANALYSES_MID = [
  "Dossier correct mais manque de profondeur sur l'expérience terrain. Lettre générique, projet professionnel flou. Peut être reconsidéré l'année prochaine.",
  "Profil moyen. Éléments positifs dans le parcours académique, mais absence de responsabilité réelle en dehors des cours. Niveau d'anglais juste suffisant.",
]
const ANALYSES_LOW = [
  "Profil insuffisant. Pas d'expérience terrain, lettre standard, niveau de langue sous le seuil requis.",
  "Dossier en deçà du niveau attendu. Absence totale d'expérience associative ou professionnelle à responsabilité.",
]

// ─── Rejection email ──────────────────────────────────────────────────────────
export const rejectionDraft = (firstName: string) =>
`<p>Bonjour ${firstName},</p>

<p>Merci d'avoir candidaté. Nous avons étudié votre dossier avec attention et je vous informe que nous ne pouvons pas vous proposer une place dans la prochaine promotion.</p>

<p>Cette année la sélection a été particulièrement serrée. Certains dossiers n'ont pas été retenus non pas parce qu'ils étaient insuffisants, mais parce que d'autres profils répondaient plus directement aux critères de cette promotion spécifique.</p>

<p>Ce qui a manqué, c'est principalement l'expérience terrain en lien direct avec le programme — stages, projets associatifs à responsabilité réelle ou exposition aux dynamiques d'entreprise en transformation. Si vous envisagez de recandidater, concentrez-vous sur une expérience où vous avez eu une responsabilité mesurable — budget, équipe, livrable — et soyez en mesure d'expliquer en quoi elle vous a changé.</p>

<p>La candidature reste ouverte l'année prochaine. Je vous souhaite bonne continuation.</p>

<p>Claire Beaumont<br/>Responsable des Admissions</p>`

// ─── Candidate generator ──────────────────────────────────────────────────────
function gen(
  prefix: string,
  count: number,
  scoreFn: (i: number) => number,
  statusFn: (score: number) => Candidate['status'],
  validationFn: (score: number) => Candidate['userValidation'],
  dateOffset: number,         // ms offset for applicationDate base
  overrides: Partial<Candidate>[] = []
): Candidate[] {
  return Array.from({ length: count }, (_, i) => {
    const over = overrides[i]
    if (over) return over as Candidate

    const firstName = FN[i % FN.length]
    const lastName  = LN[(i * 7 + 3) % LN.length]
    const score     = scoreFn(i)
    const status    = statusFn(score)
    const validation = validationFn(score)

    let profileData: string
    let aiAnalysis:  string
    let aiEmailDraft = ''

    if (score >= 78) {
      profileData = PROFILES_HIGH[i % PROFILES_HIGH.length]()
      aiAnalysis  = ANALYSES_HIGH[i % ANALYSES_HIGH.length]
    } else if (score >= 55) {
      profileData = PROFILES_MID[i % PROFILES_MID.length]()
      aiAnalysis  = ANALYSES_MID[i % ANALYSES_MID.length]
    } else {
      profileData = PROFILES_LOW[i % PROFILES_LOW.length]()
      aiAnalysis  = ANALYSES_LOW[i % ANALYSES_LOW.length]
    }

    if (status === 'rejected') {
      aiEmailDraft = rejectionDraft(firstName)
    }

    const appDate = new Date(Date.now() - dateOffset - i * 3_600_000 * 6)

    return {
      id: `${prefix}-${i + 2}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      score,
      status,
      userValidation: validation,
      applicationDate: appDate.toISOString(),
      aiAnalysis,
      profileData,
      aiEmailDraft,
      criteriaScores: {},
    } as Candidate
  })
}

// ─── Score distributions ──────────────────────────────────────────────────────
// Realistic bell curve: many mid, few very high/low
const scoreBell = (i: number, base = 68) => Math.max(30, Math.min(99,
  base + Math.round(Math.sin(i * 1.3) * 18 + Math.cos(i * 0.7) * 10)
))

// Decided status (> 72 accepted, <= 72 rejected)
const decidedStatus = (score: number): Candidate['status'] =>
  score > 72 ? 'accepted' : 'rejected'
const decidedValidation = (score: number): Candidate['userValidation'] =>
  score > 72 ? 'approved' : 'approved'

// Sent validation for closed campaigns
const sentValidation = (score: number): Candidate['userValidation'] =>
  score > 72 ? 'approved' : 'sent'

// Pending for upcoming campaigns
const pendingStatus = (_: number): Candidate['status'] => 'pending'
const pendingValidation = (_: number): Candidate['userValidation'] => 'pending'

// ─── MMI criteria ─────────────────────────────────────────────────────────────
export const MMI_CRITERIA = `Formation visée : Master Management de l'Innovation
Date de début : 08 septembre 2025
Date de clôture : 30 juin 2025
Places : 42
Prérequis académiques/techniques : Bac+3 minimum, anglais B2 requis, expérience professionnelle ou associative appréciée
Compétences prioritaires : Stratégie d'entreprise, Management de projet, Leadership, Anglais professionnel
Ton de communication : Professionnel, bienveillant et précis`

// ─── Léa Martin (ID 1, fixed demo candidate) ─────────────────────────────────
const LEA_MARTIN: Candidate = {
  id: '1',
  name: 'Léa Martin',
  email: 'gadwstudio@gmail.com',
  score: 98,
  status: 'pending',
  userValidation: 'pending',
  applicationDate: '2025-04-12T09:14:00.000Z',
  aiAnalysis: "Profil exceptionnel. Stage L'Oréal avec analyse concurrentielle autonome sur les cosmétiques éco-responsables. Trésorier BDE — budget 15 000 €, 500 participants. TOEIC 910/990, Espagnol B2. Lettre de motivation très précise sur le module Green Business Models.",
  profileData: `• Stage Assistant Chef de Produit — L'Oréal (3 mois)\n  Analyse concurrentielle cosmétiques éco-responsables, stratégie marketing digital\n• Trésorier BDE — Gestion budget 15 000 €, organisation événements 500 étudiants\n• TOEIC 910/990 — Espagnol B2\n• Lettre de motivation : module Green Business Models, projet conseil RSE`,
  aiEmailDraft: '',
  criteriaScores: {},
}

// ─── Seed campaigns ───────────────────────────────────────────────────────────
export const DEMO_VERSION = 'v5'

export const SEED_CAMPAIGNS: Campaign[] = [
  // ── 1. Master MMI — Active, 115 candidats (Léa en attente, reste décidé) ──
  {
    id: 'camp-mmi-2025',
    name: "Master en Management de l'Innovation",
    status: 'active',
    createdAt: '2025-03-01T08:00:00.000Z',
    capacity: 42,
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    schoolCriteria: MMI_CRITERIA,
    totalCandidates: 115,
    processedCandidates: 114,
    candidates: [
      LEA_MARTIN,
      ...gen('mmi', 114, i => scoreBell(i, 70), decidedStatus, decidedValidation, 30 * 24 * 3_600_000),
    ],
  },

  // ── 2. Bachelor Business Administration — Active, 128 candidats ──
  {
    id: 'camp-bba-2025',
    name: 'Bachelor Business Administration',
    status: 'active',
    createdAt: '2025-03-15T09:00:00.000Z',
    capacity: 60,
    startDate: '2025-03-15',
    endDate: '2025-07-15',
    schoolCriteria: `Formation visée : Bachelor Business Administration
Date de début : 15 septembre 2025
Date de clôture : 15 juillet 2025
Places : 60
Prérequis académiques/techniques : Bac général ou technologique, anglais B1 minimum
Compétences prioritaires : Curiosité intellectuelle, esprit d'équipe, communication
Ton de communication : Dynamique et encourageant`,
    totalCandidates: 128,
    processedCandidates: 60,
    candidates: gen('bba', 128, i => scoreBell(i, 65), decidedStatus, decidedValidation, 20 * 24 * 3_600_000),
  },

  // ── 3. MSc Data & IA — Upcoming, 103 candidats en attente ──
  {
    id: 'camp-data-ia-2025',
    name: 'MSc Data & Intelligence Artificielle',
    status: 'upcoming',
    createdAt: '2025-04-01T10:00:00.000Z',
    capacity: 30,
    startDate: '2025-09-01',
    endDate: '2025-08-31',
    schoolCriteria: `Formation visée : MSc Data & Intelligence Artificielle pour le Management
Date de début : 01 septembre 2025
Date de clôture : 31 août 2025
Places : 30
Prérequis académiques/techniques : Bac+4 minimum, bases en statistiques ou programmation appréciées
Compétences prioritaires : Analyse de données, Python ou R, curiosité technologique, anglais C1
Ton de communication : Rigoureux et bienveillant`,
    totalCandidates: 103,
    processedCandidates: 0,
    candidates: gen('data', 103, i => scoreBell(i, 72), pendingStatus, pendingValidation, 10 * 24 * 3_600_000),
  },

  // ── 4. Licence Pro Management — Upcoming, 145 candidats en attente ──
  {
    id: 'camp-lpro-2025',
    name: 'Licence Pro Management des Organisations',
    status: 'upcoming',
    createdAt: '2025-04-10T08:00:00.000Z',
    capacity: 80,
    startDate: '2025-09-08',
    endDate: '2025-08-01',
    schoolCriteria: `Formation visée : Licence Professionnelle Management des Organisations
Date de début : 08 septembre 2025
Date de clôture : 01 août 2025
Places : 80
Prérequis académiques/techniques : Bac+2 (BTS, DUT, L2), expérience professionnelle appréciée
Compétences prioritaires : Rigueur, sens de l'organisation, communication orale, esprit d'initiative
Ton de communication : Accessible et motivant`,
    totalCandidates: 145,
    processedCandidates: 0,
    candidates: gen('lpro', 145, i => scoreBell(i, 60), pendingStatus, pendingValidation, 5 * 24 * 3_600_000),
  },

  // ── 5. MBA Executive Part-time — Complété, 112 candidats ──
  {
    id: 'camp-mba-exec-2024',
    name: 'MBA Executive Part-time',
    status: 'closed',
    createdAt: '2024-10-01T08:00:00.000Z',
    capacity: 25,
    startDate: '2024-10-01',
    endDate: '2025-02-28',
    schoolCriteria: `Formation visée : MBA Executive Part-time
Date de début : 01 octobre 2024
Date de clôture : 28 février 2025
Places : 25
Prérequis académiques/techniques : Bac+5 et 5 ans d'expérience professionnelle minimum
Compétences prioritaires : Leadership, gestion d'équipe, vision stratégique, anglais B2
Ton de communication : Formel et respectueux`,
    totalCandidates: 112,
    processedCandidates: 112,
    candidates: gen('mba', 112, i => scoreBell(i, 71), decidedStatus, sentValidation, 180 * 24 * 3_600_000),
  },

  // ── 6. MSc Marketing Digital — Complété, 187 candidats ──
  {
    id: 'camp-mktg-2024',
    name: 'MSc Marketing Digital & Stratégie',
    status: 'closed',
    createdAt: '2024-09-15T08:00:00.000Z',
    capacity: 40,
    startDate: '2024-09-15',
    endDate: '2025-01-31',
    schoolCriteria: `Formation visée : MSc Marketing Digital & Stratégie de marque
Date de début : 15 septembre 2024
Date de clôture : 31 janvier 2025
Places : 40
Prérequis académiques/techniques : Bac+3 minimum, maîtrise des réseaux sociaux et outils digitaux
Compétences prioritaires : Créativité, data marketing, storytelling, anglais B2
Ton de communication : Créatif et bienveillant`,
    totalCandidates: 187,
    processedCandidates: 187,
    candidates: gen('mktg', 187, i => scoreBell(i, 69), decidedStatus, sentValidation, 210 * 24 * 3_600_000),
  },

  // ── 7. MSc Finance d'Entreprise — Complété, 134 candidats ──
  {
    id: 'camp-finance-2024',
    name: 'MSc Finance d\'Entreprise & Marchés',
    status: 'closed',
    createdAt: '2024-08-01T08:00:00.000Z',
    capacity: 35,
    startDate: '2024-08-01',
    endDate: '2025-01-15',
    schoolCriteria: `Formation visée : MSc Finance d'Entreprise & Marchés Financiers
Date de début : 01 octobre 2024
Date de clôture : 15 janvier 2025
Places : 35
Prérequis académiques/techniques : Bac+3 minimum en économie, gestion ou mathématiques, anglais B2
Compétences prioritaires : Analyse financière, modélisation Excel, rigueur analytique, anglais technique
Ton de communication : Rigoureux et professionnel`,
    totalCandidates: 134,
    processedCandidates: 134,
    candidates: gen('fin', 134, i => scoreBell(i, 73), decidedStatus, sentValidation, 240 * 24 * 3_600_000),
  },

  // ── 8. Mastère Spécialisé Entrepreneuriat — Complété, 109 candidats ──
  {
    id: 'camp-entre-2024',
    name: 'Mastère Spécialisé Entrepreneuriat & Innovation',
    status: 'closed',
    createdAt: '2024-07-15T08:00:00.000Z',
    capacity: 28,
    startDate: '2024-07-15',
    endDate: '2024-12-31',
    schoolCriteria: `Formation visée : Mastère Spécialisé Entrepreneuriat & Innovation
Date de début : 15 septembre 2024
Date de clôture : 31 décembre 2024
Places : 28
Prérequis académiques/techniques : Bac+5 ou Bac+3 avec expérience entrepreneuriale, projet de création ou de reprise d'entreprise
Compétences prioritaires : Vision entrepreneuriale, résilience, leadership, capacité à convaincre
Ton de communication : Direct, inspirant et exigeant`,
    totalCandidates: 109,
    processedCandidates: 109,
    candidates: gen('entre', 109, i => scoreBell(i, 71), decidedStatus, sentValidation, 270 * 24 * 3_600_000),
  },
]
