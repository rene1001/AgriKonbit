# 🚨 PROBLÈME : Dashboard Admin Vide

## 🔍 Diagnostic

Le dashboard admin ne s'affiche pas car les serveurs ont des problèmes de démarrage.

## ✅ Solution Manuelle

### **Étape 1 : Vérifier MySQL**
1. Ouvrir **WAMP** (icône dans la barre des tâches)
2. Vérifier que MySQL est **vert/démarré**
3. Si rouge : clic droit → **Démarrer tous les services**

### **Étape 2 : Vérifier la Base de Données**
1. Ouvrir **phpMyAdmin** : `http://localhost/phpmyadmin`
2. Vérifier que la base **`agrikonbit`** existe
3. Exécuter la migration 027 si pas déjà fait

### **Étape 3 : Démarrer le Backend**
**Terminal/CMD 1 :**
```bash
cd C:\wamp64\www\AgriKonbit\server
npm start
```

**Attendre que vous voyiez :**
```
Server running on port 3001
Database connected successfully
✅ All tables verified
```

### **Étape 4 : Démarrer le Frontend**
**Terminal/CMD 2 :**
```bash
cd C:\wamp64\www\AgriKonbit\client
npm start
```

**Attendre que vous voyiez :**
```
Compiled successfully!
Local: http://localhost:3000
```

### **Étape 5 : Tester**
1. Ouvrir `http://localhost:3000`
2. Se connecter en tant qu'admin
3. Aller sur `http://localhost:3000/admin`
4. Vérifier que le dashboard s'affiche

---

## 🛠️ Si Ça Ne Marche Pas

### **Vérifier les Ports**
- Backend : `http://localhost:3001/health`
- Frontend : `http://localhost:3000`

### **Nettoyer les Processus**
```bash
# Tuer tous les processus node
taskkill /f /im node.exe

# Puis redémarrer les serveurs
```

### **Réinstaller les Dépendances**
```bash
cd C:\wamp64\www\AgriKonbit\server
npm install

cd C:\wamp64\www\AgriKonbit\client
npm install
```

---

## 📋 Checklist Rapide

- [ ] WAMP démarré (MySQL vert)
- [ ] Base agrikonbit existe dans phpMyAdmin
- [ ] Migration 027 exécutée
- [ ] Terminal 1 : serveur backend (port 3001)
- [ ] Terminal 2 : client frontend (port 3000)
- [ ] Dashboard admin accessible sur /admin

---

## 🎯 Test Final

Une fois les serveurs démarrés :
1. ✅ `http://localhost:3001/health` → "OK"
2. ✅ `http://localhost:3000` → Page de connexion
3. ✅ Connexion admin → Dashboard avec sidebar
4. ✅ Clic sur sections → Contenu affiché

**Si vous voyez le dashboard admin avec les 9 sections dans la sidebar, c'est bon !** 🎉
