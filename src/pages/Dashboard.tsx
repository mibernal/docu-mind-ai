import { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Document, DashboardMetrics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsData, documentsData] = await Promise.all([
          apiClient.getDocumentMetrics(),
          apiClient.getDocuments({ limit: 5 })
        ]);

        setMetrics({
          totalDocuments: metricsData.stats.totalDocuments,
          successRate: metricsData.stats.successRate,
          averageProcessingTime: 2.3, // Mock por ahora
          timeSaved: metricsData.stats.timeSaved,
          documentsByType: metricsData.stats.documentsByType,
        });

        setRecentDocuments(documentsData.documents);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Loading your document processing overview...
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Here's an overview of your document processing.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Documents"
            value={metrics?.totalDocuments?.toLocaleString() || '0'}
            icon={FileText}
            description="All time"
          />
          <MetricCard
            title="Success Rate"
            value={`${metrics?.successRate || 0}%`}
            icon={CheckCircle2}
            description="Successful extractions"
          />
          <MetricCard
            title="Avg Processing Time"
            value={`${metrics?.averageProcessingTime || 0}s`}
            icon={Clock}
            description="Per document"
          />
          <MetricCard
            title="Time Saved"
            value={`${metrics?.timeSaved || 0}h`}
            icon={TrendingUp}
            description="Estimated time saved"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Documents</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/documents")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DocumentsTable documents={recentDocuments} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.documentsByType?.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm capitalize">{item.type}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                ))}
                {(!metrics?.documentsByType || metrics.documentsByType.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents processed yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/documents/upload")}>
                Upload New Document
              </Button>
              <Button variant="outline" onClick={() => navigate("/documents")}>
                View All Documents
              </Button>
              <Button variant="outline" onClick={() => navigate("/templates")}>
                Manage Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}