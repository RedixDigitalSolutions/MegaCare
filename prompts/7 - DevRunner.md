Dev Runner – Single Command Setup

Create a root-level configuration that allows running both the frontend and backend simultaneously with a single terminal command.

* Task Details:

- Create a package.json at the root of the monorepo (if not already present)
- Install concurrently as a dev dependency
- Add a dev script that starts both the frontend (Vite + React) and the backend (the existing server) in parallel
- Running npm run dev from the root should launch both services at once in the same terminal with color-coded output per service
- Ensure both services run on their correct ports without conflicts

Expected result:

- npm run dev
