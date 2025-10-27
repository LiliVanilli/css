# Context-Sensitive Systems (CSS) - Lab Tasks

Sensor data collection, analysis, and machine learning for human activity recognition.

## Overview

This repository contains four lab tasks focused on sensor-based activity recognition:

1. **Task 1**: Web-based sensor data collection (orientation, accelerometer, gyroscope)
2. **Task 2**: Time series feature extraction with sliding windows
3. **Task 3**: Activity classification with 9 ML algorithms and LOSO cross-validation
4. **Task 4**: Hyperparameter optimization using Bayesian methods and Optuna

## Quick Start

```bash
# Clone the repository
git clone https://github.com/LiliVanilli/css.git
cd css

# Navigate to specific task
cd task1  # or task2, task3, task4
```

## Task Summaries

### Task 1: Sensor Data Collection
- **Goal**: Build web app to collect device sensor data
- **Tech**: HTML5, JavaScript, Device APIs, EdgeML
- **Live Demo**: https://lilivanilli.github.io/css/
- **Features**: Real-time sensor display, CSV export, mobile support

### Task 2: Feature Extraction
- **Goal**: Extract statistical features from time series data
- **Tech**: Python, Jupyter, Pandas, EdgeML API
- **Method**: Sliding windows with mean/variance calculation
- **Output**: Processed features ready for ML

### Task 3: Activity Classification
- **Goal**: Compare ML algorithms for activity recognition
- **Dataset**: 144 samples, 8 subjects, 4 activities
- **Methods**: 9 classifiers with LOSO & 10-Fold CV
- **Best Result**: Random Forest F1=0.518 (LOSO), F1=0.748 (10-Fold)

### Task 4: Hyperparameter Optimization
- **Goal**: Optimize Random Forest with Bayesian methods
- **Methods**: Custom GP, Optuna (TPE, CMA-ES, Random)
- **Features**: Dynamic feature extraction (28 features from heterogeneous sensors)
- **Best Result**: F1=0.77 (+48.6% vs baseline), 30 efficient iterations

## Key Results

| Task | Method | Result | Improvement |
|------|--------|--------|-------------|
| Task 1 | Data Collection | Web app with 3 sensors | - |
| Task 2 | Feature Extraction | Sliding windows + stats | - |
| Task 3 | Random Forest (LOSO) | F1 = 0.518 | Baseline |
| Task 4 | Bayesian Optimization | F1 = 0.770 | +48.6% |

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python 3.10+, Jupyter Notebooks
- **ML Libraries**: scikit-learn, Optuna
- **Data**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn, Plotly
- **Deployment**: GitHub Pages (HTTPS)

## Repository Structure

```
css/
├── task1/                  # Web sensor data collection
│   ├── index.html
│   ├── script.js
│   └── README.md
├── task2/                  # Feature extraction
│   ├── analysis.ipynb
│   └── README.md
├── task3/                  # ML classification
│   ├── classification_clean.ipynb
│   └── README.md
├── task4/                  # Hyperparameter optimization
│   ├── hyperparameter_optimization.ipynb
│   └── README.md
└── README.md              # This file
```

## Installation

Each task has its own dependencies. Navigate to the task folder and follow its README.

**For Python tasks (2, 3, 4):**
```bash
cd task3  # or task2, task4
pip install -r requirements.txt
jupyter notebook
```

**For web task (1):**
```bash
cd task1
npm install
open index.html
```

## Author

LiliVanilli

## License

MIT