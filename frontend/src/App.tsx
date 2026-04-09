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
import DashboardFindDoctorPage from "@/src/pages/dashboard/find-doctor/FindDoctorPage";
import DashboardMedicalHistoryPage from "@/src/pages/dashboard/medical-history/MedicalHistoryPage";
import DashboardMedicalRecordsPage from "@/src/pages/dashboard/medical-records/MedicalRecordsPage";
import DashboardNotificationsPage from "@/src/pages/dashboard/notifications/NotificationsPage";
import DashboardOrdersPage from "@/src/pages/dashboard/orders/OrdersPage";
import DashboardPrescriptionsPage from "@/src/pages/dashboard/prescriptions/PrescriptionsPage";
import DashboardSettingsPage from "@/src/pages/dashboard/settings/SettingsPage";

// Doctor dashboard
import DoctorDashboardPage from "@/src/pages/doctor-dashboard/DoctorDashboardPage";
import DoctorAgendaPage from "@/src/pages/doctor-dashboard/agenda/AgendaPage";
import DoctorConsultationsPage from "@/src/pages/doctor-dashboard/consultations/DoctorConsultationsPage";
import DoctorPatientsPage from "@/src/pages/doctor-dashboard/patients/DoctorPatientsPage";
import DoctorPrescriptionsPage from "@/src/pages/doctor-dashboard/prescriptions/DoctorPrescriptionsPage";
import DoctorRevenuePage from "@/src/pages/doctor-dashboard/revenue/RevenuePage";
import DoctorReviewsPage from "@/src/pages/doctor-dashboard/reviews/ReviewsPage";
import DoctorSettingsPage from "@/src/pages/doctor-dashboard/settings/DoctorSettingsPage";

// Pharmacy pages
import PharmacyPage from "@/src/pages/pharmacy/PharmacyPage";
import PharmacyCartPage from "@/src/pages/pharmacy/cart/CartPage";
import PharmacyChatPage from "@/src/pages/pharmacy/chat/PharmacyChatPage";
import PharmacyCheckoutPage from "@/src/pages/pharmacy/checkout/CheckoutPage";
import PharmacyMedicineDetailPage from "@/src/pages/pharmacy/medicine/[id]/MedicineDetailPage";
import PharmacyOrderDetailPage from "@/src/pages/pharmacy/order/[id]/OrderDetailPage";
import PharmacyOrdersPage from "@/src/pages/pharmacy/orders/PharmacyOrdersPage";
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

      {/* Redirects */}
      <Route path="/how-it-works" element={<Navigate to="/guide" replace />} />
      <Route path="/pricing" element={<Navigate to="/guide" replace />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/pending" element={<AdminPendingPage />} />
      <Route path="/admin/suspended" element={<AdminSuspendedPage />} />
      <Route path="/admin/stats" element={<AdminStatsPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />

      {/* Patient dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/dashboard/appointments"
        element={<DashboardAppointmentsPage />}
      />
      <Route
        path="/dashboard/consultations"
        element={<DashboardConsultationsPage />}
      />
      <Route
        path="/dashboard/find-doctor"
        element={<DashboardFindDoctorPage />}
      />
      <Route
        path="/dashboard/medical-history"
        element={<DashboardMedicalHistoryPage />}
      />
      <Route
        path="/dashboard/medical-records"
        element={<DashboardMedicalRecordsPage />}
      />
      <Route
        path="/dashboard/notifications"
        element={<DashboardNotificationsPage />}
      />
      <Route path="/dashboard/orders" element={<DashboardOrdersPage />} />
      <Route
        path="/dashboard/prescriptions"
        element={<DashboardPrescriptionsPage />}
      />
      <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />

      {/* Doctor dashboard */}
      <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
      <Route path="/doctor-dashboard/agenda" element={<DoctorAgendaPage />} />
      <Route
        path="/doctor-dashboard/consultations"
        element={<DoctorConsultationsPage />}
      />
      <Route
        path="/doctor-dashboard/patients"
        element={<DoctorPatientsPage />}
      />
      <Route
        path="/doctor-dashboard/prescriptions"
        element={<DoctorPrescriptionsPage />}
      />
      <Route path="/doctor-dashboard/revenue" element={<DoctorRevenuePage />} />
      <Route path="/doctor-dashboard/reviews" element={<DoctorReviewsPage />} />
      <Route
        path="/doctor-dashboard/settings"
        element={<DoctorSettingsPage />}
      />

      {/* Pharmacy */}
      <Route path="/pharmacy" element={<PharmacyPage />} />
      <Route path="/pharmacy/cart" element={<PharmacyCartPage />} />
      <Route path="/pharmacy/chat" element={<PharmacyChatPage />} />
      <Route path="/pharmacy/checkout" element={<PharmacyCheckoutPage />} />
      <Route
        path="/pharmacy/medicine/:id"
        element={<PharmacyMedicineDetailPage />}
      />
      <Route path="/pharmacy/order/:id" element={<PharmacyOrderDetailPage />} />
      <Route path="/pharmacy/orders" element={<PharmacyOrdersPage />} />
      <Route
        path="/pharmacy/prescription-scanner"
        element={<PharmacyPrescriptionScannerPage />}
      />
      <Route
        path="/pharmacy/prescriptions"
        element={<PharmacyPrescriptionsPage />}
      />

      {/* Pharmacy dashboard */}
      <Route path="/pharmacy-dashboard" element={<PharmacyDashboardPage />} />
      <Route
        path="/pharmacy-dashboard/orders"
        element={<PharmacyDashboardOrdersPage />}
      />
      <Route
        path="/pharmacy-dashboard/sales"
        element={<PharmacyDashboardSalesPage />}
      />
      <Route
        path="/pharmacy-dashboard/stock"
        element={<PharmacyDashboardStockPage />}
      />

      {/* Lab dashboard */}
      <Route path="/lab-dashboard" element={<LabDashboardPage />} />
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
        element={<MedicalServiceDashboardPage />}
      />
      <Route
        path="/medical-service-dashboard/analytics"
        element={<MedicalServiceAnalyticsPage />}
      />
      <Route
        path="/medical-service-dashboard/billing"
        element={<MedicalServiceBillingPage />}
      />
      <Route
        path="/medical-service-dashboard/equipment"
        element={<MedicalServiceEquipmentPage />}
      />
      <Route
        path="/medical-service-dashboard/messaging"
        element={<MedicalServiceMessagingPage />}
      />
      <Route
        path="/medical-service-dashboard/patients"
        element={<MedicalServicePatientsPage />}
      />
      <Route
        path="/medical-service-dashboard/prescriptions"
        element={<MedicalServicePrescriptionsPage />}
      />
      <Route
        path="/medical-service-dashboard/schedule"
        element={<MedicalServiceSchedulePage />}
      />
      <Route
        path="/medical-service-dashboard/settings"
        element={<MedicalServiceSettingsPage />}
      />
      <Route
        path="/medical-service-dashboard/team"
        element={<MedicalServiceTeamPage />}
      />
      <Route
        path="/medical-service-dashboard/teleconsultation"
        element={<MedicalServiceTeleconsultationPage />}
      />
      <Route
        path="/medical-service-dashboard/vitals"
        element={<MedicalServiceVitalsPage />}
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
