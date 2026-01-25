# Viibe Project - Plan de Tâches Complet

> **Objectif**: Rendre le projet 100% fonctionnel
> **Dernière mise à jour**: 2026-01-25
> **Progression globale**: ~50%

---

## PHASE 1: AUTHENTIFICATION & SÉCURITÉ (Critique)

### 1.1 Système d'Authentification
- [ ] **[P0]** Implémenter l'authentification utilisateur (NextAuth.js ou Auth.js)
  - Fichier: `/apps/vibe-coding-platform/app/api/auth/[...nextauth]/route.ts`
  - Support OAuth (GitHub, Google)
  - Support email/password
- [ ] **[P0]** Créer les pages de login/register
  - `/apps/vibe-coding-platform/app/(auth)/login/page.tsx`
  - `/apps/vibe-coding-platform/app/(auth)/register/page.tsx`
- [ ] **[P0]** Protéger les routes API avec middleware d'authentification
  - `/apps/vibe-coding-platform/middleware.ts`
- [ ] **[P1]** Ajouter la gestion des sessions utilisateur
- [ ] **[P1]** Implémenter le refresh token

### 1.2 Rate Limiting & Sécurité
- [ ] **[P1]** Implémenter le rate limiting par utilisateur
  - Utiliser upstash/ratelimit ou similaire
- [ ] **[P1]** Ajouter la validation des entrées côté serveur (zod schemas)
- [ ] **[P2]** Implémenter CSRF protection
- [ ] **[P2]** Ajouter des logs de sécurité

---

## PHASE 2: BASE DE DONNÉES & PERSISTANCE (Critique)

### 2.1 Configuration Database
- [ ] **[P0]** Choisir et configurer la base de données
  - Option recommandée: Prisma + PostgreSQL (Supabase/Neon)
- [ ] **[P0]** Créer le schéma de base de données
  ```
  /apps/vibe-coding-platform/prisma/schema.prisma
  - User (id, email, name, avatar, createdAt)
  - Project (id, userId, name, description, sandboxId, createdAt)
  - Conversation (id, projectId, messages[], createdAt)
  - Message (id, conversationId, role, content, metadata)
  - GeneratedFile (id, projectId, path, content, createdAt)
  ```
- [ ] **[P0]** Configurer les migrations Prisma
- [ ] **[P1]** Implémenter le seed de données initiales

### 2.2 API de Persistance
- [ ] **[P0]** Créer les routes API pour les projets
  - `GET /api/projects` - Liste des projets utilisateur
  - `POST /api/projects` - Créer un projet
  - `GET /api/projects/[id]` - Détails du projet
  - `PUT /api/projects/[id]` - Modifier un projet
  - `DELETE /api/projects/[id]` - Supprimer un projet
- [ ] **[P0]** Créer les routes API pour les conversations
  - `GET /api/projects/[id]/conversations`
  - `POST /api/projects/[id]/conversations`
  - `GET /api/conversations/[id]/messages`
- [ ] **[P1]** Implémenter la sauvegarde automatique des conversations
- [ ] **[P1]** Ajouter l'export/import de projets

---

## PHASE 3: FONCTIONNALITÉS UTILISATEUR (Important)

### 3.1 Gestion des Projets
- [ ] **[P1]** Créer le dashboard utilisateur
  - `/apps/vibe-coding-platform/app/dashboard/page.tsx`
  - Liste des projets récents
  - Statistiques d'utilisation
- [ ] **[P1]** Implémenter la page de détails du projet
  - `/apps/vibe-coding-platform/app/projects/[id]/page.tsx`
- [ ] **[P1]** Ajouter la fonctionnalité de duplication de projet
- [ ] **[P2]** Implémenter les favoris/épinglés
- [ ] **[P2]** Ajouter les tags/catégories de projets

### 3.2 Templates & Exemples
- [ ] **[P1]** Créer une bibliothèque de templates
  - Templates par framework (Next.js, React, Vue, Python)
  - Templates par cas d'usage (API, Dashboard, Landing page)
