# pacta-dashboard-svelte

This is a demonstration of a dashboard for the Pacta project using Svelte, SvelteKit, Vite, TypeScript, Tailwind and Skeleton UI.

## Developing

You will need to have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

First, install the dependencies:
``` bash
npm install # or pnpm install or yarn
```

Then start a development server: 

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

This project uses Vite, which is a build tool that aims to provide a faster and leaner development experience for modern web projects. It's configured in `vite.config.js`.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
