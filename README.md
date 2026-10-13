# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```
See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/rules) for the full list of rules and categories.

## API configuration

Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the API origin and base path. The default `/api` expects the frontend host or a development proxy to forward API requests to the backend.

The users screen expects these endpoints:

- `GET /users` returns a `StaffUser[]` or `{ "data": StaffUser[] }`.
- `POST /users` accepts first/middle/last name, role and branch labels, phone number, email, and password; it returns the created `StaffUser` or `{ "data": StaffUser }`.
- `PATCH /users/{email}/status` accepts `{ "status": "Active" | "Suspended" }` and returns the updated `StaffUser` or `{ "data": StaffUser }`.

Each `StaffUser` response contains `name`, `email`, `role`, `branch`, and `status`. Endpoint paths are centralized in `src/services/api/endpoints.ts`; feature-specific request functions live in `src/features/users/users.api.ts`, and shared HTTP behavior lives in `src/services/api/client.ts`. The API must allow credentialed requests from the frontend origin when using cookie-based authentication.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
