# Documentation API

## Déploiement

Pour lancer le back-end, telechargez les dépendances nécessaire au fonctionnement. Verifier bien que vous êtes dans le dossier "**/Back**" avant de lancer la commande :

```bash
  npm install
```

Creer un fichier .env a la racine de **/Back** ou vous devrez ajouter :

```
DB_URI= lien mongoDb
JWT_SECRET= JWT JWT_SECRET
EMAIL= EMAIL OUTLOOK
EMAIL_PASSWORD= PASSWORD OUTLOOK

```

Vous pouvez ensuite lancer le back en executant cette commande :

```bash
npm run dev
```

Votre Back-end est disponible normalement à l'adresse suivante :

[http://localhost:3000]()

## API Réferences

## User

#### Get all users

Recuperer toutes les informations des utilisateurs

```http
  GET /user/
```

#### Get all usernames

Recuperer seulement les usernames de chaque utilisateus

```http
  GET /user/username
```

#### add(num1, num2)

Takes two numbers and returns the sum.
