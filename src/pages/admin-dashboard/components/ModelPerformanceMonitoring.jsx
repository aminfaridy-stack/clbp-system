import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const ModelPerformanceMonitoring = ({ performance, currentLanguage }) => {
  // Mock performance data
  const rocData = [
    { fpr: 0, tpr: 0, auc: 0 },
    { fpr: 0.1, tpr: 0.15, auc: 0.85 },
    { fpr: 0.2, tpr: 0.35, auc: 0.87 },
    { fpr: 0.3, tpr: 0.55, auc: 0.89 },
    { fpr: 0.4, tpr: 0.72, auc: 0.91 },
    { fpr: 0.5, tpr: 0.85, auc: 0.93 },
    { fpr: 0.6, tpr: 0.92, auc: 0.94 },
    { fpr: 0.7, tpr: 0.96, auc: 0.95 },
    { fpr: 0.8, tpr: 0.98, auc: 0.96 },
    { fpr: 0.9, tpr: 0.99, auc: 0.97 },
    { fpr: 1.0, tpr: 1.0, auc: 1.0 }
  ];

  const accuracyTrends = [
    { 
      date: '2024-12-01', 
      accuracy: 92.1, 
      precision: 89.4, 
      recall: 91.2,
      f1Score: 90.3
    },
    { 
      date: '2024-12-08', 
      accuracy: 93.2, 
      precision: 90.8, 
      recall: 92.1,
      f1Score: 91.4
    },
    { 
      date: '2024-12-15', 
      accuracy: 94.1, 
      precision: 91.9, 
      recall: 93.0,
      f1Score: 92.4
    },
    { 
      date: '2024-12-22', 
      accuracy: 94.7, 
      precision: 92.3, 
      recall: 93.8,
      f1Score: 93.0
    },
    { 
      date: '2024-12-29', 
      accuracy: 94.5, 
      precision: 92.1, 
      recall: 93.5,
      f1Score: 92.8
    },
    { 
      date: '2025-01-05', 
      accuracy: 94.9, 
      precision: 92.7, 
      recall: 94.1,
      f1Score: 93.4
    }
  ];

  const dataQualityMetrics = [
    {
      metric: currentLanguage === 'fa' ? 'کیفیت داده' : 'Data Quality',
      score: 96.8,
      status: 'excellent',
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      metric: currentLanguage === 'fa' ? 'تکمیل بودن' : 'Completeness',
      score: 98.2,
      status: 'excellent',
      icon: 'Database',
      color: 'green'
    },
    {
      metric: currentLanguage === 'fa' ? 'دقت ورودی' : 'Input Accuracy',
      score: 94.5,
      status: 'good',
      icon: 'Target',
      color: 'blue'
    },
    {
      metric: currentLanguage === 'fa' ? 'سازگاری' : 'Consistency',
      score: 92.1,
      status: 'good',
      icon: 'Shield',
      color: 'blue'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-clinical-md">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value?.toFixed(1)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="card-clinical p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-medium">
              {currentLanguage === 'fa' ? 'عالی' : 'Excellent'}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {currentLanguage === 'fa' ? 'دقت مدل' : 'Model Accuracy'}
            </h3>
            <p className="text-2xl font-bold text-foreground">{performance?.modelAccuracy || 94.7}%</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? '+1.2% هفته گذشته' : '+1.2% last week'}
            </p>
          </div>
        </div>

        <div className="card-clinical p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} className="text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">
              {currentLanguage === 'fa' ? 'خوب' : 'Good'}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {currentLanguage === 'fa' ? 'دقت تشخیص' : 'Precision'}
            </h3>
            <p className="text-2xl font-bold text-foreground">92.7%</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? '+0.6% هفته گذشته' : '+0.6% last week'}
            </p>
          </div>
        </div>

        <div className="card-clinical p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Icon name="Search" size={20} className="text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 font-medium">
              {currentLanguage === 'fa' ? 'خوب' : 'Good'}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {currentLanguage === 'fa' ? 'بازخوانی' : 'Recall'}
            </h3>
            <p className="text-2xl font-bold text-foreground">94.1%</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? '+0.3% هفته گذشته' : '+0.3% last week'}
            </p>
          </div>
        </div>

        <div className="card-clinical p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-orange-600" />
            </div>
            <span className="text-xs text-orange-600 font-medium">
              {currentLanguage === 'fa' ? 'خوب' : 'Good'}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {currentLanguage === 'fa' ? 'امتیاز F1' : 'F1 Score'}
            </h3>
            <p className="text-2xl font-bold text-foreground">93.4%</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? '+0.6% هفته گذشته' : '+0.6% last week'}
            </p>
          </div>
        </div>
      </div>
      {/* ROC/PR Curves and Accuracy Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ROC Curve */}
        <div className="card-clinical p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'منحنی ROC' : 'ROC Curve'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentLanguage === 'fa' ? 'تحلیل عملکرد تشخیص' : 'Classification performance analysis'}
              </p>
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">AUC</span>
              <span className="text-lg font-bold text-primary">0.947</span>
            </div>
          </div>
          
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="fpr" 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: currentLanguage === 'fa' ? 'نرخ مثبت کاذب' : 'False Positive Rate', 
                    position: 'insideBottom', 
                    offset: -5 
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: currentLanguage === 'fa' ? 'نرخ مثبت درست' : 'True Positive Rate', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tpr"
                  stroke="#2563EB"
                  fill="#2563EB"
                  fillOpacity={0.1}
                  strokeWidth={3}
                />
                {/* Diagonal reference line */}
                <Line
                  dataKey="fpr"
                  stroke="#94A3B8"
                  strokeDasharray="5,5"
                  strokeWidth={1}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Trends */}
        <div className="card-clinical p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground font-heading">
                {currentLanguage === 'fa' ? 'روند دقت' : 'Accuracy Trends'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentLanguage === 'fa' ? 'تحلیل روند هفتگی عملکرد' : 'Weekly performance trend analysis'}
              </p>
            </div>
            <Icon name="TrendingUp" size={24} className="text-muted-foreground" />
          </div>
          
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={accuracyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value)?.toLocaleDateString()}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  name={currentLanguage === 'fa' ? 'دقت' : 'Accuracy'}
                />
                <Line 
                  type="monotone" 
                  dataKey="precision" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name={currentLanguage === 'fa' ? 'دقت تشخیص' : 'Precision'}
                />
                <Line 
                  type="monotone" 
                  dataKey="recall" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name={currentLanguage === 'fa' ? 'بازخوانی' : 'Recall'}
                />
                <Line 
                  type="monotone" 
                  dataKey="f1Score" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name={currentLanguage === 'fa' ? 'امتیاز F1' : 'F1 Score'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Data Quality Assessment */}
      <div className="card-clinical p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'ارزیابی کیفیت داده' : 'Data Quality Assessment'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentLanguage === 'fa' ? 'بررسی کیفیت داده‌های ورودی و خروجی مدل' : 'Input and output data quality monitoring'}
            </p>
          </div>
          <Icon name="Database" size={24} className="text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {dataQualityMetrics?.map((item, index) => (
            <div key={index} className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Icon name={item?.icon} size={20} className={`text-${item?.color}-600`} />
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item?.status)}`}>
                  {item?.score}%
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  {item?.metric}
                </h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${item?.color}-500`}
                    style={{ width: `${item?.score}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentLanguage === 'fa' ? 'وضعیت فعلی' : 'Current status'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-clinical p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
            <h3 className="text-lg font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'هشدارهای عملکرد' : 'Performance Alerts'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Icon name="Clock" size={16} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {currentLanguage === 'fa' ? 'افت جزئی در دقت هفته گذشته': 'Minor accuracy drop last week'
                  }
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {currentLanguage === 'fa' ? 'دقت مدل از 95.1% به 94.9% کاهش یافته': 'Model accuracy decreased from 95.1% to 94.9%'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {currentLanguage === 'fa' ? 'به‌روزرسانی مدل پیشنهادی': 'Model update recommended'
                  }
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {currentLanguage === 'fa' ? 'با داده‌های جدید، به‌روزرسانی مدل تا 2 هفته دیگر': 'With new data, model update due in 2 weeks'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-clinical p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Icon name="Lightbulb" size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? 'توصیه‌های بهبود' : 'Improvement Recommendations'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-green-50 border border-green-200 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  {currentLanguage === 'fa' ? 'افزایش تعداد نمونه‌های آموزشی': 'Increase training samples'
                  }
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {currentLanguage === 'fa' ? 'جمع‌آوری 200 نمونه بیشتر برای بهبود دقت': 'Collect 200+ more samples to improve accuracy'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <Icon name="Settings" size={16} className="text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-800">
                  {currentLanguage === 'fa' ? 'تنظیم مجدد پارامترهای مدل': 'Re-tune model parameters'
                  }
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  {currentLanguage === 'fa' ? 'بهینه‌سازی آستانه‌های تشخیص برای بهتر شدن F1': 'Optimize classification thresholds for better F1'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformanceMonitoring;