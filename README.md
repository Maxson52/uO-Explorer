# uOttawa Explorer

> ### Redécouvrez l’Université d’Ottawa! Profitez d’une visite interactive du campus riche en démonstrations, en surprises et en plaisir. // Rediscover uOttawa! Join our interactive campus tour with fun stops, demos, and surprises for everyone.

## Stack

- SvelteKit (in SPA mode)
- Pocketbase
- Tailwind (with DaisyUI v4 for login components)
- Zod (form validation)
- Svelte-i18n (localization)

## Dev Setup

### 1. Clone the Project:

Create a `.env` file with the Pocketbase URL

```
PUBLIC_POCKETBASE_HOST=http://<your-device-ip>:8090
```

### 2. Install Dependencies:

```
npm install
```

### 3. Run Pocketbase:

```
npm run db
```

### 4. Run the SPA:

```
npm run dev
```

> The Pocketbase folder contains the Windows .exe files, for Linux or MacOS setup, consult the [Pocketbase docs](https://pocketbase.io/docs/)

## Deploy Suggestions

The frontend SvelteKit application in SPA mode can be hosted virtually anywhere, since it is fully static. Pocketbase can be hosted either on a VPS or one of the hosting providers such as [Pockethost](https://pockethost.io/). By building the SvelteKit project with `npm run build` and placing the build in the `/pocketbase/pb_public` directory, Pocketbase will automatically serve the frontend as well.
As of 2025-08-20, we are using a GitHub action to build the frontend into the `/pocketbase/pb_public` directory and deploying to the Makerepo VPS using the Pocketbase docker image.
We also rely on [openrouteservice](https://openrouteservice.org/) that we are hosting on the VPS in a Docker container.
