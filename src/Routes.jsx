import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PatientRegistration from './pages/patient-registration';
import AssessmentResults from './pages/assessment-results';
import PatientProfile from './pages/patient-profile';
import PatientLogin from './pages/patient-login';
import MultiStepAssessment from './pages/multi-step-assessment';
import AdminDashboard from './pages/admin-dashboard';
import QuestionnaireManagement from './pages/questionnaire-management';
import QuestionnaireEditor from './pages/questionnaire-editor';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AssessmentResults />} />
        <Route path="/patient-registration" element={<PatientRegistration />} />
        <Route path="/assessment-results" element={<AssessmentResults />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/multi-step-assessment" element={<MultiStepAssessment />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/questionnaire-management" element={<QuestionnaireManagement />} />
        <Route path="/questionnaire-editor/:id" element={<QuestionnaireEditor />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;