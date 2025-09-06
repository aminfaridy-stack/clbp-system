import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AnalysisManager = ({ currentLanguage }) => {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const formData = new FormData();
    formData.append('datafile', selectedFile);

    setIsUploading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/data/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFilePath(data.filePath);
    } catch (err) {
      setError('File upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!filePath) {
      setError('Please upload a data file first.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResults(null);
    try {
      const { data } = await axios.post('/api/analysis', { filePath });
      if (data.status === 'success') {
        setAnalysisResults(data.results);
      } else {
        setError(data.message || 'Analysis failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async () => {
    if (!filePath) {
      setError('Cannot export without a data file.');
      return;
    }
    setIsExporting(true);
    setError(null);
    try {
      const response = await axios.post('/api/reports/export', {
        filePath,
        reportType: 'statistical_analysis',
        format: exportFormat,
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `statistical_report.${exportFormat}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError('Failed to export report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-foreground mb-4">
        {currentLanguage === 'fa' ? 'تحلیل آماری داده‌ها' : 'Statistical Data Analysis'}
      </h3>
      <div className="border border-border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {currentLanguage === 'fa' ? '1. بارگذاری فایل داده (CSV)' : '1. Upload Data File (CSV)'}
          </label>
          <Input type="file" accept=".csv" onChange={handleFileChange} disabled={isUploading} />
          {isUploading && <p className="text-sm text-muted-foreground mt-1">{currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Uploading...'}</p>}
          {filePath && !isUploading && <p className="text-sm text-green-500 mt-1">{currentLanguage === 'fa' ? 'فایل با موفقیت بارگذاری شد.' : 'File uploaded successfully.'}</p>}
        </div>
        <div>
          <Button onClick={handleAnalyze} disabled={!filePath || isAnalyzing} loading={isAnalyzing}>
            {currentLanguage === 'fa' ? '2. اجرای تحلیل' : '2. Run Analysis'}
          </Button>
        </div>
        {error && <p className="text-destructive mt-4">{error}</p>}
      </div>

      {analysisResults && (
        <div className="mt-8 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-foreground">
              {currentLanguage === 'fa' ? 'نتایج تحلیل' : 'Analysis Results'}
            </h4>
            <div className="flex items-center gap-2">
              <Select
                options={[
                  { value: 'pdf', label: 'PDF' },
                  { value: 'xlsx', label: 'Excel (XLSX)' },
                  { value: 'csv', label: 'CSV' },
                ]}
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <Button onClick={handleExport} loading={isExporting} disabled={!analysisResults}>
                {currentLanguage === 'fa' ? 'خروجی گرفتن' : 'Export'}
              </Button>
            </div>
          </div>
          <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(analysisResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AnalysisManager;
