import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Icon from '../AppIcon';

const QuestionEditor = ({ isOpen, onClose, onSave, question, questionnaireId, currentLanguage }) => {
  const [text, setText] = useState('');
  const [questionType, setQuestionType] = useState('text');
  const [options, setOptions] = useState(['']);

  useEffect(() => {
    if (question) {
      setText(question.text || '');
      setQuestionType(question.questionType || 'text');
      setOptions(question.options && question.options.length > 0 ? question.options : ['']);
    } else {
      // Reset form for new question
      setText('');
      setQuestionType('text');
      setOptions(['']);
    }
  }, [question, isOpen]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length <= 1) return; // Must have at least one option
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSave = () => {
    const questionData = {
      text,
      questionType,
      options: ['multiple-choice', 'checkboxes', 'dropdown'].includes(questionType) ? options.filter(opt => opt.trim() !== '') : [],
    };
    onSave(questionData);
  };

  if (!isOpen) return null;

  const questionTypeOptions = [
    { value: 'text', label: currentLanguage === 'fa' ? 'متن کوتاه' : 'Short Text' },
    { value: 'multiple-choice', label: currentLanguage === 'fa' ? 'چند گزینه‌ای' : 'Multiple Choice' },
    { value: 'checkboxes', label: currentLanguage === 'fa' ? 'چک‌باکس' : 'Checkboxes' },
    { value: 'dropdown', label: currentLanguage === 'fa' ? 'لیست کشویی' : 'Dropdown' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold font-heading">
            {question ? (currentLanguage === 'fa' ? 'ویرایش سوال' : 'Edit Question') : (currentLanguage === 'fa' ? 'افزودن سوال جدید' : 'Add New Question')}
          </h2>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <Input
            label={currentLanguage === 'fa' ? 'متن سوال' : 'Question Text'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={currentLanguage === 'fa' ? 'سوال خود را اینجا وارد کنید' : 'Enter your question here'}
            type="textarea"
            rows={3}
          />

          <Select
            label={currentLanguage === 'fa' ? 'نوع سوال' : 'Question Type'}
            options={questionTypeOptions}
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          />

          {['multiple-choice', 'checkboxes', 'dropdown'].includes(questionType) && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">{currentLanguage === 'fa' ? 'گزینه‌ها' : 'Options'}</label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`${currentLanguage === 'fa' ? 'گزینه' : 'Option'} ${index + 1}`}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={options.length <= 1}>
                    <Icon name="Trash2" size={16} className="text-muted-foreground"/>
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} iconName="Plus" iconPosition="left">
                {currentLanguage === 'fa' ? 'افزودن گزینه' : 'Add Option'}
              </Button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border mt-auto flex justify-end space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={onClose}>
            {currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
          </Button>
          <Button onClick={handleSave}>
            {currentLanguage === 'fa' ? 'ذخیره سوال' : 'Save Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
