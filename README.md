# DReact : Do It Yourself React

Version minimale d'une ébauche de React répliquée pour comprendre les principes :
- Fiber
- Unit of work
- Hooks

## Installation

Le dossier `lib/dreact` contient les sources de la librairie. Les fonctions ont été placées dans des fichiers reprenant l'arborescence de fichiers de React afin de se retrouver plus tard dans le code source de React.

```bash
# pour compiler la librairie en mode watch
cd lib/dreact
pnpm i
pnpm run dev

# à la racine du projet pour lancer un serveur de dev vite
pnpm i
pnpm run dev
```

## Compiler les sources de React

le dossier `lib/react-18.2.0` contiendra les sources de React utiles pour compiler une version de prod non-minifiée :

```bash
cd lib/react-18.2.0

node ./scripts/rollup/build.js \
  react/index,react-dom/index,react/jsx-runtime,scheduler \
  --type=NODE_DEV,NODE_PROD,UMD_DEV,UMD_PROD \
  --pretty=true
```