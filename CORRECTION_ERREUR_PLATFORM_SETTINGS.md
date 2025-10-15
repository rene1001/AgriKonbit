# Correction de l'Erreur - Platform Settings

## 🔴 Problème
L'erreur "Erreur lors de la mise à jour" se produit car la table `platform_settings` n'a pas toutes les colonnes nécessaires.

## ✅ Solution

### Option 1 : Exécuter le fichier batch (Recommandé)
Double-cliquez sur le fichier :
```
executer-migration-026.bat
```

### Option 2 : Exécution manuelle via MySQL

1. **Ouvrir MySQL en ligne de commande :**
```bash
mysql -u root -p
```

2. **Exécuter la migration :**
```sql
USE agrikonbit;
source migrations/026_fix_platform_settings.sql
```

### Option 3 : Via phpMyAdmin ou autre outil

1. Ouvrir phpMyAdmin
2. Sélectionner la base de données `agrikonbit`
3. Aller dans l'onglet "SQL"
4. Copier-coller le contenu de `migrations/026_fix_platform_settings.sql`
5. Cliquer sur "Exécuter"

---

## 🔍 Vérification

Après l'exécution, vérifiez que la table est correcte :

```sql
USE agrikonbit;
DESCRIBE platform_settings;
SELECT * FROM platform_settings WHERE id = 1;
```

**Résultat attendu :**

| Field | Type | Null | Key | Default |
|-------|------|------|-----|---------|
| id | int | NO | PRI | NULL |
| withdrawal_fee_pct | decimal(5,2) | YES | | 0.00 |
| distribution_fee_pct | decimal(5,2) | YES | | 0.00 |
| project_withdrawal_fee_pct | decimal(5,2) | YES | | 0.00 |
| min_withdrawal_amount | decimal(15,4) | YES | | 10.0000 |
| created_at | datetime | YES | | CURRENT_TIMESTAMP |
| updated_at | datetime | YES | | CURRENT_TIMESTAMP |

**Données par défaut :**

| id | withdrawal_fee_pct | distribution_fee_pct | project_withdrawal_fee_pct | min_withdrawal_amount |
|----|-------------------|---------------------|---------------------------|---------------------|
| 1 | 2.50 | 1.00 | 3.00 | 10.0000 |

---

## 🔄 Après la Migration

1. **Redémarrer le serveur backend** (si nécessaire) :
```bash
cd server
npm start
```

2. **Rafraîchir la page** dans le navigateur (Ctrl+F5)

3. **Tester la page** `/admin/platform-fees`

---

## 🐛 Si l'Erreur Persiste

### Vérifier les logs du serveur
Regardez la console du serveur Node.js pour voir l'erreur exacte.

### Vérifier que la route existe
```bash
# Dans le serveur, vérifier que cette route est bien définie
GET /api/admin/settings/fees
PUT /api/admin/settings/fees
```

### Vérifier la connexion à la base de données
```sql
-- Tester la connexion
SELECT 1;

-- Vérifier que la table existe
SHOW TABLES LIKE 'platform_settings';

-- Vérifier les données
SELECT * FROM platform_settings;
```

---

## 📝 Notes Importantes

- Cette migration est **idempotente** : vous pouvez l'exécuter plusieurs fois sans problème
- Elle crée la table si elle n'existe pas
- Elle ajoute les colonnes manquantes si elles n'existent pas
- Elle insère les valeurs par défaut si aucune donnée n'existe

---

## ✅ Checklist de Vérification

- [ ] Migration 026 exécutée avec succès
- [ ] Table `platform_settings` existe
- [ ] Toutes les colonnes sont présentes
- [ ] Ligne avec `id = 1` existe avec des valeurs par défaut
- [ ] Serveur backend redémarré
- [ ] Page rafraîchie dans le navigateur
- [ ] Aucune erreur 404 dans la console
- [ ] Les paramètres s'affichent correctement

---

## 🎯 Résultat Attendu

Après la correction, vous devriez pouvoir :
1. Accéder à `/admin/platform-fees`
2. Voir les paramètres actuels affichés
3. Modifier les pourcentages
4. Sauvegarder avec succès
5. Voir le message "Frais de plateforme mis à jour avec succès"
