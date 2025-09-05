import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import LanguageToggle from '../../components/ui/LanguageToggle';

// Import components
import RiskPredictionPanel from './components/RiskPredictionPanel';
import AssessmentScoreCard from './components/AssessmentScoreCard';
import TrendAnalysisChart from './components/TrendAnalysisChart';
import ActionPanel from './components/ActionPanel';

const AssessmentResults = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedMetrics, setSelectedMetrics] = useState(['riskScore', 'painLevel']);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    document.documentElement?.setAttribute('dir', savedLanguage === 'fa' ? 'rtl' : 'ltr');
    document.documentElement?.setAttribute('lang', savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      clearTimeout(timer);
    };
  }, []);

  // Mock SHAP values for explainability
  const mockShapValues = [
    {
      name: currentLanguage === 'fa' ? 'نمره ترس از حرکت (FABQ)' : 'Fear-Avoidance Score (FABQ)',
      impact: 0.15,
      description: currentLanguage === 'fa' ? 'تأثیر بالا در افزایش خطر' : 'High impact on risk increase'
    },
    {
      name: currentLanguage === 'fa' ? 'سطح درد فعلی (NRS)' : 'Current Pain Level (NRS)',
      impact: 0.12,
      description: currentLanguage === 'fa' ? 'درد شدید فعلی' : 'Current severe pain'
    },
    {
      name: currentLanguage === 'fa' ? 'نمره افسردگی (PHQ-9)' : 'Depression Score (PHQ-9)',
      impact: 0.08,
      description: currentLanguage === 'fa' ? 'علائم افسردگی متوسط' : 'Moderate depression symptoms'
    },
    {
      name: currentLanguage === 'fa' ? 'کیفیت خواب (PSQI)' : 'Sleep Quality (PSQI)',
      impact: -0.05,
      description: currentLanguage === 'fa' ? 'خواب نسبتاً مناسب' : 'Relatively good sleep'
    },
    {
      name: currentLanguage === 'fa' ? 'فعالیت بدنی (HPLP II)' : 'Physical Activity (HPLP II)',
      impact: -0.03,
      description: currentLanguage === 'fa' ? 'سطح فعالیت قابل قبول' : 'Acceptable activity level'
    }
  ];

  // Mock assessment results
  const mockAssessments = [
    {
      id: 'fabq',
      type: 'FABQ',
      name: currentLanguage === 'fa' ? 'پرسشنامه ترس از حرکت' : 'Fear-Avoidance Beliefs Questionnaire',
      description: currentLanguage === 'fa' ? 'ارزیابی ترس از حرکت و فعالیت' : 'Assessment of fear-avoidance beliefs',
      score: 42,
      maxScore: 96,
      completedDate: currentLanguage === 'fa' ? '۱۴۰۳/۰۶/۱۵' : '2024-09-05',
      duration: 8,
      subscales: [
        { name: currentLanguage === 'fa' ? 'ترس از فعالیت بدنی' : 'Physical Activity', score: 18, maxScore: 24 },
        { name: currentLanguage === 'fa' ? 'ترس از کار' : 'Work', score: 24, maxScore: 42 }
      ],
      normalRange: currentLanguage === 'fa' ? 'کمتر از ۲۹ طبیعی محسوب می‌شود' : 'Below 29 is considered normal',
      clinicalNotes: currentLanguage === 'fa' ? 'نمره بالا نشان‌دهنده ترس بیش از حد از حرکت است' : 'High score indicates excessive fear of movement'
    },
    {
      id: 'phq9',
      type: 'PHQ-9',
      name: currentLanguage === 'fa' ? 'پرسشنامه افسردگی' : 'Patient Health Questionnaire-9',
      description: currentLanguage === 'fa' ? 'غربالگری علائم افسردگی' : 'Depression symptoms screening',
      score: 12,
      maxScore: 27,
      completedDate: currentLanguage === 'fa' ? '۱۴۰۳/۰۶/۱۵' : '2024-09-05',
      duration: 5,
      normalRange: currentLanguage === 'fa' ? '۰-۴: کم، ۵-۹: خفیف، ۱۰-۱۴: متوسط' : '0-4: Minimal, 5-9: Mild, 10-14: Moderate',
      clinicalNotes: currentLanguage === 'fa' ? 'علائم افسردگی متوسط - نیاز به پیگیری' : 'Moderate depression symptoms - requires follow-up'
    },
    {
      id: 'pcs',
      type: 'PCS',
      name: currentLanguage === 'fa' ? 'مقیاس فاجعه‌سازی درد' : 'Pain Catastrophizing Scale',
      description: currentLanguage === 'fa' ? 'ارزیابی افکار منفی درباره درد' : 'Assessment of negative thoughts about pain',
      score: 28,
      maxScore: 52,
      completedDate: currentLanguage === 'fa' ? '۱۴۰۳/۰۶/۱۵' : '2024-09-05',
      duration: 6,
      subscales: [
        { name: currentLanguage === 'fa' ? 'نشخوار فکری' : 'Rumination', score: 11, maxScore: 16 },
        { name: currentLanguage === 'fa' ? 'بزرگ‌نمایی' : 'Magnification', score: 8, maxScore: 12 },
        { name: currentLanguage === 'fa' ? 'درماندگی' : 'Helplessness', score: 9, maxScore: 24 }
      ],
      normalRange: currentLanguage === 'fa' ? 'کمتر از ۲۰ طبیعی است' : 'Below 20 is normal',
      clinicalNotes: currentLanguage === 'fa' ? 'سطح متوسط فاجعه‌سازی درد' : 'Moderate level of pain catastrophizing'
    },
    {
      id: 'nrs',
      type: 'NRS',
      name: currentLanguage === 'fa' ? 'مقیاس عددی درد' : 'Numeric Rating Scale',
      description: currentLanguage === 'fa' ? 'شدت درد فعلی' : 'Current pain intensity',
      score: 6.5,
      maxScore: 10,
      completedDate: currentLanguage === 'fa' ? '۱۴۰۳/۰۶/۱۵' : '2024-09-05',
      duration: 2,
      normalRange: currentLanguage === 'fa' ? '۰-۳: خفیف، ۴-۶: متوسط، ۷-۱۰: شدید' : '0-3: Mild, 4-6: Moderate, 7-10: Severe',
      clinicalNotes: currentLanguage === 'fa' ? 'درد متوسط تا شدید' : 'Moderate to severe pain'
    }
  ];

  const handleMetricToggle = (metricKey) => {
    setSelectedMetrics(prev => 
      prev?.includes(metricKey) 
        ? prev?.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const handleViewDetails = (assessment) => {
    console.log('Viewing details for:', assessment);
  };

  const handleDownloadReport = (format) => {
    console.log('Downloading report in format:', format);
  };

  const handleShareResults = (method) => {
    console.log('Sharing results via:', method);
  };

  const handleScheduleFollowup = () => {
    navigate('/multi-step-assessment');
  };

  const handleStartNewAssessment = () => {
    navigate('/multi-step-assessment');
  };

  const handleRegionClick = (region) => {
    console.log('Clicked region:', region);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LanguageToggle position="top-right" />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Loader2" size={32} className="text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground font-heading mb-2">
                {currentLanguage === 'fa' ? 'در حال تحلیل نتایج...' : 'Analyzing Results...'}
              </h2>
              <p className="text-muted-foreground">
                {currentLanguage === 'fa' ? 'لطفاً صبر کنید' : 'Please wait'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LanguageToggle position="top-right" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/multi-step-assessment')}
              iconName="ArrowLeft"
              iconPosition="left"
              className="rtl:rotate-180"
            >
              {currentLanguage === 'fa' ? 'بازگشت' : 'Back'}
            </Button>
            <div className="h-6 w-px bg-border" />
            <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              <button onClick={() => navigate('/patient-login')} className="hover:text-foreground transition-clinical">
                {currentLanguage === 'fa' ? 'داشبورد' : 'Dashboard'}
              </button>
              <Icon name="ChevronRight" size={16} className="rtl:rotate-180" />
              <span className="text-foreground">
                {currentLanguage === 'fa' ? 'نتایج ارزیابی' : 'Assessment Results'}
              </span>
            </nav>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
                {currentLanguage === 'fa' ? 'نتایج ارزیابی CLBP' : 'CLBP Assessment Results'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {currentLanguage === 'fa' ?'تحلیل جامع خطر مزمن شدن درد کمر' :'Comprehensive chronic low back pain risk analysis'
                }
              </p>
              <div className="flex items-center space-x-4 rtl:space-x-reverse mt-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon name="Calendar" size={16} />
                  <span>
                    {currentLanguage === 'fa' 
                      ? `تاریخ ارزیابی: ${new Date()?.toLocaleDateString('fa-IR')}`
                      : `Assessment Date: ${new Date()?.toLocaleDateString()}`
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon name="User" size={16} />
                  <span>
                    {currentLanguage === 'fa' ? 'شناسه بیمار: P-2024-001' : 'Patient ID: P-2024-001'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="text-right rtl:text-left">
                <div className="text-sm text-muted-foreground">
                  {currentLanguage === 'fa' ? 'وضعیت تحلیل' : 'Analysis Status'}
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-success">
                    {currentLanguage === 'fa' ? 'تکمیل شده' : 'Complete'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Risk Prediction Panel */}
          <RiskPredictionPanel
            riskPercentage={72}
            confidenceInterval={[65, 79]}
            riskLevel="high"
            shapValues={mockShapValues}
            onViewDetails={() => console.log('View risk details')}
          />

          {/* Assessment Scores */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'نتایج پرسشنامه‌ها' : 'Questionnaire Results'}
              </h2>
              <div className="text-sm text-muted-foreground">
                {mockAssessments?.length} {currentLanguage === 'fa' ? 'ارزیابی' : 'assessments'}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockAssessments?.map((assessment) => (
                <AssessmentScoreCard
                  key={assessment?.id}
                  assessment={assessment}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>

          {/* Trend Analysis */}
          <TrendAnalysisChart
            selectedMetrics={selectedMetrics}
            onMetricToggle={handleMetricToggle}
          />

          {/* Action Panel */}
          <ActionPanel
            patientData={{}}
            onDownloadReport={handleDownloadReport}
            onShareResults={handleShareResults}
            onScheduleFollowup={handleScheduleFollowup}
            onStartNewAssessment={handleStartNewAssessment}
          />
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="outline"
                onClick={() => navigate('/multi-step-assessment')}
                iconName="RefreshCw"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'ارزیابی مجدد' : 'Retake Assessment'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/patient-profile')}
                iconName="User"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'پروفایل بیمار' : 'Patient Profile'}
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="default"
                onClick={() => handleDownloadReport('pdf')}
                iconName="Download"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'دانلود گزارش' : 'Download Report'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin-dashboard')}
                iconName="BarChart3"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'داشبورد مدیریت' : 'Admin Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentResults;