---
name: 🤖 Model Update
about: Report new model training results or request model deployment
title: "[MODEL] "
labels: model-update
assignees: ""
---

## 🤖 Model Update Summary

<!-- Brief description of what changed in the model -->

---

## 📊 New Model Details

| Field | Value |
|-------|-------|
| Model Name | <!-- e.g. polyguard_graphcodebert_v3 --> |
| Base Architecture | <!-- e.g. GraphCodeBERT, CodeBERT --> |
| Number of Classes | <!-- e.g. 4 (Safe/Low/Medium/High) --> |
| Training Dataset | <!-- e.g. 126,112 rows --> |
| Training Time | <!-- e.g. 2.5 hours --> |
| Drive Path | <!-- e.g. /PolyGuard/03-models/model_name --> |
| Trained By | <!-- team member name --> |
| Training Date | <!-- DD/MM/YYYY --> |

---

## 📈 Performance Metrics

### Validation Results

| Metric | Value |
|--------|-------|
| Accuracy | <!-- e.g. 93.9% --> |
| F1 Weighted | <!-- e.g. 93.9% --> |
| F1 Macro | <!-- e.g. 91.1% --> |
| Eval Loss | <!-- e.g. 0.305 --> |

### Per-Class Results

| Class | Precision | Recall | F1 Score | Support |
|-------|-----------|--------|----------|---------|
| Safe (0) | | | | |
| Low (1) | | | | |
| Medium (2) | | | | |
| High (3) | | | | |

### Training Settings

```
Learning Rate:        
Epochs:               
Batch Size:           
Max Length:           
Oversampling:         
Class Weights:        
Early Stopping:       
```

---

## 🔁 Comparison with Previous Model

| Model | Accuracy | F1 Macro | Medium F1 | High F1 |
|-------|----------|----------|-----------|---------|
| Previous | | | | |
| **New** | | | | |

---

## 🧪 Test Case Results

<!-- Paste output from test case evaluation -->

```
Overall Accuracy : xx%
Safe             : xx%  (xx/xx)
Medium           : xx%  (xx/xx)
High             : xx%  (xx/xx)
```

**Failed Cases:**
```
List any test cases that failed
```

---

## 🚀 Deployment Request

- [ ] Deploy to HuggingFace Spaces
- [ ] Update app.py scoring formula
- [ ] Update website Model Status page
- [ ] Update website StatsBar metrics
- [ ] Keep as backup only — do not deploy

**Deployment Notes:**
<!-- Any special instructions for deployment -->

---

## 🔧 app.py Changes Needed

<!-- If the scoring formula needs updating -->

- [ ] No changes needed — same formula works
- [ ] Update label mapping
- [ ] Update scoring formula
- [ ] Update risk level mapping

**New Scoring Formula (if changed):**
```python
SCORE_MAP = {0: 10.0, 1: 7.0, 2: 5.0, 3: 2.0}
RISK_MAP  = {0: "low", 1: "low", 2: "medium", 3: "high"}
```

---

## 📝 Training Notes

<!-- Any important observations from training -->

- Epoch behavior:
- Overfitting observed:
- Early stopping triggered:
- Issues encountered:

---

