import sys
import json
import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency
import matplotlib.pyplot as plt
import os
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors

def generate_statistical_report(df, output_format, output_path):
    # --- Analysis Logic (similar to analyze.py) ---
    numerical_cols = df.select_dtypes(include=np.number).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()

    # --- Generate Report ---
    if output_format == 'csv':
        df.describe().to_csv(output_path)
    elif output_format == 'xlsx':
        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            df.describe().to_excel(writer, sheet_name='Descriptive Stats')
            if len(numerical_cols) > 1:
                df[numerical_cols].corr().to_excel(writer, sheet_name='Correlations')
    elif output_format == 'pdf':
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        story.append(Paragraph("Statistical Analysis Report", styles['h1']))

        # Descriptive Stats
        story.append(Paragraph("Descriptive Statistics", styles['h2']))
        desc_df = df[numerical_cols].describe().round(2).reset_index()
        table_data = [desc_df.columns.tolist()] + desc_df.values.tolist()
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.grey),
            ('TEXTCOLOR',(0,0),(-1,0),colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.beige),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        story.append(table)
        story.append(Spacer(1, 12))

        # Charts
        story.append(Paragraph("Data Visualizations", styles['h2']))
        for col in numerical_cols:
            plt.figure(figsize=(6, 4))
            df[col].hist()
            plt.title(f'Histogram of {col}')
            chart_path = os.path.join('server/uploads', f'temp_hist_{col}.png')
            plt.savefig(chart_path)
            plt.close()
            story.append(Image(chart_path, width=400, height=260))
            story.append(Spacer(1, 12))

        doc.build(story)
    else:
        raise ValueError("Unsupported output format.")

def main(file_path, report_type, output_format):
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Data file not found at {file_path}")

        df = pd.read_csv(file_path)

        # Define output path
        output_dir = 'server/uploads'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        output_filename = f"{report_type}_{timestamp}.{output_format}"
        output_path = os.path.join(output_dir, output_filename)

        if report_type == 'statistical_analysis':
            generate_statistical_report(df, output_format, output_path)
        else:
            raise NotImplementedError(f"Report type '{report_type}' is not implemented.")

        print(json.dumps({"status": "success", "filePath": output_path}))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == '__main__':
    if len(sys.argv) > 3:
        file_path = sys.argv[1]
        report_type = sys.argv[2]
        output_format = sys.argv[3]
        main(file_path, report_type, output_format)
    else:
        print(json.dumps({"status": "error", "message": "Insufficient arguments."}))
