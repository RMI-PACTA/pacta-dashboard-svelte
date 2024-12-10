# pacta-dashboard-svelte
[![ci](https://github.com/RMI-PACTA/pacta-dashboard-svelte/actions/workflows/ci.yml/badge.svg)](https://github.com/RMI-PACTA/pacta-dashboard-svelte/actions/workflows/ci.yml)
[![docker build](https://github.com/RMI-PACTA/pacta-dashboard-svelte/actions/workflows/docker.yml/badge.svg)](https://github.com/RMI-PACTA/pacta-dashboard-svelte/actions/workflows/docker.yml)
[![version](https://img.shields.io/github/package-json/v/rmi-pacta/pacta-dashboard-svelte)](https://github.com/RMI-PACTA/pacta-dashboard-svelte)
[![license](https://img.shields.io/github/license/rmi-pacta/pacta-dashboard-svelte)](https://github.com/RMI-PACTA/pacta-dashboard-svelte/blob/main/LICENSE)

This is a demonstration of a dashboard for the Pacta project using Svelte, SvelteKit, Vite, TypeScript, Tailwind and Skeleton UI.

## Developing

You will need to have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

First, install the dependencies:

```bash
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

### Development

To create a local development version of the dashboard:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Production

Production builds of the dashboard are built using a docker container (defined with `Dockerfile`).
This container executes a script to run `npm run build`, and then copy the rendered files from the default build directory to `/mnt/build_artifacts/` in the container.

The simplest way to use this is with `docker-compose up --build`, which will run the build container as an init container.
Once that has completed sucessfully, a `nginx` container (with the rendered files bind-mounted to the correct location) will start, and the prepared dashboard will be visible at `localhost:3000`.
