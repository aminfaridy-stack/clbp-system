import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useLanguage } from '../../components/ui/LanguageToggle';
import { useToast } from '../../context/ToastContext';
import PatientHeader from './components/PatientHeader';
import AssessmentTimeline from './components/AssessmentTimeline';
import TrendAnalysis from './components/TrendAnalysis';
import ClinicalNotes from './components/ClinicalNotes';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PatientProfile = () => {
  const currentLanguage = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Mock patient data
  const patientData = {
    id: 'P001',
    name: currentLanguage === 'fa' ? 'علی احمدی' : 'Ali Ahmadi',
    age: 35,
    gender: currentLanguage === 'fa' ? 'مرد' : 'Male',
    phone: '+98 912 345 6789',
    email: 'ali.ahmadi@email.com',
    address: currentLanguage === 'fa' ?'تهران، خیابان ولیعصر، پلاک ۱۲۳' :'Tehran, Vali-e Asr Street, No. 123',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'active',
    painLevel: 6,
    chronicRisk: 65,
    currentPhase: 'T1',
    registrationDate: '2024-12-05',
    lastAssessment: '2025-01-05',
    nextAppointment: '2025-02-05'
  };

  const tabs = [
    {
      id: 'overview',
      name: currentLanguage === 'fa' ? 'نمای کلی' : 'Overview',
      icon: 'LayoutDashboard'
    },
    {
      id: 'assessments',
      name: currentLanguage === 'fa' ? 'ارزیابی‌ها' : 'Assessments',
      icon: 'ClipboardList'
    },
    {
      id: 'trends',
      name: currentLanguage === 'fa' ? 'روندها' : 'Trends',
      icon: 'TrendingUp'
    },
    {
      id: 'notes',
      name: currentLanguage === 'fa' ? 'یادداشت‌ها' : 'Notes',
      icon: 'FileText'
    }
  ];

  const handleSendReminder = () => {
    addToast(currentLanguage === 'fa' ? 'یادآوری ارسال شد' : 'Reminder sent successfully', 'success');
  };

  const handleGenerateReport = () => {
    addToast(currentLanguage === 'fa' ? 'گزارش در حال تولید است...' : 'Generating report...');
  };

  const handleEditPatient = () => {
    // Mock edit functionality
    console.log('Edit patient:', patientData?.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">
            {currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LanguageToggle position="top-right" />
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16 rtl:mr-16 rtl:ml-0' : 'ml-64 rtl:mr-64 rtl:ml-0'
        }`}>
          <div className="assessment-container py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground mb-6">
              <button 
                onClick={() => navigate('/admin-dashboard')}
                className="hover:text-primary transition-clinical"
              >
                {currentLanguage === 'fa' ? 'داشبورد' : 'Dashboard'}
              </button>
              <Icon name="ChevronRight" size={14} className="rtl:rotate-180" />
              <button 
                onClick={() => navigate('/admin-dashboard')}
                className="hover:text-primary transition-clinical"
              >
                {currentLanguage === 'fa' ? 'بیماران' : 'Patients'}
              </button>
              <Icon name="ChevronRight" size={14} className="rtl:rotate-180" />
              <span className="text-foreground font-medium">
                {patientData?.name}
              </span>
            </div>

            {/* Patient Header */}
            <PatientHeader
              patient={patientData}
              onEdit={handleEditPatient}
              onSendReminder={handleSendReminder}
              onGenerateReport={handleGenerateReport}
              currentLanguage={currentLanguage}
            />

            {/* Tab Navigation */}
            <div className="card-clinical p-2 mb-6">
              <div className="flex items-center space-x-1 rtl:space-x-reverse overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-md text-sm font-medium transition-clinical whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <AssessmentTimeline 
                    assessments={[]}
                    currentLanguage={currentLanguage}
                  />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TrendAnalysis currentLanguage={currentLanguage} />
                    <div className="card-clinical p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 font-heading">
                        {currentLanguage === 'fa' ? 'خلاصه وضعیت' : 'Status Summary'}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            {currentLanguage === 'fa' ? 'آخرین ارزیابی' : 'Last Assessment'}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {patientData?.lastAssessment}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            {currentLanguage === 'fa' ? 'قرار ملاقات بعدی' : 'Next Appointment'}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {patientData?.nextAppointment}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            {currentLanguage === 'fa' ? 'تاریخ ثبت نام' : 'Registration Date'}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {patientData?.registrationDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assessments' && (
                <AssessmentTimeline 
                  assessments={[]}
                  currentLanguage={currentLanguage}
                />
              )}

              {activeTab === 'trends' && (
                <TrendAnalysis currentLanguage={currentLanguage} />
              )}

              {activeTab === 'notes' && (
                <ClinicalNotes currentLanguage={currentLanguage} />
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentLanguage === 'fa' ?'آخرین به‌روزرسانی: ۵ دقیقه پیش' :'Last updated: 5 minutes ago'
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/multi-step-assessment')}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'ارزیابی جدید' : 'New Assessment'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    iconName="Printer"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'چاپ' : 'Print'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientProfile;