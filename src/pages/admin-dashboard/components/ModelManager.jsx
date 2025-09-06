import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import TrainModelModal from './TrainModelModal';

const ModelManager = ({ currentLanguage }) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/models');
      setModels(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch models.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleModelTrained = () => {
    fetchModels(); // Refetch models after training starts
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">
          {currentLanguage === 'fa' ? 'مدیریت مدل‌های پیش‌بینی' : 'Predictive Model Management'}
        </h3>
        <Button onClick={() => setIsModalOpen(true)} iconName="Plus" iconPosition="left" size="sm">
          {currentLanguage === 'fa' ? 'آموزش مدل جدید' : 'Train New Model'}
        </Button>
      </div>

      {isLoading && <p>{currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</p>}
      {error && <p className="text-destructive">{error}</p>}
      {!isLoading && !error && (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4">{currentLanguage === 'fa' ? 'نام مدل' : 'Model Name'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'نوع' : 'Type'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'وضعیت' : 'Status'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'دقت' : 'Accuracy'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'AUC' : 'AUC'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'عملیات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model._id} className="border-b border-border last:border-b-0">
                  <td className="p-4 font-medium">{model.name}</td>
                  <td className="p-4">{model.modelType}</td>
                  <td className="p-4">{model.status}</td>
                  <td className="p-4">{model.performance ? model.performance.accuracy.toFixed(4) : 'N/A'}</td>
                  <td className="p-4">{model.performance ? model.performance.auc.toFixed(4) : 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                       <Button variant="outline" size="icon">
                        <Icon name="View" size={16} />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <TrainModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onModelTrained={handleModelTrained}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default ModelManager;
