# 🪙 Crypto Dashboard

Dashboard React qui affiche en temps réel les 20 principales cryptomonnaies via l'API [CoinGecko](https://www.coingecko.com/).

🔗 **Demo live** : [crypto-dashboard-one-rouge.vercel.app](https://crypto-dashboard-one-rouge.vercel.app)
🐙 **Code source** : [github.com/dev-juvenal/crypto-dashboard](https://github.com/dev-juvenal/crypto-dashboard)

---

## ✨ Fonctionnalités

- 📊 **Liste en temps réel** des 20 top cryptos (prix, variation 24h, logo)
- 🔍 **Recherche instantanée** avec debounce pour économiser les appels API
- 🔀 **Tri par colonne** (rang, nom, prix, variation 24h)
- ⭐ **Favoris** persistés en localStorage avec filtre dédié
- 🌙 **Mode sombre** avec bascule et détection de la préférence système
- 📈 **Graphique d'évolution** sur 7 jours au clic sur une crypto
- ⚡ **Cache intelligent** et refetch automatique via React Query
- 🛡️ **Gestion d'erreurs complète** (rate limiting, réseau, API indisponible)
- 🎨 **Interface moderne** et responsive avec Tailwind CSS

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Front-end | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| État serveur | TanStack Query (React Query) |
| Graphiques | Recharts |
| API | CoinGecko REST API |
| Déploiement | Vercel |

---

## 🚀 Installation locale

```bash
# Cloner le repo
git clone https://github.com/dev-juvenal/crypto-dashboard.git
cd crypto-dashboard

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'app tourne sur [http://localhost:5173](http://localhost:5173).

---

## 📁 Architecture

```
src/
├── api/           # Appels HTTP vers CoinGecko
│   └── coingecko.ts
├── components/    # Composants React
│   ├── CryptoList.tsx
│   ├── CryptoRow.tsx
│   ├── CryptoDetail.tsx
│   ├── PriceChart.tsx
│   ├── SearchBar.tsx
│   └── ThemeToggle.tsx
├── hooks/         # Hooks personnalisés
│   ├── useDebounce.ts
│   ├── useFavorites.ts
│   └── useTheme.ts
├── types/         # Types TypeScript
│   └── crypto.ts
├── utils/         # Fonctions utilitaires
│   └── format.ts
├── App.tsx
└── main.tsx
```

---

## 🧠 Choix techniques

**Pourquoi React Query ?**
Gestion automatique du cache, du refetch, des retries et des états `loading`/`error`. Évite la réinvention de la roue et protège contre le rate limiting de CoinGecko.

**Pourquoi un debounce sur la recherche ?**
Sans debounce, chaque frappe déclenche un appel API. Avec 300ms de délai, on n'appelle l'API qu'une fois que l'utilisateur a arrêté de taper.

**Pourquoi séparer `api/`, `components/`, `hooks/`, `types/`, `utils/` ?**
Chaque dossier a une responsabilité unique. Les appels HTTP ne se mélangent pas avec les composants UI, les types sont centralisés, etc.

**Pourquoi localStorage pour les favoris et le thème ?**
Pas besoin de backend pour un projet perso. `localStorage` offre une persistance gratuite, instantanée, et sans compte utilisateur.

---

## 📝 License

MIT