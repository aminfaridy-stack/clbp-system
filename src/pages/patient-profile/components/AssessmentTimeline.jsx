import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentTimeline = ({ assessments, currentLanguage }) => {
  const [selectedPhase, setSelectedPhase] = useState('T0');

  const phases = [
    {
      id: 'T0',
      name: currentLanguage === 'fa' ? 'ارزیابی اولیه' : 'Initial Assessment',
      date: '2024-12-05',
      status: 'completed',
      completionRate: 100
    },
    {
      id: 'T1',
      name: currentLanguage === 'fa' ? 'ارزیابی یک‌ماهه' : 'One Month Follow-up',
      date: '2025-01-05',
      status: 'completed',
      completionRate: 90
    },
    {
      id: 'T2',
      name: currentLanguage === 'fa' ? 'ارزیابی سه‌ماهه' : 'Three Month Follow-up',
      date: '2025-03-05',
      status: 'pending',
      completionRate: 0
    }
  ];

  const getPhaseIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'in-progress':
        return { name: 'Clock', color: 'text-warning' };
      case 'pending':
        return { name: 'Circle', color: 'text-muted-foreground' };
      default:
        return { name: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const questionnaires = [
    { id: 'FABQ', name: 'Fear-Avoidance Beliefs', score: 45, maxScore: 96 },
    { id: 'PHQ9', name: 'Depression Scale', score: 8, maxScore: 27 },
    { id: 'PCS', name: 'Pain Catastrophizing', score: 22, maxScore: 52 },
    { id: 'TSK11', name: 'Kinesiophobia', score: 28, maxScore: 44 },
    { id: 'PSQI', name: 'Sleep Quality', score: 12, maxScore: 21 },
    { id: 'HPLP', name: 'Health Promoting Lifestyle', score: 135, maxScore: 208 },
    { id: 'RMDQ', name: 'Roland Morris Disability', score: 14, maxScore: 24 },
    { id: 'NRS', name: 'Numeric Rating Scale', score: 7, maxScore: 10 },
    { id: 'NMQ', name: 'Nordic Musculoskeletal', score: 6, maxScore: 9 },
    { id: 'LEFS', name: 'Lower Extremity Function', score: 52, maxScore: 80 }
  ];

  return (
    <div className="card-clinical p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'تاریخچه ارزیابی' : 'Assessment Timeline'}
        </h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          {currentLanguage === 'fa' ? 'دانلود تاریخچه' : 'Download History'}
        </Button>
      </div>
      {/* Timeline Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-8 rtl:space-x-reverse">
          {phases?.map((phase, index) => {
            const icon = getPhaseIcon(phase?.status);
            const isSelected = selectedPhase === phase?.id;
            
            return (
              <React.Fragment key={phase?.id}>
                <button
                  onClick={() => setSelectedPhase(phase?.id)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-clinical ${
                    isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-clinical ${
                    phase?.status === 'completed' ? 'bg-success border-success' :
                    phase?.status === 'in-progress'? 'bg-warning border-warning' : 'bg-background border-border'
                  }`}>
                    <Icon 
                      name={icon?.name} 
                      size={20} 
                      className={phase?.status === 'completed' ? 'text-white' : icon?.color}
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {phase?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{phase?.date}</p>
                    {phase?.completionRate > 0 && (
                      <p className="text-xs text-success font-medium">
                        {phase?.completionRate}% {currentLanguage === 'fa' ? 'تکمیل' : 'Complete'}
                      </p>
                    )}
                  </div>
                </button>
                {index < phases?.length - 1 && (
                  <div className={`h-0.5 w-16 ${
                    phases?.[index + 1]?.status === 'completed' ? 'bg-success' : 'bg-border'
                  } transition-clinical`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Assessment Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">
            {phases?.find(p => p?.id === selectedPhase)?.name} - {currentLanguage === 'fa' ? 'نتایج پرسشنامه' : 'Questionnaire Results'}
          </h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>{phases?.find(p => p?.id === selectedPhase)?.date}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionnaires?.map((questionnaire) => {
            const percentage = (questionnaire?.score / questionnaire?.maxScore) * 100;
            const riskLevel = percentage > 70 ? 'high' : percentage > 40 ? 'medium' : 'low';
            
            return (
              <div key={questionnaire?.id} className="bg-muted/30 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{questionnaire?.id}</h4>
                    <p className="text-xs text-muted-foreground">{questionnaire?.name}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    riskLevel === 'high' ? 'bg-error' :
                    riskLevel === 'medium'? 'bg-warning' : 'bg-success'
                  }`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground font-data">
                      {questionnaire?.score}/{questionnaire?.maxScore}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  
                  <div className="progress-clinical">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        riskLevel === 'high' ? 'bg-error' :
                        riskLevel === 'medium'? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssessmentTimeline;