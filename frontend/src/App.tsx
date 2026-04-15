import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import HomePage from "@/src/pages/HomePage";
import LoginPage from "@/src/pages/login/LoginPage";
import LoginTestDataPage from "@/src/pages/login-test-data/LoginTestDataPage";
import RegisterPage from "@/src/pages/register/RegisterPage";
import DoctorsPage from "@/src/pages/doctors/DoctorsPage";
import GuidePage from "@/src/pages/guide/GuidePage";
import ConsultationPage from "@/src/pages/consultation/ConsultationPage";
import ProfilePage from "@/src/pages/profile/ProfilePage";
import WelcomePage from "@/src/pages/welcome/WelcomePage";
import AccountReviewPage from "@/src/pages/account-review/AccountReviewPage";
import NotFoundPage from "@/src/pages/NotFoundPage";
import ConditionsPage from "@/src/pages/conditions-utilisation/ConditionsPage";
import PolitiquePage from "@/src/pages/politique-confidentialite/PolitiquePage";
import ParamedicalPage from "@/src/pages/paramedical/ParamedicalPage";
import ParamedicalProductPage from "@/src/pages/paramedical/product/ParamedicalProductPage";
import ServicesMediauxPage from "@/src/pages/services-medicaux/ServicesMediauxPage";
import ServiceMedicalDetailPage from "@/src/pages/services-medicaux/[id]/ServiceMedicalDetailPage";
import LabosRadiologiePage from "@/src/pages/labos-radiologie/LabosRadiologiePage";
import LaboDetailPage from "@/src/pages/labos-radiologie/[id]/LaboDetailPage";

// Doctor profile (dynamic)
import DoctorDetailPage from "@/src/pages/doctor/[id]/DoctorDetailPage";

// Admin
import AdminPage from "@/src/pages/admin/AdminPage";
import AdminUsersPage from "@/src/pages/admin/users/AdminUsersPage";
import AdminPendingPage from "@/src/pages/admin/pending/AdminPendingPage";
import AdminSuspendedPage from "@/src/pages/admin/suspended/AdminSuspendedPage";
import AdminStatsPage from "@/src/pages/admin/stats/AdminStatsPage";
import AdminSettingsPage from "@/src/pages/admin/settings/AdminSettingsPage";

// Patient dashboard
import DashboardPage from "@/src/pages/dashboard/DashboardPage";
import DashboardAppointmentsPage from "@/src/pages/dashboard/appointments/AppointmentsPage";
import DashboardConsultationsPage from "@/src/pages/dashboard/consultations/ConsultationsPage";
import PatientLiveConsultationPage from "@/src/pages/dashboard/consultations/PatientLiveConsultationPage";
import DashboardFindDoctorPage from "@/src/pages/dashboard/find-doctor/FindDoctorPage";
import DashboardMedicalHistoryPage from "@/src/pages/dashboard/medical-history/MedicalHistoryPage";
import DashboardMedicalRecordsPage from "@/src/pages/dashboard/medical-records/MedicalRecordsPage";
import DashboardNotificationsPage from "@/src/pages/dashboard/notifications/NotificationsPage";
import DashboardPrescriptionsPage from "@/src/pages/dashboard/prescriptions/PrescriptionsPage";
import DashboardSettingsPage from "@/src/pages/dashboard/settings/SettingsPage";
import DashboardMessagesPage from "@/src/pages/dashboard/messages/PatientMessagesPage";

// Doctor dashboard
import DoctorDashboardPage from "@/src/pages/doctor-dashboard/DoctorDashboardPage";
import DoctorAgendaPage from "@/src/pages/doctor-dashboard/agenda/AgendaPage";
import DoctorConsultationsPage from "@/src/pages/doctor-dashboard/consultations/DoctorConsultationsPage";
import LiveConsultationPage from "@/src/pages/doctor-dashboard/consultations/LiveConsultationPage";
import DoctorPatientsPage from "@/src/pages/doctor-dashboard/patients/DoctorPatientsPage";
import DoctorPrescriptionsPage from "@/src/pages/doctor-dashboard/prescriptions/DoctorPrescriptionsPage";
import DoctorRevenuePage from "@/src/pages/doctor-dashboard/revenue/RevenuePage";
import DoctorReviewsPage from "@/src/pages/doctor-dashboard/reviews/ReviewsPage";
import DoctorSettingsPage from "@/src/pages/doctor-dashboard/settings/DoctorSettingsPage";
import DoctorMessagingPage from "@/src/pages/doctor-dashboard/messaging/DoctorMessagingPage";
import PatientDossierPage from "@/src/pages/doctor-dashboard/patient-dossier/PatientDossierPage";

// Pharmacy pages
import PharmacyPage from "@/src/pages/pharmacy/PharmacyPage";
import PharmacyChatPage from "@/src/pages/pharmacy/chat/PharmacyChatPage";
import PharmacyMedicineDetailPage from "@/src/pages/pharmacy/medicine/[id]/MedicineDetailPage";
import PharmacyPrescriptionScannerPage from "@/src/pages/pharmacy/prescription-scanner/PrescriptionScannerPage";
import PharmacyPrescriptionsPage from "@/src/pages/pharmacy/prescriptions/PharmacyPrescriptionsPage";

// Pharmacy dashboard
import PharmacyDashboardPage from "@/src/pages/pharmacy-dashboard/PharmacyDashboardPage";
import PharmacyDashboardOrdersPage from "@/src/pages/pharmacy-dashboard/orders/PharmacyDashboardOrdersPage";
import PharmacyDashboardSalesPage from "@/src/pages/pharmacy-dashboard/sales/SalesPage";
import PharmacyDashboardStockPage from "@/src/pages/pharmacy-dashboard/stock/StockPage";

// Lab dashboard
import LabDashboardPage from "@/src/pages/lab-dashboard/LabDashboardPage";
import LabResultsPage from "@/src/pages/lab-dashboard/results/LabResultsPage";
import LabTestsPage from "@/src/pages/lab-dashboard/tests/LabTestsPage";

// Medical service dashboard
import MedicalServiceDashboardPage from "@/src/pages/medical-service-dashboard/MedicalServiceDashboardPage";
import MedicalServiceAnalyticsPage from "@/src/pages/medical-service-dashboard/analytics/AnalyticsPage";
import MedicalServiceBillingPage from "@/src/pages/medical-service-dashboard/billing/BillingPage";
import MedicalServiceEquipmentPage from "@/src/pages/medical-service-dashboard/equipment/EquipmentPage";
import MedicalServiceMessagingPage from "@/src/pages/medical-service-dashboard/messaging/MessagingPage";
import MedicalServicePatientsPage from "@/src/pages/medical-service-dashboard/patients/MedicalServicePatientsPage";
import MedicalServicePrescriptionsPage from "@/src/pages/medical-service-dashboard/prescriptions/MedicalServicePrescriptionsPage";
import MedicalServiceSchedulePage from "@/src/pages/medical-service-dashboard/schedule/SchedulePage";
import MedicalServiceSettingsPage from "@/src/pages/medical-service-dashboard/settings/MedicalServiceSettingsPage";
import MedicalServiceTeamPage from "@/src/pages/medical-service-dashboard/team/TeamPage";
import MedicalServiceTeleconsultationPage from "@/src/pages/medical-service-dashboard/teleconsultation/TeleconsultationPage";
import MedicalServiceVitalsPage from "@/src/pages/medical-service-dashboard/vitals/VitalsPage";

