# Déploiement Vibe Coding Platform

## Déploiement sur Vercel (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Th3lasthack/viibe&root-directory=apps/vibe-coding-platform&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,AI_GATEWAY_BASE_URL)

## Configuration Manuelle

### 1. Variables d'Environnement Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de la base de données | `file:./prod.db` |
| `NEXTAUTH_SECRET` | Secret pour les sessions | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de votre app | `https://votre-app.vercel.app` |
| `AI_GATEWAY_BASE_URL` | Gateway pour les LLMs | Votre URL gateway |

### 2. Variables Optionnelles (OAuth)

| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret |

### 3. Étapes de Déploiement

```bash
# 1. Cloner le repo
git clone https://github.com/Th3lasthack/viibe.git
cd viibe/apps/vibe-coding-platform

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Initialiser la base de données
npx prisma migrate deploy
npx prisma db seed

# 5. Build
npm run build

# 6. Start
npm start
```

## Créer les Apps OAuth

### GitHub OAuth
1. Allez sur https://github.com/settings/developers
2. "New OAuth App"
3. Homepage URL: `https://votre-app.vercel.app`
4. Callback URL: `https://votre-app.vercel.app/api/auth/callback/github`

### Google OAuth
1. Allez sur https://console.cloud.google.com/
2. APIs & Services > Credentials
3. Create OAuth 2.0 Client ID
4. Authorized redirect URI: `https://votre-app.vercel.app/api/auth/callback/google`

## Base de Données Production

Pour la production, utilisez PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@host:5432/viibe?sslmode=require"
```

Services recommandés:
- [Supabase](https://supabase.com) (gratuit)
- [Neon](https://neon.tech) (gratuit)
- [PlanetScale](https://planetscale.com)

## Support

En cas de problème, ouvrez une issue sur GitHub.
