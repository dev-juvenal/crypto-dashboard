# 🪙 Crypto Dashboard

Dashboard React qui affiche en temps réel les 20 principales cryptomonnaies via l'API [CoinGecko](https://www.coingecko.com/).

🔗 **Demo live** : [crypto-dashboard-bds87rxvz-dev-juvenal.vercel.app](https://crypto-dashboard-bds87rxvz-dev-juvenal.vercel.app/)

---

## ✨ Fonctionnalités

- 📊 **Liste en temps réel** des 20 top cryptos (prix, variation 24h, logo)
- 🔍 **Recherche instantanée** avec debounce pour économiser les appels API
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
│   └── SearchBar.tsx
├── hooks/         # Hooks personnalisés
│   └── useDebounce.ts
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

---

## 📝 License

MIT