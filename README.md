# روض واحتي الصغيرة — site web statique

Version statique et autonome du site du jardin d'enfants **روض واحتي الصغيرة** (Casablanca).
Elle reprend exactement le design, les textes, les images, le menu, les formulaires et la galerie du site Lovable, sans dépendre de Lovable pour l'affichage.

## Arborescence

```
wahati-static/
├── index.html          Structure complète de la page (arabe, RTL)
├── style.css           Tous les styles (Tailwind CSS compilé + styles du site)
├── script.js           Menu mobile, formulaires WhatsApp, galerie des activités
├── README.md           Ce guide
└── assets/
    └── images/         Logo, photos, favicon
        ├── logo-official.webp   (logo officiel)
        ├── favicon.png
        ├── hero-child.webp
        ├── nursery.webp, preschool.webp, awareness.jpg
        └── space-play.webp, space-classroom.webp, space-rest.webp, space-dining.webp
```

## Tester en local

Double-cliquez sur `index.html` : le site s'ouvre dans le navigateur.
Pour un test plus proche d'un vrai hébergement : `python3 -m http.server 8000` dans le dossier, puis ouvrez http://localhost:8000.

## Modifier le site

- **Textes** : ouvrez `index.html` et changez le texte arabe directement (recherchez la phrase avec Ctrl+F).
- **Couleurs** : dans `style.css`, cherchez `:root {` — variables `--primary` (bleu), `--gold` (doré), `--deep` (bleu foncé), `--mint`, `--rose`, `--lilac`, `--sky`.
- **Images** : remplacez un fichier dans `assets/images/` par une autre image **en gardant le même nom**.
- **Logo** : remplacez `assets/images/logo-official.webp` (et `favicon.png` pour l'icône de l'onglet).
- **Numéro WhatsApp** : en haut de `script.js`, `WHATSAPP_NUMBER`. Les liens WhatsApp de `index.html` contiennent aussi `wa.me/212603539340` : remplacez-les avec Ctrl+H. Le numéro de téléphone affiché (`tel:+212603539340`) est aussi dans `index.html`.

## Publier sur GitHub Pages

1. Créez un dépôt sur https://github.com/new (par exemple `rawd-wahati`).
2. Cliquez sur **Add file → Upload files**, glissez **le contenu** du dossier (index.html, style.css, script.js, README.md et le dossier assets), puis **Commit changes**.
3. Allez dans **Settings → Pages**, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après 1 à 2 minutes, le site est en ligne sur `https://VOTRE-NOM.github.io/rawd-wahati/`.

Le site fonctionne aussi sur Netlify, Cloudflare Pages ou tout hébergement classique (envoyez les fichiers tels quels).

## Services externes

| Fonction | Dépend de | Fonctionne sur GitHub Pages ? |
|---|---|---|
| Police Cairo | Google Fonts (internet) | Oui |
| Formulaires inscription et « الملاحظات », boutons WhatsApp | wa.me (WhatsApp) | Oui |
| Lien « Google Maps » | Google Maps | Oui |
| Photos des activités (« مشاهدة الصور ») | Lovable Cloud (base de données + stockage) | Oui, en lecture |

**Galerie des activités** : les photos sont lues depuis Lovable Cloud avec une clé **publique** (lecture seule, protégée par les règles de sécurité). Aucune clé secrète ni mot de passe n'est dans le code. Tant qu'aucune photo n'est ajoutée, la galerie affiche « ستُضاف صور هذا النشاط قريباً ».

## Limitations de la version statique

- **Page d'administration `/admin` non incluse** : l'ajout, la suppression et l'ordre des photos d'activités nécessitent une connexion et un serveur. Continuez à gérer les photos depuis le site Lovable (https://roudwahasakhira.lovable.app/admin) ; elles apparaîtront automatiquement ici aussi.
- **Aucun formulaire n'est enregistré sur le site** : le formulaire prépare un message et ouvre WhatsApp. La demande n'est envoyée que lorsque le parent appuie sur « envoyer » dans WhatsApp. Le message de remerciement s'affiche avant cet envoi.
- Pour aller plus loin, le code source complet (React/TanStack, `package.json`, instructions `npm install` / `npm run build`) est disponible séparément dans l'archive `rawd-wahati-source.zip`.
