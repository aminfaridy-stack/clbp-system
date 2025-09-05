import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ClinicalNotes = ({ currentLanguage }) => {
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const notes = [
    {
      id: 1,
      date: '2025-01-05',
      time: '14:30',
      author: currentLanguage === 'fa' ? 'دکتر احمدی' : 'Dr. Ahmadi',
      category: 'assessment',
      title: currentLanguage === 'fa' ? 'ارزیابی T1 تکمیل شد' : 'T1 Assessment Completed',
      content: currentLanguage === 'fa' 
        ? `بیمار ارزیابی یک‌ماهه را با موفقیت تکمیل کرد. کاهش قابل توجه در نمرات درد (از ۸ به ۶) و بهبود عملکرد روزانه مشاهده شد.\n\nنکات مهم:\n- پاسخ مثبت به فیزیوتراپی\n- کاهش مصرف مسکن\n- بهبود کیفیت خواب`
        : `Patient successfully completed one-month follow-up assessment. Significant reduction in pain scores (8 to 6) and improved daily functioning observed.\n\nKey points:\n- Positive response to physiotherapy\n- Reduced pain medication usage\n- Improved sleep quality`,
      priority: 'normal'
    },
    {
      id: 2,
      date: '2024-12-20',
      time: '10:15',
      author: currentLanguage === 'fa' ? 'دکتر رضایی' : 'Dr. Rezaei',
      category: 'treatment',
      title: currentLanguage === 'fa' ? 'تغییر برنامه درمانی' : 'Treatment Plan Modification',
      content: currentLanguage === 'fa'
        ? `با توجه به پاسخ مثبت بیمار، برنامه فیزیوتراپی تشدید شد. جلسات از هفته‌ای ۲ بار به ۳ بار افزایش یافت.\n\nاهداف جدید:\n- تقویت عضلات مرکزی\n- بهبود انعطاف‌پذیری\n- آموزش ارگونومی`
        : `Due to positive patient response, physiotherapy program intensified. Sessions increased from 2 to 3 times per week.\n\nNew goals:\n- Core muscle strengthening\n- Flexibility improvement\n- Ergonomics education`,
      priority: 'high'
    },
    {
      id: 3,
      date: '2024-12-05',
      time: '09:00',
      author: currentLanguage === 'fa' ? 'دکتر احمدی' : 'Dr. Ahmadi',
      category: 'initial',
      title: currentLanguage === 'fa' ? 'ارزیابی اولیه' : 'Initial Assessment',
      content: currentLanguage === 'fa'
        ? `بیمار ۳۵ ساله با شکایت درد کمر از ۶ هفته پیش. درد در ناحیه L4-L5 با انتشار به پای چپ.\n\nیافته‌های کلیدی:\n- محدودیت حرکتی قابل توجه\n- نمره درد: ۸/۱۰\n- ریسک مزمن: ۷۵٪`
        : `35-year-old patient presenting with 6-week history of lower back pain. Pain localized to L4-L5 region with left leg radiation.\n\nKey findings:\n- Significant movement limitation\n- Pain score: 8/10\n- Chronic risk: 75%`,
      priority: 'normal'
    }
  ];

  const categories = [
    { id: 'general', name: currentLanguage === 'fa' ? 'عمومی' : 'General', icon: 'FileText', color: 'text-primary' },
    { id: 'assessment', name: currentLanguage === 'fa' ? 'ارزیابی' : 'Assessment', icon: 'ClipboardList', color: 'text-therapeutic-green' },
    { id: 'treatment', name: currentLanguage === 'fa' ? 'درمان' : 'Treatment', icon: 'Activity', color: 'text-warning' },
    { id: 'followup', name: currentLanguage === 'fa' ? 'پیگیری' : 'Follow-up', icon: 'Calendar', color: 'text-secondary' }
  ];

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return { name: 'AlertTriangle', color: 'text-error' };
      case 'medium':
        return { name: 'AlertCircle', color: 'text-warning' };
      default:
        return { name: 'Info', color: 'text-primary' };
    }
  };

  const getCategoryConfig = (category) => {
    return categories?.find(cat => cat?.id === category) || categories?.[0];
  };

  const handleAddNote = () => {
    if (newNote?.trim()) {
      // In a real app, this would make an API call
      console.log('Adding note:', {
        content: newNote,
        category: selectedCategory,
        date: new Date()?.toISOString()?.split('T')?.[0],
        time: new Date()?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      });
      
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="card-clinical p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground font-heading mb-4 sm:mb-0">
          {currentLanguage === 'fa' ? 'یادداشت‌های بالینی' : 'Clinical Notes'}
        </h2>
        
        <Button
          variant="default"
          onClick={() => setIsAddingNote(!isAddingNote)}
          iconName={isAddingNote ? "X" : "Plus"}
          iconPosition="left"
        >
          {isAddingNote 
            ? (currentLanguage === 'fa' ? 'لغو' : 'Cancel')
            : (currentLanguage === 'fa' ? 'یادداشت جدید' : 'New Note')
          }
        </Button>
      </div>
      {/* Add New Note Form */}
      {isAddingNote && (
        <div className="bg-muted/30 p-4 rounded-lg border mb-6 animate-slide-up">
          <h3 className="text-lg font-medium text-foreground mb-4">
            {currentLanguage === 'fa' ? 'افزودن یادداشت جدید' : 'Add New Note'}
          </h3>
          
          {/* Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => setSelectedCategory(category?.id)}
                className={`p-3 rounded-lg border transition-clinical flex items-center space-x-2 rtl:space-x-reverse ${
                  selectedCategory === category?.id
                    ? 'border-primary bg-primary/10' :'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <Icon 
                  name={category?.icon} 
                  size={16} 
                  className={selectedCategory === category?.id ? 'text-primary' : category?.color}
                />
                <span className={`text-sm font-medium ${
                  selectedCategory === category?.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {category?.name}
                </span>
              </button>
            ))}
          </div>

          {/* Note Content */}
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e?.target?.value)}
              placeholder={currentLanguage === 'fa' ?'یادداشت بالینی خود را اینجا بنویسید...' :'Write your clinical note here...'
              }
              className="w-full h-32 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-clinical resize-none"
              dir={currentLanguage === 'fa' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddingNote(false);
                setNewNote('');
              }}
            >
              {currentLanguage === 'fa' ? 'لغو' : 'Cancel'}
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote?.trim()}
              iconName="Save"
              iconPosition="left"
            >
              {currentLanguage === 'fa' ? 'ذخیره' : 'Save Note'}
            </Button>
          </div>
        </div>
      )}
      {/* Notes List */}
      <div className="space-y-4">
        {notes?.map((note) => {
          const categoryConfig = getCategoryConfig(note?.category);
          const priorityIcon = getPriorityIcon(note?.priority);
          
          return (
            <div key={note?.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-clinical-md transition-clinical">
              {/* Note Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className={`p-2 rounded-lg bg-muted/50 ${categoryConfig?.color}`}>
                    <Icon name={categoryConfig?.icon} size={16} />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{note?.title}</h4>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-muted-foreground mt-1">
                      <span>{note?.author}</span>
                      <span>•</span>
                      <span>{note?.date}</span>
                      <span>•</span>
                      <span>{note?.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon 
                    name={priorityIcon?.name} 
                    size={16} 
                    className={priorityIcon?.color}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    className="opacity-60 hover:opacity-100"
                  />
                </div>
              </div>
              {/* Note Content */}
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {note?.content}
              </div>
              {/* Note Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className={`status-badge ${categoryConfig?.color?.replace('text-', 'text-')} bg-current/10`}>
                    {categoryConfig?.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Edit2"
                    className="text-xs"
                  >
                    {currentLanguage === 'fa' ? 'ویرایش' : 'Edit'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Share"
                    className="text-xs"
                  >
                    {currentLanguage === 'fa' ? 'اشتراک' : 'Share'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Load More */}
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          iconName="ChevronDown"
          iconPosition="right"
        >
          {currentLanguage === 'fa' ? 'نمایش بیشتر' : 'Load More Notes'}
        </Button>
      </div>
    </div>
  );
};

export default ClinicalNotes;