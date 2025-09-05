import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import LanguageToggle from '../../components/ui/LanguageToggle';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import QuestionEditor from '../../components/ui/QuestionEditor';

const QuestionnaireEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State for the question editor modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const isNew = id === 'new';

  const fetchQuestionnaire = async () => {
    if (isNew) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/questionnaires/${id}`);
      setTitle(data.title);
      setDescription(data.description);
      setQuestions(data.questions);
    } catch (err) {
      setError('Failed to fetch questionnaire data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    fetchQuestionnaire();
  }, [id, isNew]);

  const handleSave = async () => {
    setIsLoading(true);
    const payload = { title, description };
    try {
      if (isNew) {
        const { data } = await axios.post('/api/questionnaires', payload);
        navigate(`/questionnaire-editor/${data._id}`);
      } else {
        await axios.put(`/api/questionnaires/${id}`, payload);
        alert('Questionnaire saved successfully!');
      }
    } catch (err) {
      setError('Failed to save questionnaire.');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (question = null) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = async (questionData) => {
    try {
      if (editingQuestion) {
        // Update existing question
        await axios.put(`/api/questionnaires/${id}/questions/${editingQuestion._id}`, questionData);
      } else {
        // Create new question
        await axios.post(`/api/questionnaires/${id}/questions`, questionData);
      }
      closeModal();
      fetchQuestionnaire(); // Refresh the list of questions
    } catch (err) {
      setError('Failed to save question.');
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm(currentLanguage === 'fa' ? 'آیا از حذف این سوال مطمئن هستید؟' : 'Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`/api/questionnaires/${id}/questions/${questionId}`);
        fetchQuestionnaire(); // Refresh the list of questions
      } catch (err) {
        setError('Failed to delete question.');
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
              <div>
                <h1 className="text-3xl font-bold text-foreground font-heading">
                  {isNew ? (currentLanguage === 'fa' ? 'ایجاد پرسشنامه جدید' : 'Create New Questionnaire') : (currentLanguage === 'fa' ? 'ویرایش پرسشنامه' : 'Edit Questionnaire')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {currentLanguage === 'fa' ? 'جزئیات پرسشنامه و سوالات آن را مدیریت کنید' : 'Manage the details and questions of the questionnaire'}
                </p>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => navigate('/questionnaire-management')}>
                  {currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={isLoading} iconName="Save" iconPosition="left">
                  {isLoading ? (currentLanguage === 'fa' ? 'در حال ذخیره...' : 'Saving...') : (currentLanguage === 'fa' ? 'ذخیره تغییرات' : 'Save Changes')}
                </Button>
              </div>
            </div>

            {error && <p className="text-destructive mb-4">{error}</p>}

            <div className="card-clinical p-6 mb-8">
              <div className="space-y-4">
                <Input label={currentLanguage === 'fa' ? 'عنوان پرسشنامه' : 'Questionnaire Title'} value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input label={currentLanguage === 'fa' ? 'توضیحات (اختیاری)' : 'Description (Optional)'} value={description} onChange={(e) => setDescription(e.target.value)} type="textarea" />
              </div>
            </div>

            <div className="card-clinical p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">{currentLanguage === 'fa' ? 'سوالات' : 'Questions'}</h2>
                <Button onClick={() => openModal()} variant="outline" iconName="Plus" iconPosition="left" disabled={isNew}>
                  {currentLanguage === 'fa' ? 'افزودن سوال' : 'Add Question'}
                </Button>
              </div>

              {isNew ? (
                 <p className="text-muted-foreground text-center py-8">{currentLanguage === 'fa' ? 'ابتدا پرسشنامه را ذخیره کنید تا بتوانید سوالات را اضافه کنید.' : 'Save the questionnaire first to be able to add questions.'}</p>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q._id} className="border border-border rounded-lg p-4 flex items-center justify-between">
                      <span>{index + 1}. {q.text}</span>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button variant="ghost" size="icon" onClick={() => openModal(q)}>
                          <Icon name="FilePen" size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteQuestion(q._id)}>
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && <p className="text-muted-foreground text-center py-8">{currentLanguage === 'fa' ? 'هنوز سوالی اضافه نشده است.' : 'No questions have been added yet.'}</p>}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <QuestionEditor
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveQuestion}
        question={editingQuestion}
        questionnaireId={id}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default QuestionnaireEditor;
