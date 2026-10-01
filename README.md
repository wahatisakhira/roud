# روض واحتي الصغيرة — Rawd Wahati Saghira

Site officiel (arabe, RTL) du روض واحتي الصغيرة, Casablanca.
En ligne : https://roudwahasakhira.lovable.app/

## Technologies
React 19 · TypeScript · TanStack Start / Router · Vite 7 · Tailwind CSS v4 · police Cairo (Google Fonts) · icônes lucide-react.

## Installation
Node.js 20+ requis (ou Bun).
```bash
npm install        # ou: bun install
npm run dev        # développement → http://localhost:8080
npm run build      # build de production (dossier .output / dist)
npm run preview    # tester le build
```

## Structure
```
public/
  favicon.png
  images/            ← toutes les photos et le logo (.webp)
src/
  routes/__root.tsx  ← <html dir="rtl">, titre, police, SEO global
  routes/index.tsx   ← TOUTE la page : menu, hero, à propos, programmes,
                       activités, galerie, espaces, inscription, الشكاية,
                       localisation, footer
  assets/*.asset.json← chaque fichier pointe vers une image de public/images
  styles.css         ← couleurs (variables CSS), police, utilitaires
  components/ui/     ← composants UI réutilisables
vite.config.ts, tsconfig.json, components.json, eslint.config.js
```

## Remplacer une image / le logo
Remplacez le fichier dans `public/images/` en gardant le **même nom**
(ex. `public/images/logo.webp` pour le logo, `hero-child.webp` pour la photo principale).
Pour un nouveau nom, modifiez le champ `"url"` dans le fichier correspondant de `src/assets/`.
Favicon : `public/favicon.png`.

## Modifier les textes
Tous les textes sont dans `src/routes/index.tsx` (cherchez la phrase à changer).
Titre et description Google : `head()` dans `src/routes/index.tsx` et `src/routes/__root.tsx`.
Couleurs : variables `--primary`, `--gold`, `--sky`… dans `src/styles.css`.

## WhatsApp / contact
Cherchez `212603539340` dans `src/routes/index.tsx` et remplacez-le par le nouveau numéro
(format international sans + ni espaces). Téléphone, adresse et carte sont dans le même fichier.
Les formulaires « سجّل الآن » et « الشكاية » vérifient les champs requis puis ouvrent WhatsApp
avec le message pré-rempli ; rien n'est enregistré sur le site.
Pour modifier le formulaire de الشكاية, cherchez `complaint` dans `src/routes/index.tsx`.

## Déploiement
- **Lovable** : bouton Publish.
- **Cloudflare Pages / Workers** (cible par défaut) : `npm run build`, puis `npx wrangler deploy`.
- **GitHub** : `git init && git add . && git commit -m "init" && git remote add origin <url> && git push -u origin main`,
  puis connectez le dépôt à Cloudflare, Netlify ou Vercel (commande de build : `npm run build`).
