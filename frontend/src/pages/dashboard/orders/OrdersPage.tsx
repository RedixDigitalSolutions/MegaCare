import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ShoppingBag, CheckCircle, Clock } from "lucide-react";
import { useEffect } from "react";

export default function OrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const orders = [
    {
      id: "CMD-001",
      date: "28 Février 2025",
      status: "Retiré",
      total: "85.500 DT",
      items: ["Paracétamol 500mg", "Vitamine C"],
      pharmacy: "Pharmacie Central",
    },
    {
      id: "CMD-002",
      date: "25 Février 2025",
      status: "Prît pour retrait",
      total: "65.000 DT",
      items: ["Antibiotique", "Sirop pour toux"],
      pharmacy: "Pharmacie Ben Arous",
    },
    {
      id: "CMD-003",
      date: "20 Février 2025",
      status: "En attente",
      total: "120.000 DT",
      items: ["Crème dermatologique", "Savon médical"],
      pharmacy: "Pharmacie Tunis Centre",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Retiré":
        return "bg-green-50 border-green-200 text-green-700";
      case "Prît pour retrait":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "En attente":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Retiré":
        return <CheckCircle size={20} />;
      case "Prît pour retrait":
        return <ShoppingBag size={20} />;
      case "En attente":
        return <Clock size={20} />;
      default:
        return <ShoppingBag size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Mes commandes
              </h1>
              <p className="text-muted-foreground mt-2">
                Historique et suivi de vos commandes
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`border-2 rounded-lg p-6 ${getStatusColor(order.status)}`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {order.id}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.date} • {order.pharmacy}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-foreground">
                            • {item}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {order.total}
                      </p>
                      <span className="inline-block px-3 py-1 bg-current bg-opacity-10 rounded-full text-sm font-medium mt-2">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
