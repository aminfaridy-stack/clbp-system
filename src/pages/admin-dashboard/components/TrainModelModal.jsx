import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TrainModelModal = ({ isOpen, onClose, onModelTrained, currentLanguage }) => {
  const [name, setName] = useState('');
  const [modelType, setModelType] = useState('LogisticRegression');
  const [testSize, setTestSize] = useState(0.2);
  const [filePath, setFilePath] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState(null);

  const modelTypeOptions = [
    { value: 'LogisticRegression', label: 'Logistic Regression' },
    { value: 'DecisionTree', label: 'Decision Tree' },
    { value: 'RandomForest', label: 'Random Forest' },
    { value: 'GradientBoosting', label: 'Gradient Boosting' },
    { value: 'SVM', label: 'SVM' },
  ];

  const testSizeOptions = [
    { value: 0.2, label: '80% Train / 20% Test' },
    { value: 0.3, label: '70% Train / 30% Test' },
    { value: 0.4, label: '60% Train / 40% Test' },
  ];

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('datafile', file);

    setIsUploading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFilePath(data.filePath);
    } catch (err) {
      setError('File upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTrain = async () => {
    if (!filePath) {
      setError('Please upload a data file first.');
      return;
    }
    setIsTraining(true);
    setError(null);
    try {
      const payload = {
        name,
        modelType,
        filePath,
        parameters: {
          testSize: testSize,
        },
      };
      await axios.post('/api/models/train', payload);
      onModelTrained();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start training.');
    } finally {
      setIsTraining(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold font-heading">
            {currentLanguage === 'fa' ? 'آموزش مدل جدید' : 'Train New Model'}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <Input
            label={currentLanguage === 'fa' ? 'نام مدل' : 'Model Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={currentLanguage === 'fa' ? 'مثلا: مدل اولیه لاجستیک' : 'e.g., Initial Logistic Model'}
          />
          <Select
            label={currentLanguage === 'fa' ? 'نوع مدل' : 'Model Type'}
            options={modelTypeOptions}
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
          />
          <Select
            label={currentLanguage === 'fa' ? 'نسبت تقسیم داده' : 'Data Split Ratio'}
            options={testSizeOptions}
            value={testSize}
            onChange={(e) => setTestSize(parseFloat(e.target.value))}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {currentLanguage === 'fa' ? 'فایل داده (CSV)' : 'Data File (CSV)'}
            </label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-muted-foreground mt-1">{currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Uploading...'}</p>}
            {filePath && <p className="text-sm text-green-500 mt-1">{currentLanguage === 'fa' ? 'فایل با موفقیت بارگذاری شد.' : 'File uploaded successfully.'}</p>}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="p-6 border-t border-border flex justify-end space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={onClose} disabled={isTraining}>
            {currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
          </Button>
          <Button onClick={handleTrain} loading={isTraining}>
            {currentLanguage === 'fa' ? 'شروع آموزش' : 'Start Training'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainModelModal;
