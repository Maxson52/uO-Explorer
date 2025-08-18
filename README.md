# uOttawa Explorer

## Overview

Explore the University of Ottawa's campus, see the event schedule, and scan QR codes placed in certain buildings for a change to win the lucky draw.

## Stack

- SvelteKit (in SPA mode)
- Pocketbase
- Tailwind (with DaisyUI for login components)
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

## Deploy Suggestions

The frontend SvelteKit application in SPA mode can be hosted virtually anywhere, as it is fully static. Pocketbase can be hosted either on a VPS or one of the hosting providerse such as [Pockethost](https://pockethost.io/). By building the SvelteKit project with `npm run build` and placing the build in the `/pocketbase/pb_public` directory, Pocketbase will automatically serve the frontend as well.
