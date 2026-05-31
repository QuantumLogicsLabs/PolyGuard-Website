---
name: 📊 Dataset Update
about: Report dataset changes, cleaning, or balancing updates
title: "[DATASET] "
labels: dataset
assignees: ""
---

## 📊 Dataset Update Summary

<!-- Brief description of what changed in the dataset -->

---

## 📁 Dataset Details

| Field | Value |
|-------|-------|
| Dataset Name | <!-- e.g. polyguard_multiclass_balanced.csv --> |
| Drive Path | <!-- e.g. /PolyGuard/02(b)_final_clean-dataset/ --> |
| File Size | <!-- e.g. 78.4 MB --> |
| Total Rows | <!-- e.g. 126,112 --> |
| Updated By | <!-- team member name --> |
| Date | <!-- DD/MM/YYYY --> |

---

## 🏷️ Label Distribution

### Before Update

| Class | Label | Count | Percentage |
|-------|-------|-------|------------|
| Safe | 0 | | |
| Low | 1 | | |
| Medium | 2 | | |
| High | 3 | | |
| **Total** | | | 100% |

### After Update

| Class | Label | Count | Percentage |
|-------|-------|-------|------------|
| Safe | 0 | | |
| Low | 1 | | |
| Medium | 2 | | |
| High | 3 | | |
| **Total** | | | 100% |

**Balance Ratio:** <!-- e.g. 1.00 = perfect, 0.01 = severely imbalanced -->

---

## 🔧 Changes Made

<!-- Check all that apply -->

- [ ] Added new data sources
- [ ] Removed duplicates
- [ ] Fixed label errors
- [ ] Applied oversampling (training only)
- [ ] Applied undersampling
- [ ] Added Medium class data
- [ ] Added Safe class data
- [ ] Fixed CWE mappings
- [ ] Changed label column
- [ ] Other: <!-- specify -->

---

## 📂 Data Sources

<!-- List all data sources used -->

| Source | Rows Added | Label | Notes |
|--------|-----------|-------|-------|
| cross_vul_clean.csv | | | |
| bigvul_raw.csv | | | |
| cvefixes_raw.csv | | | |
| devign_raw.csv | | | |
| reveal_raw.csv | | | |
| juliet_dataset | | | |
| Other | | | |

---

## 🛠️ Processing Applied

```
Duplicates removed    : 
Nulls removed         : 
Min code length       : 
Max code length       : 
Oversampling target   : 
Undersampling target  : 
```

---

## ⚠️ Known Issues

<!-- Any known problems with this dataset -->

- [ ] Medium class still underrepresented
- [ ] Some classes oversampled (copies exist)
- [ ] Language imbalance
- [ ] No known issues

**Details:**
<!-- Describe any known issues -->

---

## ✅ Ready for Training?

- [ ] Yes — dataset is ready for training
- [ ] No — still needs work (describe below)
- [ ] Needs review from team captain first

**Notes:**
<!-- Any additional notes for the training team -->

---

**Submitted by:** <!-- your name -->
**Date:** <!-- DD/MM/YYYY -->
**Team:** TeamGamma — QuantumLogicsLabs
