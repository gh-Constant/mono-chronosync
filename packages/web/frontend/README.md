# ChronoSync Frontend

The frontend application for ChronoSync, built with Vue 3, TypeScript, and Tailwind CSS.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Features

### User Settings

The application includes a comprehensive settings page with the following sections:

- **Account Settings**: Manage profile information, change password, and delete account
- **Appearance Settings**: Customize theme (light/dark/system) and UI preferences
- **Privacy & Security Settings**: Manage cookie preferences, data export, and security options
- **Notification Settings**: Configure email and in-app notification preferences
- **Application Settings**: Set language, timezone, date formats, and default views

To access the settings page, navigate to `/dashboard/settings` or click on the Settings option in the sidebar.