// Paramedical dashboard
import ParamedicalDashboardPage from "@/src/pages/paramedical-dashboard/ParamedicalDashboardPage";
import ParamedicalAppointmentsPage from "@/src/pages/paramedical-dashboard/appointments/ParamedicalAppointmentsPage";
import ParamedicalCareRecordPage from "@/src/pages/paramedical-dashboard/care-record/CareRecordPage";
import ParamedicalMapPage from "@/src/pages/paramedical-dashboard/map/MapPage";
import ParamedicalMessagingPage from "@/src/pages/paramedical-dashboard/messaging/ParamedicalMessagingPage";
import ParamedicalNotificationsPage from "@/src/pages/paramedical-dashboard/notifications/ParamedicalNotificationsPage";
import ParamedicalPatientsPage from "@/src/pages/paramedical-dashboard/patients/ParamedicalPatientsPage";
import ParamedicalPlanningPage from "@/src/pages/paramedical-dashboard/planning/PlanningPage";
import ParamedicalReportsPage from "@/src/pages/paramedical-dashboard/reports/ReportsPage";
import ParamedicalSettingsPage from "@/src/pages/paramedical-dashboard/settings/ParamedicalSettingsPage";
import ParamedicalSuppliesPage from "@/src/pages/paramedical-dashboard/supplies/SuppliesPage";
import ParamedicalTeleconsultationPage from "@/src/pages/paramedical-dashboard/teleconsultation/ParamedicalTeleconsultationPage";
import ParamedicalVitalsPage from "@/src/pages/paramedical-dashboard/vitals/ParamedicalVitalsPage";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-test-data" element={<LoginTestDataPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/doctor/:id" element={<DoctorDetailPage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/consultation" element={<ConsultationPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/account-review" element={<AccountReviewPage />} />
      <Route path="/conditions-utilisation" element={<ConditionsPage />} />
      <Route path="/politique-confidentialite" element={<PolitiquePage />} />

      {/* Paramédicaux — catalogue & détail produit */}
      <Route path="/paramedical" element={<ParamedicalPage />} />
      <Route
        path="/paramedical/product/:id"
        element={<ParamedicalProductPage />}
      />

      {/* Services Médicaux — listing & detail */}
      <Route path="/services-medicaux" element={<ServicesMediauxPage />} />
      <Route
        path="/services-medicaux/:id"
        element={<ServiceMedicalDetailPage />}
      />

      {/* Labos & Radiologie — listing & detail */}
      <Route path="/labos-radiologie" element={<LabosRadiologiePage />} />
      <Route path="/labos-radiologie/:id" element={<LaboDetailPage />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/pending" element={<ProtectedRoute requiredRole="admin"><AdminPendingPage /></ProtectedRoute>} />
      <Route path="/admin/suspended" element={<ProtectedRoute requiredRole="admin"><AdminSuspendedPage /></ProtectedRoute>} />
      <Route path="/admin/stats" element={<ProtectedRoute requiredRole="admin"><AdminStatsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettingsPage /></ProtectedRoute>} />

      {/* Patient dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute requiredRole="patient"><DashboardPage /></ProtectedRoute>} />
      <Route
        path="/dashboard/appointments"
        element={<ProtectedRoute requiredRole="patient"><DashboardAppointmentsPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/consultations"
        element={<ProtectedRoute requiredRole="patient"><DashboardConsultationsPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/live-consultation"
        element={<ProtectedRoute requiredRole="patient"><PatientLiveConsultationPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/find-doctor"
        element={<ProtectedRoute requiredRole="patient"><DashboardFindDoctorPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/medical-history"
        element={<ProtectedRoute requiredRole="patient"><DashboardMedicalHistoryPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/medical-records"
        element={<ProtectedRoute requiredRole="patient"><DashboardMedicalRecordsPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/notifications"
        element={<ProtectedRoute requiredRole="patient"><DashboardNotificationsPage /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/prescriptions"
        element={<ProtectedRoute requiredRole="patient"><DashboardPrescriptionsPage /></ProtectedRoute>}
      />
      <Route path="/dashboard/settings" element={<ProtectedRoute requiredRole="patient"><DashboardSettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/messages" element={<ProtectedRoute requiredRole="patient"><DashboardMessagesPage /></ProtectedRoute>} />

      {/* Doctor dashboard */}
      <Route path="/doctor-dashboard" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboardPage /></ProtectedRoute>} />
      <Route path="/doctor-dashboard/agenda" element={<ProtectedRoute requiredRole="doctor"><DoctorAgendaPage /></ProtectedRoute>} />
      <Route
        path="/doctor-dashboard/consultations"
        element={<ProtectedRoute requiredRole="doctor"><DoctorConsultationsPage /></ProtectedRoute>}
      />
      <Route
        path="/doctor-dashboard/live-consultation"
        element={<ProtectedRoute requiredRole="doctor"><LiveConsultationPage /></ProtectedRoute>}
      />
      <Route
        path="/doctor-dashboard/patients"
        element={<ProtectedRoute requiredRole="doctor"><DoctorPatientsPage /></ProtectedRoute>}
      />
      <Route
        path="/doctor-dashboard/prescriptions"
        element={<ProtectedRoute requiredRole="doctor"><DoctorPrescriptionsPage /></ProtectedRoute>}
      />
      <Route path="/doctor-dashboard/revenue" element={<ProtectedRoute requiredRole="doctor"><DoctorRevenuePage /></ProtectedRoute>} />
      <Route path="/doctor-dashboard/reviews" element={<ProtectedRoute requiredRole="doctor"><DoctorReviewsPage /></ProtectedRoute>} />
      <Route
        path="/doctor-dashboard/settings"
        element={<ProtectedRoute requiredRole="doctor"><DoctorSettingsPage /></ProtectedRoute>}
      />
      <Route
        path="/doctor-dashboard/messaging"
        element={<ProtectedRoute requiredRole="doctor"><DoctorMessagingPage /></ProtectedRoute>}
      />
      <Route
        path="/doctor-dashboard/patient-dossier/:patientId"
        element={<ProtectedRoute requiredRole="doctor"><PatientDossierPage /></ProtectedRoute>}
      />

      {/* Pharmacy (reservation only — no cart/checkout/orders) */}
      <Route path="/pharmacy" element={<PharmacyPage />} />
      <Route path="/pharmacy/chat" element={<PharmacyChatPage />} />
      <Route
        path="/pharmacy/medicine/:id"
        element={<PharmacyMedicineDetailPage />}
      />
      <Route
        path="/pharmacy/prescription-scanner"
        element={<PharmacyPrescriptionScannerPage />}
      />
      <Route
        path="/pharmacy/prescriptions"
        element={<PharmacyPrescriptionsPage />}
      />

      {/* Pharmacy dashboard */}
      <Route path="/pharmacy-dashboard" element={<ProtectedRoute requiredRole="pharmacy"><PharmacyDashboardPage /></ProtectedRoute>} />
      <Route
        path="/pharmacy-dashboard/orders"
        element={<ProtectedRoute requiredRole="pharmacy"><PharmacyDashboardOrdersPage /></ProtectedRoute>}
      />
      <Route
        path="/pharmacy-dashboard/sales"
        element={<ProtectedRoute requiredRole="pharmacy"><PharmacyDashboardSalesPage /></ProtectedRoute>}
      />
      <Route
        path="/pharmacy-dashboard/stock"
        element={<ProtectedRoute requiredRole="pharmacy"><PharmacyDashboardStockPage /></ProtectedRoute>}
      />

      {/* Lab dashboard */}
      <Route path="/lab-dashboard" element={<ProtectedRoute requiredRole="lab_radiology"><LabDashboardPage /></ProtectedRoute>} />
      <Route
        path="/lab-dashboard/results"
        element={
          <ProtectedRoute requiredRole="lab_radiology">
            <LabResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab-dashboard/tests"
        element={
          <ProtectedRoute requiredRole="lab_radiology">
            <LabTestsPage />
          </ProtectedRoute>
        }
      />

      {/* Medical service dashboard */}
      <Route
        path="/medical-service-dashboard"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceDashboardPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/analytics"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceAnalyticsPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/billing"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceBillingPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/equipment"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceEquipmentPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/messaging"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceMessagingPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/patients"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServicePatientsPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/prescriptions"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServicePrescriptionsPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/schedule"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceSchedulePage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/settings"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceSettingsPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/team"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceTeamPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/teleconsultation"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceTeleconsultationPage /></ProtectedRoute>}
      />
      <Route
        path="/medical-service-dashboard/vitals"
        element={<ProtectedRoute requiredRole="medical_service"><MedicalServiceVitalsPage /></ProtectedRoute>}
      />

      {/* Paramedical dashboard */}
      <Route
        path="/paramedical-dashboard"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/appointments"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/care-record"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalCareRecordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/map"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalMapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/messaging"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalMessagingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/notifications"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalNotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/patients"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalPatientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/planning"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalPlanningPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/reports"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/settings"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/supplies"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalSuppliesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/teleconsultation"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalTeleconsultationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paramedical-dashboard/vitals"
        element={
          <ProtectedRoute requiredRole="paramedical">
            <ParamedicalVitalsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
