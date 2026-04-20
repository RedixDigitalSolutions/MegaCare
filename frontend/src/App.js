import { jsx, jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "@/src/pages/HomePage";
import LoginPage from "@/src/pages/login/LoginPage";
import LoginTestDataPage from "@/src/pages/login-test-data/LoginTestDataPage";
import RegisterPage from "@/src/pages/register/RegisterPage";
import DoctorsPage from "@/src/pages/doctors/DoctorsPage";
import GuidePage from "@/src/pages/guide/GuidePage";
import ConsultationPage from "@/src/pages/consultation/ConsultationPage";
import WelcomePage from "@/src/pages/welcome/WelcomePage";
import AccountReviewPage from "@/src/pages/account-review/AccountReviewPage";
import NotFoundPage from "@/src/pages/NotFoundPage";
import ConditionsPage from "@/src/pages/conditions-utilisation/ConditionsPage";
import PolitiquePage from "@/src/pages/politique-confidentialite/PolitiquePage";
import AccessibilitePage from "@/src/pages/accessibilite/AccessibilitePage";
import ParamedicalPage from "@/src/pages/paramedical/ParamedicalPage";
import ParamedicalProductPage from "@/src/pages/paramedical/product/ParamedicalProductPage";
import ServicesMediauxPage from "@/src/pages/services-medicaux/ServicesMediauxPage";
import ServiceMedicalDetailPage from "@/src/pages/services-medicaux/[id]/ServiceMedicalDetailPage";
import LabosRadiologiePage from "@/src/pages/labos-radiologie/LabosRadiologiePage";
import LaboDetailPage from "@/src/pages/labos-radiologie/[id]/LaboDetailPage";
import DoctorDetailPage from "@/src/pages/doctor/[id]/DoctorDetailPage";
import AdminPage from "@/src/pages/admin/AdminPage";
import AdminUsersPage from "@/src/pages/admin/users/AdminUsersPage";
import AdminPendingPage from "@/src/pages/admin/pending/AdminPendingPage";
import AdminSuspendedPage from "@/src/pages/admin/suspended/AdminSuspendedPage";
import AdminStatsPage from "@/src/pages/admin/stats/AdminStatsPage";
import AdminSettingsPage from "@/src/pages/admin/settings/AdminSettingsPage";
import DashboardPage from "@/src/pages/dashboard/DashboardPage";
import DashboardAppointmentsPage from "@/src/pages/dashboard/appointments/AppointmentsPage";
import DashboardConsultationsPage from "@/src/pages/dashboard/consultations/ConsultationsPage";
import PatientLiveConsultationPage from "@/src/pages/dashboard/consultations/PatientLiveConsultationPage";
import DashboardMedicalRecordsPage from "@/src/pages/dashboard/medical-records/MedicalRecordsPage";
import DashboardNotificationsPage from "@/src/pages/dashboard/notifications/NotificationsPage";
import DashboardPrescriptionsPage from "@/src/pages/dashboard/prescriptions/PrescriptionsPage";
import DashboardProfilePage from "@/src/pages/dashboard/profile/ProfilePage";
import DashboardSettingsPage from "@/src/pages/dashboard/settings/SettingsPage";
import DashboardMessagesPage from "@/src/pages/dashboard/messages/PatientMessagesPage";
import DoctorDashboardPage from "@/src/pages/doctor-dashboard/DoctorDashboardPage";
import DoctorAgendaPage from "@/src/pages/doctor-dashboard/agenda/AgendaPage";
import DoctorConsultationsPage from "@/src/pages/doctor-dashboard/consultations/DoctorConsultationsPage";
import LiveConsultationPage from "@/src/pages/doctor-dashboard/consultations/LiveConsultationPage";
import DoctorPatientsPage from "@/src/pages/doctor-dashboard/patients/DoctorPatientsPage";
import DoctorPrescriptionsPage from "@/src/pages/doctor-dashboard/prescriptions/DoctorPrescriptionsPage";
import DoctorRevenuePage from "@/src/pages/doctor-dashboard/revenue/RevenuePage";
import DoctorSettingsPage from "@/src/pages/doctor-dashboard/settings/DoctorSettingsPage";
import DoctorMessagingPage from "@/src/pages/doctor-dashboard/messaging/DoctorMessagingPage";
import PatientDossierPage from "@/src/pages/doctor-dashboard/patient-dossier/PatientDossierPage";
import PharmacyPage from "@/src/pages/pharmacy/PharmacyPage";
import PharmacyDashboardPage from "@/src/pages/pharmacy-dashboard/PharmacyDashboardPage";
import PharmacyDashboardOrdersPage from "@/src/pages/pharmacy-dashboard/orders/PharmacyDashboardOrdersPage";
import PharmacySupplierOrdersPage from "@/src/pages/pharmacy-dashboard/supplier-orders/SupplierOrdersPage";
import PharmacyDashboardSalesPage from "@/src/pages/pharmacy-dashboard/sales/SalesPage";
import PharmacyDashboardStockPage from "@/src/pages/pharmacy-dashboard/stock/StockPage";
import PharmacyDashboardSettingsPage from "@/src/pages/pharmacy-dashboard/settings/PharmacySettingsPage";
import PrescriptionLookupPage from "@/src/pages/pharmacy-dashboard/prescriptions/PrescriptionLookupPage";
import LabDashboardPage from "@/src/pages/lab-dashboard/LabDashboardPage";
import LabResultsPage from "@/src/pages/lab-dashboard/results/LabResultsPage";
import LabTestsPage from "@/src/pages/lab-dashboard/tests/LabTestsPage";
import LabComingSoonPage from "@/src/pages/lab-dashboard/LabComingSoonPage";
import MedicalServiceDashboardPage from "@/src/pages/medical-service-dashboard/MedicalServiceDashboardPage";
import MedicalServiceAnalyticsPage from "@/src/pages/medical-service-dashboard/analytics/AnalyticsPage";
import MedicalServicePatientsPage from "@/src/pages/medical-service-dashboard/patients/MedicalServicePatientsPage";
import MedicalServicePrescriptionsPage from "@/src/pages/medical-service-dashboard/prescriptions/MedicalServicePrescriptionsPage";
import MedicalServiceSchedulePage from "@/src/pages/medical-service-dashboard/schedule/SchedulePage";
import MedicalServiceSettingsPage from "@/src/pages/medical-service-dashboard/settings/MedicalServiceSettingsPage";
import ParamedicalDashboardPage from "@/src/pages/paramedical-dashboard/ParamedicalDashboardPage";
import ParamedicalClientsPage from "@/src/pages/paramedical-dashboard/clients/ParamedicalClientsPage";
import ParamedicalSettingsPage from "@/src/pages/paramedical-dashboard/settings/ParamedicalSettingsPage";
import ParamedicalStockPage from "@/src/pages/paramedical-dashboard/stock/StockPage";
import ParamedicalOrdersPage from "@/src/pages/paramedical-dashboard/orders/ParamedicalOrdersPage";
function App() {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(HomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/login-test-data", element: /* @__PURE__ */ jsx(LoginTestDataPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(RegisterPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/doctors", element: /* @__PURE__ */ jsx(DoctorsPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/doctor/:id", element: /* @__PURE__ */ jsx(DoctorDetailPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/guide", element: /* @__PURE__ */ jsx(GuidePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/consultation", element: /* @__PURE__ */ jsx(ConsultationPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/welcome", element: /* @__PURE__ */ jsx(WelcomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/account-review", element: /* @__PURE__ */ jsx(AccountReviewPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/conditions-utilisation", element: /* @__PURE__ */ jsx(ConditionsPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/politique-confidentialite", element: /* @__PURE__ */ jsx(PolitiquePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/accessibilite", element: /* @__PURE__ */ jsx(AccessibilitePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/paramedical", element: /* @__PURE__ */ jsx(ParamedicalPage, {}) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/paramedical/product/:id",
        element: /* @__PURE__ */ jsx(ParamedicalProductPage, {})
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/services-medicaux", element: /* @__PURE__ */ jsx(ServicesMediauxPage, {}) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/services-medicaux/:id",
        element: /* @__PURE__ */ jsx(ServiceMedicalDetailPage, {})
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/labos-radiologie", element: /* @__PURE__ */ jsx(LabosRadiologiePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/labos-radiologie/:id", element: /* @__PURE__ */ jsx(LaboDetailPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "admin", children: /* @__PURE__ */ jsx(AdminPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/users", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "admin", children: /* @__PURE__ */ jsx(AdminUsersPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/pending", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "admin", children: /* @__PURE__ */ jsx(AdminPendingPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/suspended", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "admin", children: /* @__PURE__ */ jsx(AdminSuspendedPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/stats", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "admin", children: /* @__PURE__ */ jsx(AdminStatsPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/settings", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "admin", children: /* @__PURE__ */ jsx(AdminSettingsPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardPage, {}) }) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/dashboard/appointments",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardAppointmentsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/dashboard/consultations",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardConsultationsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/dashboard/live-consultation",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(PatientLiveConsultationPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/dashboard/medical-records",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardMedicalRecordsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/dashboard/notifications",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardNotificationsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/dashboard/prescriptions",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardPrescriptionsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard/profile", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardProfilePage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard/settings", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardSettingsPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard/messages", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "patient", children: /* @__PURE__ */ jsx(DashboardMessagesPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/doctor-dashboard", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorDashboardPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/doctor-dashboard/agenda", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorAgendaPage, {}) }) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/doctor-dashboard/consultations",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorConsultationsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/doctor-dashboard/live-consultation",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(LiveConsultationPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/doctor-dashboard/patients",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorPatientsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/doctor-dashboard/prescriptions",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorPrescriptionsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/doctor-dashboard/revenue", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorRevenuePage, {}) }) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/doctor-dashboard/settings",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorSettingsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/doctor-dashboard/messaging",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(DoctorMessagingPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/doctor-dashboard/patient-dossier/:patientId",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "doctor", children: /* @__PURE__ */ jsx(PatientDossierPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/pharmacy", element: /* @__PURE__ */ jsx(PharmacyPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/pharmacy-dashboard", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "pharmacy", children: /* @__PURE__ */ jsx(PharmacyDashboardPage, {}) }) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/pharmacy-dashboard/orders",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "pharmacy", children: /* @__PURE__ */ jsx(PharmacyDashboardOrdersPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/pharmacy-dashboard/supplier-orders",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "pharmacy", children: /* @__PURE__ */ jsx(PharmacySupplierOrdersPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/pharmacy-dashboard/sales",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "pharmacy", children: /* @__PURE__ */ jsx(PharmacyDashboardSalesPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/pharmacy-dashboard/stock",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "pharmacy", children: /* @__PURE__ */ jsx(PharmacyDashboardStockPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/pharmacy-dashboard/prescriptions",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "pharmacy", children: /* @__PURE__ */ jsx(PrescriptionLookupPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/pharmacy-dashboard/settings",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "pharmacy", children: /* @__PURE__ */ jsx(PharmacyDashboardSettingsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabDashboardPage, {}) }) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/lab-dashboard/results",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabResultsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/lab-dashboard/tests",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabTestsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard/imaging", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabComingSoonPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard/patients", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabComingSoonPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard/appointments", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabComingSoonPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard/billing", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabComingSoonPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard/messaging", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabComingSoonPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard/analytics", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabComingSoonPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/lab-dashboard/settings", element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "lab_radiology", children: /* @__PURE__ */ jsx(LabComingSoonPage, {}) }) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/medical-service-dashboard",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "medical_service", children: /* @__PURE__ */ jsx(MedicalServiceDashboardPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/medical-service-dashboard/analytics",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "medical_service", children: /* @__PURE__ */ jsx(MedicalServiceAnalyticsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/medical-service-dashboard/patients",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "medical_service", children: /* @__PURE__ */ jsx(MedicalServicePatientsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/medical-service-dashboard/prescriptions",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "medical_service", children: /* @__PURE__ */ jsx(MedicalServicePrescriptionsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/medical-service-dashboard/schedule",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "medical_service", children: /* @__PURE__ */ jsx(MedicalServiceSchedulePage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/medical-service-dashboard/settings",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "medical_service", children: /* @__PURE__ */ jsx(MedicalServiceSettingsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/paramedical-dashboard",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "paramedical", children: /* @__PURE__ */ jsx(ParamedicalDashboardPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/paramedical-dashboard/clients",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "paramedical", children: /* @__PURE__ */ jsx(ParamedicalClientsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/paramedical-dashboard/stock",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "paramedical", children: /* @__PURE__ */ jsx(ParamedicalStockPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/paramedical-dashboard/orders",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "paramedical", children: /* @__PURE__ */ jsx(ParamedicalOrdersPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/paramedical-dashboard/settings",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requiredRole: "paramedical", children: /* @__PURE__ */ jsx(ParamedicalSettingsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
  ] });
}
export {
  App as default
};
