import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import QuestionEditor from '../../../components/ui/QuestionEditor';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// This new component combines the List and Editor views
const QuestionnaireManager = ({ currentLanguage }) => {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [currentQuestionnaireId, setCurrentQuestionnaireId] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchQuestionnaires = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/questionnaires');
      setQuestionnaires(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch questionnaires.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const handleCreateNew = () => {
    setCurrentQuestionnaireId(null);
    setView('editor');
  };

  const handleEdit = (id) => {
    setCurrentQuestionnaireId(id);
    setView('editor');
  };

  const openDeleteConfirm = (id) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`/api/questionnaires/${itemToDelete}`);
      fetchQuestionnaires();
    } catch (err) {
      setError('Failed to delete questionnaire.');
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleBackToList = () => {
    setView('list');
    setCurrentQuestionnaireId(null);
    fetchQuestionnaires();
  };

  if (view === 'editor') {
    return (
      <QuestionnaireEditorView
        id={currentQuestionnaireId}
        onBack={handleBackToList}
        currentLanguage={currentLanguage}
      />
    );
  }

  return (
    <div className="mt-8">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">
          {currentLanguage === 'fa' ? 'مدیریت پرسشنامه‌ها' : 'Questionnaire Management'}
        </h3>
        <Button onClick={handleCreateNew} iconName="Plus" iconPosition="left" size="sm">
          {currentLanguage === 'fa' ? 'ایجاد پرسشنامه جدید' : 'Create New Questionnaire'}
        </Button>
      </div>

      {isLoading && <p>{currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</p>}
      {error && <p className="text-destructive">{error}</p>}
      {!isLoading && !error && (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4">{currentLanguage === 'fa' ? 'عنوان' : 'Title'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'تعداد سوالات' : 'Questions'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'عملیات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {questionnaires.map((q) => (
                <tr key={q._id} className="border-b border-border last:border-b-0">
                  <td className="p-4 font-medium">{q.title}</td>
                  <td className="p-4 text-center">{q.questions.length}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(q._id)}>
                        <Icon name="FilePen" size={16} />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => openDeleteConfirm(q._id)}>
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
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={currentLanguage === 'fa' ? 'حذف پرسشنامه' : 'Delete Questionnaire'}
        body={currentLanguage === 'fa' ? 'آیا از حذف این پرسشنامه و تمام سوالات آن مطمئن هستید؟ این عمل قابل بازگشت نیست.' : 'Are you sure you want to delete this questionnaire and all its questions? This action cannot be undone.'}
        confirmText={currentLanguage === 'fa' ? 'حذف کن' : 'Delete'}
        cancelText={currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
      />
    </div>
  );
};


// This is the refactored Editor view, now as a sub-component
const QuestionnaireEditorView = ({ id, onBack, currentLanguage }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const isNew = id === null;

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaire();
  }, [id, isNew]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = { title, description };
    try {
      if (isNew) {
        await axios.post('/api/questionnaires', payload);
        onBack();
      } else {
        await axios.put(`/api/questionnaires/${id}`, payload);
        showSuccess(currentLanguage === 'fa' ? 'پرسشنامه با موفقیت ذخیره شد!' : 'Questionnaire saved successfully!');
      }
    } catch (err) {
      setError('Failed to save questionnaire.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuestion = async (questionData) => {
    try {
      if (editingQuestion) {
        await axios.put(`/api/questionnaires/${id}/questions/${editingQuestion._id}`, questionData);
      } else {
        await axios.post(`/api/questionnaires/${id}/questions`, questionData);
      }
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      fetchQuestionnaire();
      showSuccess(currentLanguage === 'fa' ? 'سوال ذخیره شد.' : 'Question saved.');
    } catch (err) {
      alert('Failed to save question.');
    }
  };

  const openDeleteConfirm = (questionId) => {
    setItemToDelete(questionId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteQuestionConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`/api/questionnaires/${id}/questions/${itemToDelete}`);
      fetchQuestionnaire();
    } catch (err) {
      alert('Failed to delete question.');
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div>
      <Button onClick={onBack} variant="ghost" iconName="ArrowLeft" iconPosition="left" className="mb-4">
        {currentLanguage === 'fa' ? 'بازگشت به لیست' : 'Back to List'}
      </Button>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">
              {isNew ? 'Create New Questionnaire' : 'Edit Questionnaire'}
            </h3>
            <div className="flex items-center gap-2">
              {successMessage && <span className="text-sm text-success animate-fade-in">{successMessage}</span>}
              <Button onClick={handleSave} loading={isSaving} iconName="Save" iconPosition="left">
                {currentLanguage === 'fa' ? 'ذخیره' : 'Save'}
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <Input label={currentLanguage === 'fa' ? 'عنوان' : 'Title'} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input label={currentLanguage === 'fa' ? 'توضیحات' : 'Description'} value={description} onChange={(e) => setDescription(e.target.value)} type="textarea" />
          </div>
        </div>

        {!isNew && (
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">{currentLanguage === 'fa' ? 'سوالات' : 'Questions'}</h3>
              <Button onClick={() => { setEditingQuestion(null); setIsQuestionModalOpen(true); }} variant="outline" iconName="Plus" iconPosition="left">
                {currentLanguage === 'fa' ? 'افزودن سوال' : 'Add Question'}
              </Button>
            </div>
            <div className="space-y-2">
              {questions.map((q, index) => (
                <div key={q._id} className="border border-border rounded-md p-3 flex items-center justify-between">
                  <span>{index + 1}. {q.text}</span>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingQuestion(q); setIsQuestionModalOpen(true); }}>
                      <Icon name="FilePen" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteConfirm(q._id)}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              {questions.length === 0 && <p className="text-muted-foreground text-center py-4">{currentLanguage === 'fa' ? 'هنوز سوالی اضافه نشده است.' : 'No questions have been added yet.'}</p>}
            </div>
          </div>
        )}
      </div>

      <QuestionEditor
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        question={editingQuestion}
        currentLanguage={currentLanguage}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteQuestionConfirm}
        title={currentLanguage === 'fa' ? 'حذف سوال' : 'Delete Question'}
        body={currentLanguage === 'fa' ? 'آیا از حذف این سوال مطمئن هستید؟' : 'Are you sure you want to delete this question?'}
        confirmText={currentLanguage === 'fa' ? 'حذف' : 'Delete'}
        cancelText={currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
      />
    </div>
  );
};

export default QuestionnaireManager;
