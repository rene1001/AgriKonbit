# Déploiement Docker (dev)

Prérequis: Docker + Docker Compose.

1. Copier les variables d'environnement:
   - Backend: adapter `server/env.example` en `server/.env` (ou utiliser env inline docker-compose)

2. Lancer les services:
   ```bash
   cd docker
   docker compose up --build
   ```

Services:
- MySQL: 3306
- API: http://localhost:5000
- Frontend: http://localhost:3000

Après le démarrage, exécuter la migration (si nécessaire) contre le conteneur `server` ou localement:
```bash
node migrations/migrate.js
```
