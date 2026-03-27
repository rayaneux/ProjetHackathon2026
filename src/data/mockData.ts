import type { Criteria, Candidate, GeneratedResponse } from "../context/WorkflowContext";

export function generateMockResponse(criteria: Criteria, candidate: Candidate): GeneratedResponse {
  const meetsGrade = candidate.grade >= criteria.minGrade;
  const meetsLetter = !criteria.requiresMotivationLetter || candidate.hasMotivationLetter;
  const meetsExperiences = !criteria.requiresExperiences || candidate.experiences.trim().length > 0;
  const isAccepted = meetsGrade && meetsLetter && meetsExperiences;

  if (isAccepted) {
    return {
      decision: "accepted",
      message: `Madame, Monsieur ${candidate.lastName},

Nous avons le plaisir de vous informer que votre candidature à ${criteria.schoolName} a été retenue.

Votre dossier a retenu toute notre attention : votre moyenne de ${candidate.grade}/20 correspond aux exigences de notre établissement${candidate.hasMotivationLetter ? ", et votre lettre de motivation témoigne d'une réelle adéquation avec nos valeurs" : ""}.${candidate.experiences ? `\n\nVos expériences (${candidate.experiences}) constituent un atout indéniable pour rejoindre notre communauté.` : ""}

Nous vous souhaitons la bienvenue au sein de ${criteria.schoolName} et restons à votre disposition pour toute question.

Cordialement,
Le service des admissions — ${criteria.schoolName}`,
    };
  }

  const reasons: string[] = [];
  if (!meetsGrade) reasons.push(`votre moyenne (${candidate.grade}/20) est inférieure au seuil requis de ${criteria.minGrade}/20`);
  if (!meetsLetter) reasons.push("une lettre de motivation est requise et n'a pas été fournie");
  if (!meetsExperiences) reasons.push("des expériences ou activités sont requises et n'ont pas été renseignées");

  return {
    decision: "rejected",
    message: `Madame, Monsieur ${candidate.lastName},

Nous avons bien reçu votre candidature à ${criteria.schoolName} et vous remercions de l'intérêt que vous portez à notre établissement.

Après examen attentif de votre dossier, nous sommes au regret de vous informer que nous ne sommes pas en mesure de donner une suite favorable à votre demande.

En effet, ${reasons.join(" et ")}.

Nous vous encourageons à poursuivre vos démarches et vous souhaitons pleine réussite dans votre parcours.

Cordialement,
Le service des admissions — ${criteria.schoolName}`,
  };
}
