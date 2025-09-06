import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import LanguageToggle from '../../components/ui/LanguageToggle';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PerformanceMetricsCards from './components/PerformanceMetricsCards';
import PatientOverviewTable from './components/PatientOverviewTable';
import DataVisualizationPanels from './components/DataVisualizationPanels';
import ModelPerformanceMonitoring from './components/ModelPerformanceMonitoring';
import AdminToolbar from './components/AdminToolbar';
import AdvancedFilters from './components/AdvancedFilters';
import SettingsPanel from './components/SettingsPanel';

const AdminDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    assessmentStatus: 'all',
    demographics: 'all',
    timeRange: '30days'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    document.documentElement?.setAttribute('dir', savedLanguage === 'fa' ? 'rtl' : 'ltr');
    document.documentElement?.setAttribute('lang', savedLanguage);

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1200);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Mock admin dashboard data
  const dashboardData = {
    metrics: {
      totalPatients: 1247,
      completionRate: 85.3,
      riskDistribution: {
        low: 45.2,
        moderate: 38.7,
        high: 16.1
      },
      modelAccuracy: 94.7
    },
    patients: [
      {
        id: 'P001',
        name: currentLanguage === 'fa' ? 'علی احمدی' : 'Ali Ahmadi',
        phase: 'T2',
        riskScore: 72,
        lastActivity: '2025-01-04',
        status: 'active',
        age: 35,
        gender: currentLanguage === 'fa' ? 'مرد' : 'Male'
      },
      {
        id: 'P002',
        name: currentLanguage === 'fa' ? 'مریم حسینی' : 'Maryam Hosseini',
        phase: 'T1',
        riskScore: 45,
        lastActivity: '2025-01-05',
        status: 'completed',
        age: 42,
        gender: currentLanguage === 'fa' ? 'زن' : 'Female'
      },
      {
        id: 'P003',
        name: currentLanguage === 'fa' ? 'محمد رضایی' : 'Mohammad Rezaei',
        phase: 'T3',
        riskScore: 88,
        lastActivity: '2025-01-03',
        status: 'pending',
        age: 28,
        gender: currentLanguage === 'fa' ? 'مرد' : 'Male'
      },
      {
        id: 'P004',
        name: currentLanguage === 'fa' ? 'زهرا موسوی' : 'Zahra Mousavi',
        phase: 'T2',
        riskScore: 61,
        lastActivity: '2025-01-05',
        status: 'active',
        age: 38,
        gender: currentLanguage === 'fa' ? 'زن' : 'Female'
      },
      {
        id: 'P005',
        name: currentLanguage === 'fa' ? 'حسن کریمی' : 'Hassan Karimi',
        phase: 'T1',
        riskScore: 29,
        lastActivity: '2025-01-04',
        status: 'completed',
        age: 45,
        gender: currentLanguage === 'fa' ? 'مرد' : 'Male'
      }
    ]
  };

  const viewTabs = [
    {
      id: 'overview',
      name: currentLanguage === 'fa' ? 'نمای کلی' : 'Overview',
      icon: 'LayoutDashboard'
    },
    {
      id: 'patients',
      name: currentLanguage === 'fa' ? 'مدیریت بیماران' : 'Patient Management',
      icon: 'Users'
    },
    {
      id: 'analytics',
      name: currentLanguage === 'fa' ? 'تجزیه و تحلیل' : 'Analytics',
      icon: 'BarChart3'
    },
    {
      id: 'monitoring',
      name: currentLanguage === 'fa' ? 'نظارت بر مدل' : 'Model Monitoring',
      icon: 'Activity'
    },
    {
      id: 'settings',
      name: currentLanguage === 'fa' ? 'تنظیمات' : 'Settings',
      icon: 'Settings'
    }
  ];

  const handlePatientClick = (patientId) => {
    navigate(`/patient-profile?id=${patientId}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Filter patients based on new filters
    const filtered = dashboardData?.patients?.filter(patient => {
      if (newFilters?.riskLevel !== 'all') {
        const risk = patient?.riskScore < 40 ? 'low' : patient?.riskScore < 70 ? 'moderate' : 'high';
        if (risk !== newFilters?.riskLevel) return false;
      }
      if (newFilters?.assessmentStatus !== 'all' && patient?.status !== newFilters?.assessmentStatus) {
        return false;
      }
      return true;
    });
    setFilteredPatients(filtered);
  };

  const handleExportData = (format) => {
    // Mock export functionality
    alert(currentLanguage === 'fa' ? 
      `داده‌ها در فرمت ${format} صادر شد` : 
      `Data exported in ${format} format`
    );
  };

  const handleDownloadDetailedReport = async () => {
    try {
      const response = await axios.get('/api/reports/detailed-data', {
        responseType: 'blob', // Important to handle the file download
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from content-disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'detailed_report.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);

      // Append to html, click, and remove
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading report:', error);
      alert(currentLanguage === 'fa' ? 'خطا در دانلود گزارش.' : 'Failed to download report.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">
            {currentLanguage === 'fa' ? 'در حال بارگذاری داشبورد...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4 lg:mb-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground font-heading">
                    {currentLanguage === 'fa' ? 'داشبورد مدیریت' : 'Admin Dashboard'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {currentLanguage === 'fa' ? 'نظارت و مدیریت جامع سیستم ارزیابی درد کمر مزمن': 'Comprehensive chronic low back pain assessment management and oversight'
                    }
                  </p>
                </div>
              </div>

              <AdminToolbar 
                onExport={handleExportData}
                currentLanguage={currentLanguage}
              />
            </div>

            {/* Tab Navigation */}
            <div className="card-clinical p-2 mb-6">
              <div className="flex items-center space-x-1 rtl:space-x-reverse overflow-x-auto">
                {viewTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-md text-sm font-medium transition-clinical whitespace-nowrap ${
                      activeView === tab?.id
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

            {/* View Content */}
            <div className="animate-fade-in">
              {activeView === 'overview' && (
                <div className="space-y-8">
                  {/* Performance Metrics */}
                  <PerformanceMetricsCards 
                    metrics={dashboardData?.metrics}
                    currentLanguage={currentLanguage}
                  />

                  {/* Quick Patient Overview */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                      <PatientOverviewTable 
                        patients={dashboardData?.patients?.slice(0, 5)}
                        onPatientClick={handlePatientClick}
                        currentLanguage={currentLanguage}
                        compact={true}
                      />
                    </div>
                    <div>
                      <DataVisualizationPanels 
                        data={dashboardData?.metrics}
                        currentLanguage={currentLanguage}
                        compact={true}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'patients' && (
                <div className="space-y-6">
                  <AdvancedFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    currentLanguage={currentLanguage}
                  />
                  
                  <PatientOverviewTable 
                    patients={filteredPatients?.length > 0 ? filteredPatients : dashboardData?.patients}
                    onPatientClick={handlePatientClick}
                    currentLanguage={currentLanguage}
                  />
                </div>
              )}

              {activeView === 'analytics' && (
                <DataVisualizationPanels 
                  data={dashboardData?.metrics}
                  currentLanguage={currentLanguage}
                />
              )}

              {activeView === 'monitoring' && (
                <ModelPerformanceMonitoring 
                  performance={dashboardData?.metrics}
                  currentLanguage={currentLanguage}
                />
              )}

              {activeView === 'settings' && (
                <SettingsPanel currentLanguage={currentLanguage} />
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-12 p-6 bg-muted/30 rounded-lg border">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentLanguage === 'fa' ? 
                      `آخرین به‌روزرسانی: ${new Date()?.toLocaleDateString('fa-IR')} - ${new Date()?.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}` :
                      `Last updated: ${new Date()?.toLocaleDateString()} at ${new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    }
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/patient-registration')}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'ثبت بیمار جدید' : 'Add New Patient'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadDetailedReport}
                    iconName="FileText"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'گزارشات تفصیلی' : 'Detailed Reports'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(currentLanguage === 'fa' ? 'تنظیمات سیستم' : 'System configuration')}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'تنظیمات' : 'Settings'}
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => window.location?.reload()}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    {currentLanguage === 'fa' ? 'به‌روزرسانی' : 'Refresh'}
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

export default AdminDashboard;