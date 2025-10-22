# Task 3: Activity Classification with Machine Learning

Comprehensive machine learning pipeline for human activity recognition using sensor data with Leave-One-Subject-Out (LOSO) cross-validation.

## Overview

This task implements and compares multiple classification algorithms to recognize human activities (walking, sitting, standing, running) from motion sensor data. The analysis uses real-world data from the professor's dataset (`project_css25.pkl`).

## Objectives

1. **Load and prepare** sensor data from EdgeML dataset (pkl format)
2. **Implement LOSO Cross-Validation** to test generalization to unseen subjects
3. **Train and compare 9 classifiers** including KNN, SVM, Decision Trees, Random Forest, MLP, etc.
4. **Compare LOSO vs 10-Fold CV** to understand validation strategy differences
5. **Feature selection**: Manual selection, PCA, and Recursive Feature Elimination (RFE)

## Dataset

- **Source**: `project_css25.pkl` (professor's EdgeML dataset)
- **Samples**: 144 labeled activity segments
- **Subjects**: 8 different users/devices
- **Activities**: 4 classes (walking, sitting, standing, running)
- **Features**: 74 statistical features (mean, std, min, max) from sensors
- **Sensors**: Accelerometer, gyroscope, orientation (alpha, beta, gamma)

## Quick Start

### Prerequisites

```bash
cd task3
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Run Analysis

Open and execute `classification_clean.ipynb` in Jupyter:

```bash
jupyter notebook classification_clean.ipynb
```

## Key Results

### Best Classifier (LOSO CV)
- **Random Forest**: F1-Score = 0.518, Accuracy = 62.9%
- **Decision Tree**: F1-Score = 0.463, Accuracy = 57.7%
- **MLP**: F1-Score = 0.451, Accuracy = 52.1%

### LOSO vs 10-Fold CV
With proper dataset size, 10-Fold CV outperforms LOSO:
- **Random Forest**: 10-Fold F1 = 0.748 (+44% improvement)
- **Decision Tree**: 10-Fold F1 = 0.720 (+56% improvement)
- **MLP**: 10-Fold F1 = 0.602 (+33% improvement)

### Feature Selection
All three methods achieved comparable results:
- **Manual Selection**: Based on motion-related features
- **PCA**: 95% variance retained with dimensionality reduction
- **RFE**: Selected most discriminative features using Linear SVM

## Files

```
task3/
├── classification_clean.ipynb    # Main analysis notebook (clean version)
├── classification.ipynb          # Development notebook (with experiments)
├── project_css25.pkl            # Dataset Prof. Riedel (EdgeML format)
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## Dependencies

- **Python**: 3.10+
- **scikit-learn**: ML algorithms and cross-validation
- **pandas**: Data manipulation
- **numpy**: Numerical operations
- **matplotlib/seaborn**: Visualization
- **edge-ml**: EdgeML dataset loading (pkl format)

## Notes

### Why LOSO vs K-Fold?

- **LOSO (Leave-One-Subject-Out)**: 
  - Stricter evaluation
  - Tests generalization to completely unseen subjects
  - More realistic for real-world deployment
  - Lower performance (less training data)

- **10-Fold CV**:
  - Standard cross-validation
  - Mixes data from all subjects in training
  - Higher performance (more training data)
  - May overestimate real-world performance

### Dataset Comparison

| Metric | Synthetic Data (30 samples) | Real Data (144 samples) |
|--------|----------------------------|-------------------------|
| Best LOSO F1 | 0.281 (Linear SVM) | 0.518 (Random Forest) |
| 10-Fold better? | No (worse) | Yes (+44%) |
| Result | Abnormal behavior | Expected behavior |

## Learning Outcomes

1. Implemented LOSO cross-validation for subject-independent evaluation
2. Trained and compared 9 different classifiers
3. Understood trade-offs between LOSO and K-Fold CV
4. Applied multiple feature selection strategies (Manual, PCA, RFE)
5. Worked with real-world EdgeML sensor data
6. Analyzed impact of dataset size on CV performance

## References

- [scikit-learn LeaveOneGroupOut](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.LeaveOneGroupOut.html)
- [Classifier Comparison](https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html)
- [Recursive Feature Elimination](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.RFE.html)
- [EdgeML Platform](https://edge-ml.org/)
