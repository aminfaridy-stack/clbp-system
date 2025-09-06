import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postAssessment } from '../../store/slices/predictionSlice';
import { useToast } from '../../context/ToastContext';
import Header from '../../components/ui/Header';

import Button from '../../components/ui/Button';
import AssessmentProgress from './components/AssessmentProgress';
import QuestionnaireForm from './components/QuestionnaireForm';
import BodyMapSVG from './components/BodyMapSVG';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import CompletionModal from './components/CompletionModal';

const MultiStepAssessment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedBodyRegions, setSelectedBodyRegions] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const totalSteps = 10;

  const assessmentNames = [
    currentLanguage === 'fa' ? 'ترس از فعالیت (FABQ)' : 'Fear-Avoidance (FABQ)',
    currentLanguage === 'fa' ? 'افسردگی (PHQ-9)' : 'Depression (PHQ-9)',
    currentLanguage === 'fa' ? 'فاجعه‌سازی درد (PCS)' : 'Pain Catastrophizing (PCS)',
    currentLanguage === 'fa' ? 'ترس از حرکت (TSK-11)' : 'Kinesiophobia (TSK-11)',
    currentLanguage === 'fa' ? 'کیفیت خواب (PSQI)' : 'Sleep Quality (PSQI)',
    currentLanguage === 'fa' ? 'سبک زندگی (HPLP II)' : 'Lifestyle (HPLP II)',
    currentLanguage === 'fa' ? 'ناتوانی (RMDQ)' : 'Disability (RMDQ)',
    currentLanguage === 'fa' ? 'شدت درد (NRS)' : 'Pain Intensity (NRS)',
    currentLanguage === 'fa' ? 'نوردیک (NMQ)' : 'Nordic (NMQ)',
    currentLanguage === 'fa' ? 'عملکرد اندام (LEFS)' : 'Lower Extremity (LEFS)'
  ];

  // Mock questionnaire data
  const questionnaires = {
    1: {
      title: currentLanguage === 'fa' ? 'پرسشنامه ترس از فعالیت (FABQ)' : 'Fear-Avoidance Beliefs Questionnaire (FABQ)',
      code: 'FABQ',
      description: currentLanguage === 'fa' ? 'ارزیابی باورهای مربوط به ترس از فعالیت و کار' : 'Assessment of fear-avoidance beliefs about physical activity and work',
      instructions: currentLanguage === 'fa' ?'لطفاً هر گزینه را بر اساس میزان موافقت یا مخالفت خود با آن انتخاب کنید.' :'Please rate each statement based on how much you agree or disagree with it.',
      questions: [
        {
          question: currentLanguage === 'fa' ? 'فعالیت بدنی باعث تشدید درد من می‌شود' : 'Physical activity makes my pain worse',
          type: 'scale',
          scaleMin: 0,
          scaleMax: 6,
          scaleLabels: { min: currentLanguage === 'fa' ? 'کاملاً مخالفم' : 'Completely Disagree', max: currentLanguage === 'fa' ? 'کاملاً موافقم' : 'Completely Agree' },
          required: true
        },
        {
          question: currentLanguage === 'fa' ? 'فعالیت بدنی ممکن است به کمرم آسیب برساند' : 'Physical activity might harm my back',
          type: 'scale',
          scaleMin: 0,
          scaleMax: 6,
          scaleLabels: { min: currentLanguage === 'fa' ? 'کاملاً مخالفم' : 'Completely Disagree', max: currentLanguage === 'fa' ? 'کاملاً موافقم' : 'Completely Agree' },
          required: true
        },
        {
          question: currentLanguage === 'fa' ? 'نباید کاری انجام دهم که ممکن است درد کمرم را بدتر کند' : 'I should not do physical activities which might make my pain worse',
          type: 'scale',
          scaleMin: 0,
          scaleMax: 6,
          scaleLabels: { min: currentLanguage === 'fa' ? 'کاملاً مخالفم' : 'Completely Disagree', max: currentLanguage === 'fa' ? 'کاملاً موافقم' : 'Completely Agree' },
          required: true
        }
      ]
    },
    2: {
      title: currentLanguage === 'fa' ? 'پرسشنامه افسردگی (PHQ-9)' : 'Patient Health Questionnaire (PHQ-9)',
      code: 'PHQ-9',
      description: currentLanguage === 'fa' ? 'ارزیابی علائم افسردگی در دو هفته گذشته' : 'Assessment of depression symptoms over the past two weeks',
      instructions: currentLanguage === 'fa' ?'در طول دو هفته گذشته، چقدر توسط مشکلات زیر آزار شده‌اید؟' :'Over the last 2 weeks, how often have you been bothered by the following problems?',
      questions: [
        {
          question: currentLanguage === 'fa' ? 'کم علاقگی یا عدم لذت از انجام کارها' : 'Little interest or pleasure in doing things',
          type: 'radio',
          options: [
            { value: '0', label: currentLanguage === 'fa' ? 'اصلاً' : 'Not at all', score: 0 },
            { value: '1', label: currentLanguage === 'fa' ? 'چند روز' : 'Several days', score: 1 },
            { value: '2', label: currentLanguage === 'fa' ? 'بیش از نیمی از روزها' : 'More than half the days', score: 2 },
            { value: '3', label: currentLanguage === 'fa' ? 'تقریباً هر روز' : 'Nearly every day', score: 3 }
          ],
          required: true
        },
        {
          question: currentLanguage === 'fa' ? 'احساس غمگینی، افسردگی یا ناامیدی' : 'Feeling down, depressed, or hopeless',
          type: 'radio',
          options: [
            { value: '0', label: currentLanguage === 'fa' ? 'اصلاً' : 'Not at all', score: 0 },
            { value: '1', label: currentLanguage === 'fa' ? 'چند روز' : 'Several days', score: 1 },
            { value: '2', label: currentLanguage === 'fa' ? 'بیش از نیمی از روزها' : 'More than half the days', score: 2 },
            { value: '3', label: currentLanguage === 'fa' ? 'تقریباً هر روز' : 'Nearly every day', score: 3 }
          ],
          required: true
        }
      ]
    },
    9: {
      title: currentLanguage === 'fa' ? 'پرسشنامه نوردیک (NMQ)' : 'Nordic Musculoskeletal Questionnaire (NMQ)',
      code: 'NMQ',
      description: currentLanguage === 'fa' ? 'ارزیابی درد و ناراحتی در نواحی مختلف بدن' : 'Assessment of pain and discomfort in different body regions',
      instructions: currentLanguage === 'fa' ?'روی نقشه بدن، نواحی که در آن درد یا ناراحتی دارید را مشخص کنید.' :'On the body map, mark the areas where you experience pain or discomfort.',
      questions: [
        {
          question: currentLanguage === 'fa' ? 'در 12 ماه گذشته، آیا در نواحی انتخاب شده درد یا ناراحتی داشته‌اید؟' : 'In the past 12 months, have you had pain or discomfort in the selected areas?',
          type: 'radio',
          options: [
            { value: 'yes', label: currentLanguage === 'fa' ? 'بله' : 'Yes' },
            { value: 'no', label: currentLanguage === 'fa' ? 'خیر' : 'No' }
          ],
          required: true
        }
      ]
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    document.documentElement?.setAttribute('dir', savedLanguage === 'fa' ? 'rtl' : 'ltr');

    // Load saved progress
    const savedProgress = localStorage.getItem('assessment_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentStep(progress?.currentStep || 1);
      setResponses(progress?.responses || {});
      setCompletedSteps(progress?.completedSteps || []);
      setSelectedBodyRegions(progress?.selectedBodyRegions || []);
      setLastSaved(progress?.lastSaved ? new Date(progress.lastSaved) : null);
    }

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const autoSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const progressData = {
      currentStep,
      responses,
      completedSteps,
      selectedBodyRegions,
      lastSaved: new Date()?.toISOString()
    };
    
    localStorage.setItem('assessment_progress', JSON.stringify(progressData));
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    setIsSaving(false);
  };

  const handleResponseChange = (questionKey, value) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }));
    setHasUnsavedChanges(true);
    
    // Auto-save after 2 seconds of inactivity
    setTimeout(() => {
      if (hasUnsavedChanges) {
        autoSave();
      }
    }, 2000);
  };

  const handleBodyRegionClick = (regionId) => {
    setSelectedBodyRegions(prev => {
      const newRegions = prev?.includes(regionId)
        ? prev?.filter(id => id !== regionId)
        : [...prev, regionId];
      
      setHasUnsavedChanges(true);
      return newRegions;
    });
  };

  const handleNext = () => {
    if (!completedSteps?.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    if (currentStep === totalSteps) {
      setShowCompletionModal(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
    autoSave();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveAndExit = async () => {
    await autoSave();
    navigate('/patient-login');
  };

  const handleCompleteAssessment = async () => {
    // No need to autoSave here as we are submitting
    const assessmentData = { responses, selectedBodyRegions };

    // Dispatch the thunk and unwrap the result
    try {
      await dispatch(postAssessment(assessmentData)).unwrap();
      // unwrap will throw an error if the thunk is rejected

      localStorage.removeItem('assessment_progress');
      navigate('/assessment-results');
    } catch (err) {
      // The predictionSlice will hold the error state, but we can also alert the user
      console.error('Failed to submit assessment:', err);
      addToast(currentLanguage === 'fa' ? 'خطا در ارسال ارزیابی. لطفاً دوباره تلاش کنید.' : 'Failed to submit assessment. Please try again.', 'error');
      // Close the modal so the user can see the page again
      setShowCompletionModal(false);
    }
  };

  const getCurrentQuestionnaire = () => {
    return questionnaires?.[currentStep] || {
      title: `${currentLanguage === 'fa' ? 'ارزیابی' : 'Assessment'} ${currentStep}`,
      code: `STEP-${currentStep}`,
      description: currentLanguage === 'fa' ? 'ارزیابی در حال بارگذاری...' : 'Loading assessment...',
      questions: []
    };
  };

  const assessmentSummary = {
    totalAnswered: Object.keys(responses)?.length + (selectedBodyRegions?.length > 0 ? 1 : 0),
    completedSections: completedSteps?.length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'ارزیابی چندمرحله‌ای CLBP' : 'CLBP Multi-Step Assessment'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentLanguage === 'fa' ?'ارزیابی جامع برای پیش‌بینی درد مزمن کمر' :'Comprehensive assessment for chronic low back pain prediction'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patient-login')}
                iconName="Home"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'بازگشت' : 'Back to Home'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveAndExit}
                iconName="Save"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'ذخیره و خروج' : 'Save & Exit'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <AssessmentProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              completedSteps={completedSteps}
              assessmentNames={assessmentNames}
              currentLanguage={currentLanguage}
            />
            
            {/* Quick Stats */}
            <div className="bg-card rounded-lg border shadow-clinical p-4 mt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">
                {currentLanguage === 'fa' ? 'آمار سریع' : 'Quick Stats'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'پاسخ داده شده:' : 'Answered:'}
                  </span>
                  <span className="font-data text-primary">
                    {assessmentSummary?.totalAnswered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'تکمیل شده:' : 'Completed:'}
                  </span>
                  <span className="font-data text-success">
                    {completedSteps?.length}/{totalSteps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {currentLanguage === 'fa' ? 'زمان تخمینی:' : 'Est. Time:'}
                  </span>
                  <span className="font-data text-foreground">
                    {Math.max(1, totalSteps - currentStep + 1) * 3} {currentLanguage === 'fa' ? 'دقیقه' : 'min'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentStep === 9 ? (
              <div className="space-y-6">
                <BodyMapSVG
                  selectedRegions={selectedBodyRegions}
                  onRegionClick={handleBodyRegionClick}
                  currentLanguage={currentLanguage}
                />
                
                <QuestionnaireForm
                  currentStep={currentStep}
                  questionnaire={getCurrentQuestionnaire()}
                  responses={responses}
                  onResponseChange={handleResponseChange}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onSaveAndExit={handleSaveAndExit}
                  currentLanguage={currentLanguage}
                  isFirstStep={currentStep === 1}
                  isLastStep={currentStep === totalSteps}
                />
              </div>
            ) : (
              <QuestionnaireForm
                currentStep={currentStep}
                questionnaire={getCurrentQuestionnaire()}
                responses={responses}
                onResponseChange={handleResponseChange}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSaveAndExit={handleSaveAndExit}
                currentLanguage={currentLanguage}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === totalSteps}
              />
            )}
          </div>
        </div>
      </main>
      <AutoSaveIndicator
        lastSaved={lastSaved}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        currentLanguage={currentLanguage}
      />
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onConfirm={handleCompleteAssessment}
        currentLanguage={currentLanguage}
        assessmentSummary={assessmentSummary}
      />
    </div>
  );
};

export default MultiStepAssessment;