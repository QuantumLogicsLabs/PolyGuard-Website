# PolyGuard — Code Security Intelligence

A React web app that interfaces with the PolyGuard ML model to scan code for security vulnerabilities and suggest improvements.

## Getting Started

npm install && npm run dev   →  http://localhost:5173

## API Endpoint

POST https://muhammadsaadamin-polyguard-api.hf.space/analyze
Body: { "code": "string", "language": "python" }

## App Pages

- Home      — landing, links, API schema preview  
- Analyzer  — live code scanner with score ring + findings  
- Architecture — interactive 5-tool system diagram + retrain guide  
- Roadmap   — 4-phase plan to make the model smarter

## Retrain in 5 steps

1. Add data → 01_data_collection.ipynb
2. Retrain → 03_train_model.ipynb (T4 GPU, 20-40 min)
3. Push model → api.upload_folder(..., repo_id="MUHAMMADSAADAMIN/polyguard-model")
4. Restart HF Space → Settings → Restart Space
5. Test → curl POST /analyze
