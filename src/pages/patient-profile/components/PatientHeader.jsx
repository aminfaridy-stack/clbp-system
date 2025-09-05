import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PatientHeader = ({ patient, onEdit, onSendReminder, onGenerateReport, currentLanguage }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: 'status-badge-success',
        icon: 'CheckCircle',
        text: currentLanguage === 'fa' ? 'فعال' : 'Active'
      },
      pending: {
        color: 'status-badge-warning',
        icon: 'Clock',
        text: currentLanguage === 'fa' ? 'در انتظار' : 'Pending'
      },
      completed: {
        color: 'status-badge-success',
        icon: 'Check',
        text: currentLanguage === 'fa' ? 'تکمیل شده' : 'Completed'
      }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`status-badge ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />
        {config?.text}
      </span>
    );
  };

  return (
    <div className="card-clinical-elevated p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Patient Info */}
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
          <div className="relative">
            <Image
              src={patient?.avatar}
              alt={patient?.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
            />
            <div className="absolute -bottom-1 -right-1 rtl:-left-1 rtl:-right-auto">
              {getStatusBadge(patient?.status)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <h1 className="text-2xl font-bold text-foreground font-heading">
                {patient?.name}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                iconName="Edit2"
                className="opacity-60 hover:opacity-100"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Icon name="Calendar" size={14} />
                <span>
                  {currentLanguage === 'fa' ? 'سن:' : 'Age:'} {patient?.age} {currentLanguage === 'fa' ? 'سال' : 'years'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Icon name="User" size={14} />
                <span>
                  {currentLanguage === 'fa' ? 'جنسیت:' : 'Gender:'} {patient?.gender}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Icon name="Phone" size={14} />
                <span>{patient?.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                <Icon name="Mail" size={14} />
                <span className="truncate">{patient?.email}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center space-x-2 rtl:space-x-reverse">
              <Icon name="MapPin" size={14} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{patient?.address}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
          <Button
            variant="default"
            onClick={onSendReminder}
            iconName="Send"
            iconPosition="left"
            className="w-full"
          >
            {currentLanguage === 'fa' ? 'ارسال یادآوری' : 'Send Reminder'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onGenerateReport}
            iconName="FileText"
            iconPosition="left"
            className="w-full"
          >
            {currentLanguage === 'fa' ? 'تولید گزارش' : 'Generate Report'}
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => {}}
            iconName="Calendar"
            iconPosition="left"
            className="w-full"
          >
            {currentLanguage === 'fa' ? 'زمان‌بندی' : 'Schedule'}
          </Button>
        </div>
      </div>
      {/* Medical Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3 font-heading">
          {currentLanguage === 'fa' ? 'خلاصه پزشکی' : 'Medical Summary'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Icon name="Activity" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {currentLanguage === 'fa' ? 'وضعیت درد' : 'Pain Status'}
              </span>
            </div>
            <p className="text-lg font-bold text-primary">{patient?.painLevel}/10</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? 'آخرین ارزیابی' : 'Last Assessment'}
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Icon name="TrendingUp" size={16} className="text-therapeutic-green" />
              <span className="text-sm font-medium text-foreground">
                {currentLanguage === 'fa' ? 'ریسک مزمن' : 'Chronic Risk'}
              </span>
            </div>
            <p className="text-lg font-bold text-therapeutic-green">{patient?.chronicRisk}%</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? 'پیش‌بینی ML' : 'ML Prediction'}
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Icon name="Calendar" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">
                {currentLanguage === 'fa' ? 'مرحله فعلی' : 'Current Phase'}
              </span>
            </div>
            <p className="text-lg font-bold text-warning">{patient?.currentPhase}</p>
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'fa' ? 'روز باقی‌مانده: ۱۵' : 'Days remaining: 15'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;