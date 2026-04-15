import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
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
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/login-test-data", element: _jsx(LoginTestDataPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/doctors", element: _jsx(DoctorsPage, {}) }), _jsx(Route, { path: "/doctor/:id", element: _jsx(DoctorDetailPage, {}) }), _jsx(Route, { path: "/guide", element: _jsx(GuidePage, {}) }), _jsx(Route, { path: "/consultation", element: _jsx(ConsultationPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/welcome", element: _jsx(WelcomePage, {}) }), _jsx(Route, { path: "/account-review", element: _jsx(AccountReviewPage, {}) }), _jsx(Route, { path: "/conditions-utilisation", element: _jsx(ConditionsPage, {}) }), _jsx(Route, { path: "/politique-confidentialite", element: _jsx(PolitiquePage, {}) }), _jsx(Route, { path: "/paramedical", element: _jsx(ParamedicalPage, {}) }), _jsx(Route, { path: "/paramedical/product/:id", element: _jsx(ParamedicalProductPage, {}) }), _jsx(Route, { path: "/services-medicaux", element: _jsx(ServicesMediauxPage, {}) }), _jsx(Route, { path: "/services-medicaux/:id", element: _jsx(ServiceMedicalDetailPage, {}) }), _jsx(Route, { path: "/labos-radiologie", element: _jsx(LabosRadiologiePage, {}) }), _jsx(Route, { path: "/labos-radiologie/:id", element: _jsx(LaboDetailPage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPage, {}) }), _jsx(Route, { path: "/admin/users", element: _jsx(AdminUsersPage, {}) }), _jsx(Route, { path: "/admin/pending", element: _jsx(AdminPendingPage, {}) }), _jsx(Route, { path: "/admin/suspended", element: _jsx(AdminSuspendedPage, {}) }), _jsx(Route, { path: "/admin/stats", element: _jsx(AdminStatsPage, {}) }), _jsx(Route, { path: "/admin/settings", element: _jsx(AdminSettingsPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/dashboard/appointments", element: _jsx(DashboardAppointmentsPage, {}) }), _jsx(Route, { path: "/dashboard/consultations", element: _jsx(DashboardConsultationsPage, {}) }), _jsx(Route, { path: "/dashboard/live-consultation", element: _jsx(PatientLiveConsultationPage, {}) }), _jsx(Route, { path: "/dashboard/find-doctor", element: _jsx(DashboardFindDoctorPage, {}) }), _jsx(Route, { path: "/dashboard/medical-history", element: _jsx(DashboardMedicalHistoryPage, {}) }), _jsx(Route, { path: "/dashboard/medical-records", element: _jsx(DashboardMedicalRecordsPage, {}) }), _jsx(Route, { path: "/dashboard/notifications", element: _jsx(DashboardNotificationsPage, {}) }), _jsx(Route, { path: "/dashboard/prescriptions", element: _jsx(DashboardPrescriptionsPage, {}) }), _jsx(Route, { path: "/dashboard/settings", element: _jsx(DashboardSettingsPage, {}) }), _jsx(Route, { path: "/dashboard/messages", element: _jsx(DashboardMessagesPage, {}) }), _jsx(Route, { path: "/doctor-dashboard", element: _jsx(DoctorDashboardPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/agenda", element: _jsx(DoctorAgendaPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/consultations", element: _jsx(DoctorConsultationsPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/live-consultation", element: _jsx(LiveConsultationPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/patients", element: _jsx(DoctorPatientsPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/prescriptions", element: _jsx(DoctorPrescriptionsPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/revenue", element: _jsx(DoctorRevenuePage, {}) }), _jsx(Route, { path: "/doctor-dashboard/reviews", element: _jsx(DoctorReviewsPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/settings", element: _jsx(DoctorSettingsPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/messaging", element: _jsx(DoctorMessagingPage, {}) }), _jsx(Route, { path: "/doctor-dashboard/patient-dossier/:patientId", element: _jsx(PatientDossierPage, {}) }), _jsx(Route, { path: "/pharmacy", element: _jsx(PharmacyPage, {}) }), _jsx(Route, { path: "/pharmacy/chat", element: _jsx(PharmacyChatPage, {}) }), _jsx(Route, { path: "/pharmacy/medicine/:id", element: _jsx(PharmacyMedicineDetailPage, {}) }), _jsx(Route, { path: "/pharmacy/prescription-scanner", element: _jsx(PharmacyPrescriptionScannerPage, {}) }), _jsx(Route, { path: "/pharmacy/prescriptions", element: _jsx(PharmacyPrescriptionsPage, {}) }), _jsx(Route, { path: "/pharmacy-dashboard", element: _jsx(PharmacyDashboardPage, {}) }), _jsx(Route, { path: "/pharmacy-dashboard/orders", element: _jsx(PharmacyDashboardOrdersPage, {}) }), _jsx(Route, { path: "/pharmacy-dashboard/sales", element: _jsx(PharmacyDashboardSalesPage, {}) }), _jsx(Route, { path: "/pharmacy-dashboard/stock", element: _jsx(PharmacyDashboardStockPage, {}) }), _jsx(Route, { path: "/lab-dashboard", element: _jsx(LabDashboardPage, {}) }), _jsx(Route, { path: "/lab-dashboard/results", element: _jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: _jsx(LabResultsPage, {}) }) }), _jsx(Route, { path: "/lab-dashboard/tests", element: _jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: _jsx(LabTestsPage, {}) }) }), _jsx(Route, { path: "/medical-service-dashboard", element: _jsx(MedicalServiceDashboardPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/analytics", element: _jsx(MedicalServiceAnalyticsPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/billing", element: _jsx(MedicalServiceBillingPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/equipment", element: _jsx(MedicalServiceEquipmentPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/messaging", element: _jsx(MedicalServiceMessagingPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/patients", element: _jsx(MedicalServicePatientsPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/prescriptions", element: _jsx(MedicalServicePrescriptionsPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/schedule", element: _jsx(MedicalServiceSchedulePage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/settings", element: _jsx(MedicalServiceSettingsPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/team", element: _jsx(MedicalServiceTeamPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/teleconsultation", element: _jsx(MedicalServiceTeleconsultationPage, {}) }), _jsx(Route, { path: "/medical-service-dashboard/vitals", element: _jsx(MedicalServiceVitalsPage, {}) }), _jsx(Route, { path: "/paramedical-dashboard", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalDashboardPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/appointments", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalAppointmentsPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/care-record", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalCareRecordPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/map", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalMapPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/messaging", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalMessagingPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/notifications", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalNotificationsPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/patients", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalPatientsPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/planning", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalPlanningPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/reports", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalReportsPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/settings", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalSettingsPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/supplies", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalSuppliesPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/teleconsultation", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalTeleconsultationPage, {}) }) }), _jsx(Route, { path: "/paramedical-dashboard/vitals", element: _jsx(ProtectedRoute, { requiredRole: "paramedical", children: _jsx(ParamedicalVitalsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }));
}