- [ ] **[P1]** Implémenter l'interface de sélection de templates
  - `/apps/vibe-coding-platform/components/templates/template-picker.tsx`
- [ ] **[P2]** Permettre aux utilisateurs de sauvegarder leurs propres templates
- [ ] **[P2]** Ajouter des templates communautaires

### 3.3 Amélioration du File Explorer
- [ ] **[P2]** Ajouter la recherche de fichiers
- [ ] **[P2]** Implémenter le filtrage par type de fichier
- [ ] **[P2]** Ajouter le renommage de fichiers
- [ ] **[P2]** Implémenter le drag & drop pour réorganiser
- [ ] **[P3]** Ajouter la prévisualisation d'images

### 3.4 Éditeur de Code Amélioré
- [ ] **[P2]** Intégrer Monaco Editor ou CodeMirror
- [ ] **[P2]** Ajouter la coloration syntaxique avancée
- [ ] **[P2]** Implémenter l'autocomplétion
- [ ] **[P3]** Ajouter le support multi-tabs pour l'édition
- [ ] **[P3]** Implémenter la comparaison de versions (diff)

---

## PHASE 4: INFRASTRUCTURE & CONFIGURATION (Important)

### 4.1 Configuration Environnement
- [ ] **[P0]** Créer le fichier `.env.example` avec toutes les variables
  ```env
  # AI Configuration
  AI_GATEWAY_BASE_URL=
  OPENAI_API_KEY=
  ANTHROPIC_API_KEY=

  # Database
  DATABASE_URL=

  # Authentication
  NEXTAUTH_SECRET=
  NEXTAUTH_URL=
  GITHUB_CLIENT_ID=
  GITHUB_CLIENT_SECRET=

  # Vercel
  VERCEL_TOKEN=
  ```
- [ ] **[P1]** Documenter chaque variable d'environnement
- [ ] **[P1]** Ajouter la validation des variables au démarrage

### 4.2 Monitoring & Logging
- [ ] **[P2]** Intégrer un système de logging (Pino, Winston)
- [ ] **[P2]** Ajouter le monitoring d'erreurs (Sentry)
- [ ] **[P2]** Implémenter les analytics d'utilisation
- [ ] **[P3]** Créer un dashboard admin pour le monitoring

### 4.3 CI/CD & Déploiement
- [ ] **[P1]** Configurer les GitHub Actions pour CI
  - Linting
  - Tests
  - Build verification
- [ ] **[P1]** Créer le guide de déploiement Vercel
- [ ] **[P2]** Ajouter les preview deployments automatiques
- [ ] **[P2]** Configurer les environnements (staging, production)

---

## PHASE 5: DOCUMENTATION (Important)

### 5.1 Documentation Technique
- [ ] **[P1]** Créer `/apps/vibe-coding-platform/README.md` complet
  - Installation
  - Configuration
  - Architecture
  - Contribution
- [ ] **[P1]** Documenter l'API (OpenAPI/Swagger)
  - `/apps/vibe-coding-platform/docs/api.md`
- [ ] **[P2]** Créer des diagrammes d'architecture (Mermaid)
- [ ] **[P2]** Documenter les patterns et conventions de code

### 5.2 Documentation Utilisateur
- [ ] **[P2]** Créer un guide de démarrage rapide
- [ ] **[P2]** Ajouter des tutoriels vidéo/GIF
- [ ] **[P3]** Créer une FAQ
- [ ] **[P3]** Ajouter une documentation in-app (tooltips, onboarding)

---

## PHASE 6: TESTS & QUALITÉ (Important)

### 6.1 Tests Unitaires
- [ ] **[P1]** Configurer Jest + Testing Library
- [ ] **[P1]** Écrire les tests pour les composants UI critiques
  - Chat component
  - File explorer
  - Model selector
