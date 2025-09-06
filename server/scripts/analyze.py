import sys
import json
import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency
import matplotlib.pyplot as plt
import os

def analyze_data(file_path):
    try:
        # --- 1. Load Data ---
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Data file not found at {file_path}")
        df = pd.read_csv(file_path)

        results = {
            'descriptive_stats': {},
            'correlations': {},
            'chi_square': [],
            'frequencies': {},
            'charts': {}
        }

        upload_dir = 'server/uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # --- 2. Analyze Data ---
        numerical_cols = df.select_dtypes(include=np.number).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()

        # Descriptive Statistics
        if numerical_cols:
            results['descriptive_stats'] = df[numerical_cols].describe().to_dict()

        # Correlation Matrix
        if len(numerical_cols) > 1:
            results['correlations'] = df[numerical_cols].corr().to_dict()

        # Frequencies for Categorical Data
        for col in categorical_cols:
            freq = df[col].value_counts()
            percent = df[col].value_counts(normalize=True) * 100
            results['frequencies'][col] = pd.concat([freq, percent], axis=1, keys=['count', 'percentage']).to_dict('index')

        # Chi-square for Categorical Data pairs
        if len(categorical_cols) > 1:
            for i in range(len(categorical_cols)):
                for j in range(i + 1, len(categorical_cols)):
                    col1 = categorical_cols[i]
                    col2 = categorical_cols[j]
                    contingency_table = pd.crosstab(df[col1], df[col2])
                    chi2, p, _, _ = chi2_contingency(contingency_table)
                    results['chi_square'].append({
                        'variables': [col1, col2],
                        'chi2': chi2,
                        'p_value': p
                    })

        # --- 3. Generate Charts ---
        # Histograms for numerical columns
        for col in numerical_cols:
            plt.figure()
            df[col].hist()
            plt.title(f'Histogram of {col}')
            chart_path = os.path.join(upload_dir, f'hist_{col}.png')
            plt.savefig(chart_path)
            plt.close()
            results['charts'][f'hist_{col}'] = chart_path

        # Bar charts for categorical columns
        for col in categorical_cols:
            plt.figure()
            df[col].value_counts().plot(kind='bar')
            plt.title(f'Bar Chart of {col}')
            chart_path = os.path.join(upload_dir, f'bar_{col}.png')
            plt.savefig(chart_path)
            plt.close()
            results['charts'][f'bar_{col}'] = chart_path

        print(json.dumps({"status": "success", "results": results}))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        analyze_data(file_path)
    else:
        print(json.dumps({"status": "error", "message": "No file path provided."}))
