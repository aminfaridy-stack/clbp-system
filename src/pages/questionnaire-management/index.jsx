import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import LanguageToggle from '../../components/ui/LanguageToggle';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

const QuestionnaireManagement = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Language setup
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    const fetchQuestionnaires = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/questionnaires');
        setQuestionnaires(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch questionnaires. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  const handleCreateNew = () => {
    // Navigate to an editor page, assuming 'new' is the ID for a new questionnaire
    navigate('/questionnaire-editor/new');
  };

  const handleEdit = (id) => {
    navigate(`/questionnaire-editor/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm(currentLanguage === 'fa' ? 'آیا از حذف این پرسشنامه مطمئن هستید؟' : 'Are you sure you want to delete this questionnaire?')) {
      try {
        await axios.delete(`/api/questionnaires/${id}`);
        setQuestionnaires(questionnaires.filter(q => q._id !== id));
      } catch (err) {
        setError('Failed to delete questionnaire.');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16 rtl:mr-16 rtl:ml-0' : 'ml-64 rtl:mr-64 rtl:ml-0'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                 <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="ClipboardList" size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground font-heading">
                    {currentLanguage === 'fa' ? 'مدیریت پرسشنامه‌ها' : 'Questionnaire Management'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {currentLanguage === 'fa' ? 'ایجاد، ویرایش و مدیریت پرسشنامه‌های ارزیابی' : 'Create, edit, and manage assessment questionnaires'}
                  </p>
                </div>
              </div>
              <Button onClick={handleCreateNew} iconName="Plus" iconPosition="left">
                {currentLanguage === 'fa' ? 'ایجاد پرسشنامه جدید' : 'Create New Questionnaire'}
              </Button>
            </div>

            {/* Content */}
            <div className="card-clinical">
              {isLoading && <p>{currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</p>}
              {error && <p className="text-destructive">{error}</p>}
              {!isLoading && !error && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-4">{currentLanguage === 'fa' ? 'عنوان' : 'Title'}</th>
                        <th className="p-4">{currentLanguage === 'fa' ? 'توضیحات' : 'Description'}</th>
                        <th className="p-4">{currentLanguage === 'fa' ? 'تعداد سوالات' : 'Questions'}</th>
                        <th className="p-4">{currentLanguage === 'fa' ? 'عملیات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionnaires.map((q) => (
                        <tr key={q._id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                          <td className="p-4 font-medium">{q.title}</td>
                          <td className="p-4 text-muted-foreground">{q.description}</td>
                          <td className="p-4 text-center">{q.questions.length}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Button variant="outline" size="icon" onClick={() => handleEdit(q._id)}>
                                <Icon name="FilePen" size={16} />
                              </Button>
                              <Button variant="destructive" size="icon" onClick={() => handleDelete(q._id)}>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuestionnaireManagement;
