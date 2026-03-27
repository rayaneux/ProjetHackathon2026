# Contexte du Projet

Ce projet est une plateforme destinée aux écoles, leur permettant de formaliser une réponse claire aux candidats postulant à leur école, en s'aidant d'un LLM (Large Language Model).

## Stack Technique
- React (via Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui (précédemment mentionné sous le nom de "Shards UI Kit")

## Workflow de l'application (4 étapes)
1. L'école configure ses critères de sélection
2. Elle soumet / importe un dossier candidat
3. L'outil génère une réponse (mockée pour le proto)
4. L'école visualise / valide la réponse avant envoi

## Périmètres LLM
- **Cursor (LLM 1)** : UI — composants shadcn, design, mise en page
- **Claude Code (LLM 2)** : Logique de navigation, gestion d'état, workflow entre les étapes

## Instructions
- C'est un prototype / démo cliquable — pas d'API LLM réelle, pas de DB
- S'appuyer sur les composants shadcn/ui pour l'interface utilisateur.

## Protocole de Collaboration Multi-LLM
Pour garantir un travail fluide entre les différentes instances LLM et éviter d'écraser le code :
1. **Périmètres stricts** : Chaque LLM doit se limiter au périmètre défini par l'utilisateur (par exemple : LLM 1 sur l'UI/Frontend, LLM 2 sur la logique métier/Backend).
2. **Read-Before-Write (Indispensable)** : Toujours lire le contenu le plus récent d'un fichier (avec l'outil `Read`) avant d'y apporter des modifications, afin de s'assurer d'avoir la version incluant le travail récent de l'autre LLM.
3. **Mises à jour ciblées** : Privilégier les remplacements de chaînes spécifiques (via `StrReplace`) plutôt que de réécrire des fichiers entiers quand c'est possible.
4. **Communication indirecte** : Ce fichier (`claude.md`) peut servir de journal ou de "Kanban" si besoin pour tracer l'état d'avancement.
