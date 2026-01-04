# Environment Orchestration

To operate the TechConnect Web Application effectively, you need to understand the different ways it can be run relative to its backend dependencies.

## 1. Standalone Development (MSW)

This is the fastest way to work on the UI. The application uses **Mock Service Worker (MSW)** to intercept network requests and return mock data locally in the browser.

- **Use case**: Feature development, UI/UX changes, testing browser behavior without a backend.
- **How to run**: 
  ```bash
  npm run dev
  ```
- **Configuration**: Ensure `VITE_API_GATEWAY_URL` is set to a dummy value or the default mock endpoint. MSW is automatically enabled in `DEV` mode in `src/main.tsx`.

## 2. Integrated Development (Local Backend)

In this mode, the frontend connects to a real API Gateway running on your local machine.

- **Use case**: Integration testing, end-to-end flow verification, working on cross-service features.
- **Prerequisites**:
  - `TechConnect-API-Gateway` must be running (usually on port 8080).
  - Backend services (Opportunity Service) must be running.
- **How to run**:
  1. Set `.env` variable: `VITE_API_GATEWAY_URL=http://localhost:8080`
  2. Disable MSW in `src/main.tsx` (optional, or rely on environment logic).
  3. `npm run dev`

## 3. Containerized Operation (Docker)

Running the application as it would be in a staging or production-like environment.

- **Use case**: Verifying build artifacts, testing Nginx configuration, local production simulation.
- **How to run**:
  ```bash
  docker compose up -d
  ```
- **What happens**: The app is built, served via Nginx on port `80`, and configured to talk to the gateway specified in the `docker-compose.yml`.

## 4. Testing Environments

- **Unit/Integration**: Run `npm test`. These tests use a separate MSW server configuration in `src/mocks/server.ts`.
- **Coverage**: Run `npm run test:coverage` to see which parts of the application are exercised by tests.

---

See [Deployment](../guides/deployment.md) for more details on production-specific operational concerns.