- [ ] **[P2]** Atteindre 60% de couverture de code
- [ ] **[P2]** Ajouter les tests pour les hooks Zustand

### 6.2 Tests d'Intégration
- [ ] **[P2]** Écrire les tests pour les routes API
- [ ] **[P2]** Tester le flow d'authentification
- [ ] **[P2]** Tester la création/sauvegarde de projets

### 6.3 Tests E2E
- [ ] **[P2]** Configurer Playwright
- [ ] **[P2]** Écrire les tests E2E pour les flows critiques
  - Login → Create project → Generate code → Preview
- [ ] **[P3]** Ajouter les tests de performance

---

## PHASE 7: AMÉLIORATIONS RALPH (Secondaire)

### 7.1 Phase 1.5 - Session Expiration
- [ ] **[P2]** Compléter l'implémentation de l'expiration de session
- [ ] **[P2]** Ajouter les notifications d'expiration

### 7.2 Phase 2 - Agent SDK Integration
- [ ] **[P3]** Évaluer l'intégration du Claude Agent SDK
- [ ] **[P3]** Concevoir l'architecture hybride CLI/SDK

### 7.3 Infrastructure Ralph
- [ ] **[P3]** Implémenter la rotation des logs
- [ ] **[P3]** Ajouter le mode dry-run
- [ ] **[P3]** Créer le fichier de configuration `.ralphrc`

---

## PHASE 8: FONCTIONNALITÉS AVANCÉES (Nice-to-have)

### 8.1 Collaboration
- [ ] **[P4]** Implémenter le partage de projets
- [ ] **[P4]** Ajouter l'édition collaborative en temps réel
- [ ] **[P4]** Créer un système de commentaires

### 8.2 Git Integration
- [ ] **[P3]** Connecter les projets à GitHub
- [ ] **[P3]** Implémenter le commit/push depuis l'interface
- [ ] **[P4]** Ajouter l'import depuis un repo existant

### 8.3 Marketplace
- [ ] **[P4]** Créer une marketplace de templates
- [ ] **[P4]** Permettre la vente de templates premium
- [ ] **[P4]** Ajouter un système de reviews

---

## RÉSUMÉ PAR PRIORITÉ

| Priorité | Nombre de tâches | Description |
|----------|-----------------|-------------|
| **P0** | 8 | Critiques - Bloquants pour le fonctionnement |
| **P1** | 18 | Hautes - Essentielles pour l'expérience utilisateur |
| **P2** | 25 | Moyennes - Améliorations importantes |
| **P3** | 12 | Basses - Nice-to-have |
| **P4** | 6 | Futures - Fonctionnalités avancées |

**Total**: ~69 tâches

---

## ORDRE D'EXÉCUTION RECOMMANDÉ

1. **Sprint 1**: Authentification (P0) + Base de données (P0)
2. **Sprint 2**: API Persistance (P0) + Dashboard (P1)
3. **Sprint 3**: Templates (P1) + Configuration env (P0)
4. **Sprint 4**: Tests unitaires (P1) + CI/CD (P1)
5. **Sprint 5**: Documentation (P1-P2)
6. **Sprint 6+**: Améliorations (P2-P4)

---

## NOTES TECHNIQUES

### Dépendances à ajouter
```bash
# Authentication
npm install next-auth @auth/prisma-adapter

# Database
npm install prisma @prisma/client

# Rate Limiting
npm install @upstash/ratelimit @upstash/redis

# Monitoring
npm install @sentry/nextjs pino

# Testing
npm install -D jest @testing-library/react playwright
```

### Structure de fichiers à créer
```
apps/vibe-coding-platform/
├── prisma/
│   └── schema.prisma
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── projects/[id]/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── projects/
│           ├── route.ts
│           └── [id]/
│               ├── route.ts
│               └── conversations/route.ts
├── components/
│   ├── auth/
│   ├── dashboard/
│   └── templates/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── ratelimit.ts
├── .env.example
└── docs/
    ├── api.md
    └── deployment.md
```
