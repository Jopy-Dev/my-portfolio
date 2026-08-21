# Jopy-Dev Portfolio

Application type: web app.

Personal portfolio for Mark Jommer (`Jopy-Dev`), targeting hiring managers and potential clients. Static frontend deploys through GitHub Pages; protected contact submissions use a separate Cloudflare Worker and Turnstile.

Status: Step 13 complete; pre-Step-14 readiness passed. Local landing parity is available; Wave 0 implementation awaits approval, while production content and services remain blocked until later workflow gates.

## Local Development

Requirements: Node.js 22.22.2 or 24.18.0; npm 10+.

```powershell
npm ci --ignore-scripts
Copy-Item .env.example apps/site/.env.local
npm run dev
```

Open `http://127.0.0.1:3000/`. Placeholder project rows and contact preview are local-review states; they are not production content or a live submission path.

Asset regeneration uses pinned Python packages from `tools/requirements-assets.txt`; approved source files remain local and are intentionally absent from the public repository.

## Asset Tooling

Create an isolated environment without changing system Python packages:

```powershell
python -m venv .venv
& .\.venv\Scripts\python.exe -m pip install --disable-pip-version-check -r tools/requirements-assets.txt
& .\.venv\Scripts\python.exe -m unittest scripts.assets.test_generate_approved_assets
```

## Validation

```powershell
npm run verify
$env:PYTHONUTF8 = '1'
slop lint
gitleaks dir --no-banner --redact --exit-code 1 --config .gitleaks.toml apps
```
