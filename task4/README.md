# Task 4: Hyperparameter Optimization

Bayesian optimization and Optuna-based hyperparameter tuning for Random Forest classifier on sensor-based activity recognition.

## Overview

This task implements and compares different hyperparameter optimization strategies to improve the Random Forest classifier from Task 3. Two main approaches are used: custom Gaussian Process (GP) Bayesian Optimization and Optuna with multiple sampling strategies.

## Objectives

1. **Build custom Bayesian Optimizer** using Gaussian Process and Expected Improvement
2. **Optimize Random Forest hyperparameters** (n_estimators, max_depth, min_samples_split, min_samples_leaf)
3. **Implement Optuna optimization** with three sampling strategies (TPE, CMA-ES, Random)
4. **Compare optimization methods** in terms of performance and efficiency
5. **Dynamic feature extraction** to handle heterogeneous sensor data

## Dataset

- **Source**: `../task3/project_css25.pkl` (EdgeML dataset)
- **Samples**: 135 labeled activity segments
- **Users**: 10 different subjects
- **Activities**: 4 classes (walking, sitting, standing, running)
- **Features**: 28 dynamically extracted features from available sensors
- **Cross-Validation**: 10-Fold Stratified CV (LOSO not feasible due to data imbalance)

## Quick Start

### Prerequisites

```bash
cd task4
pip install -r requirements.txt
```

### Run Optimization

Open and execute `hyperparameter_optimization.ipynb`:

```bash
jupyter notebook hyperparameter_optimization.ipynb
```

## Key Results

### Performance Comparison

| Strategy | Best F1-Score | Time (min) | vs Baseline |
|----------|---------------|------------|-------------|
| Custom GP | 0.7700 | ~15 | +48.6% |
| Optuna TPE | 0.7700 | ~12 | +48.6% |
| Optuna CMA-ES | 0.7650 | ~13 | +47.7% |
| Optuna Random | 0.7550 | ~14 | +45.8% |
| Task 3 Baseline | 0.5180 | - | - |

### Best Hyperparameters

```python
n_estimators: 50
max_depth: 20
min_samples_split: 6
min_samples_leaf: 1
```

### Key Improvements

- **Dynamic Feature Extraction**: 7 → 28 features (+300%)
- **F1-Score**: 0.34 → 0.77 (+124% from initial hardcoded approach)
- **Data Utilization**: 19% → 100% (+427%)
- **Optimization Efficiency**: 30 trials vs 100s for grid search

## Methods

### Part 1: Custom Bayesian Optimization

- **Gaussian Process** with Matérn kernel for surrogate model
- **Expected Improvement** acquisition function
- **30 iterations** (5 random + 25 GP-guided)
- **10-Fold Stratified CV** for evaluation

### Part 2: Optuna Optimization

Three sampling strategies compared:

1. **TPE (Tree-structured Parzen Estimator)**: Bayesian approach, models P(x|y)
2. **CMA-ES (Covariance Matrix Adaptation)**: Evolutionary strategy for continuous spaces
3. **Random Sampler**: Pure random search baseline

## Files

```
task4/
├── hyperparameter_optimization.ipynb    # Main optimization notebook
├── requirements.txt                     # Python dependencies
└── README.md                           # This file
```

## Dependencies

- **Python**: 3.12+
- **scikit-learn**: Random Forest and cross-validation
- **optuna**: Hyperparameter optimization framework
- **pandas/numpy**: Data manipulation
- **matplotlib/seaborn**: Visualization
- **plotly**: Interactive Optuna visualizations
- **scipy**: Optimization and statistics

## Why Dynamic Feature Extraction?

The dataset contains different sensor types across recordings:
- Some have `accX, accY, accZ` (raw accelerometer)
- Others have `acceleration.x` (processed motion)
- Various orientation sensors (`alpha`, `orienAlpha`, etc.)

**Solution**: Automatically detect and extract features from whatever sensors are present → 100% data utilization instead of 19%.

## Why 10-Fold CV Instead of LOSO?

- Some users have only 1 sample → LOSO fails with NaN values
- 10-Fold Stratified CV ensures balanced class distribution
- More stable for small, imbalanced datasets

## Learning Outcomes

1. Implemented Bayesian Optimization from scratch using Gaussian Process
2. Used Expected Improvement acquisition function for exploration-exploitation balance
3. Compared multiple optimization strategies (GP, TPE, CMA-ES, Random)
4. Applied dynamic feature extraction for heterogeneous data
5. Achieved 48.6% improvement over baseline with efficient optimization

## References

- [Optuna Documentation](https://optuna.org/)
- [Gaussian Process Regression](https://scikit-learn.org/stable/modules/gaussian_process.html)
- [Expected Improvement](https://en.wikipedia.org/wiki/Bayesian_optimization)
- [Random Forest](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)
