import { FileText, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Document, DashboardMetrics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data
const mockMetrics: DashboardMetrics = {
  totalDocuments: 1247,
  successRate: 98.5,
  averageProcessingTime: 2.3,
  timeSaved: 42,
  documentsByType: [
    { type: "invoice", count: 524 },
    { type: "receipt", count: 398 },
    { type: "contract", count: 215 },
    { type: "other", count: 110 },
  ],
};

const mockRecentDocuments: Document[] = [
  {
    id: "1",
    filename: "Invoice_2024_001.pdf",
    type: "invoice",
    status: "completed",
    uploadedAt: "2024-01-15T10:30:00Z",
    processedAt: "2024-01-15T10:32:15Z",
    confidence: 0.96,
  },
  {
    id: "2",
    filename: "Receipt_Store_A.jpg",
    type: "receipt",
    status: "completed",
    uploadedAt: "2024-01-15T09:15:00Z",
    confidence: 0.94,
  },
  {
    id: "3",
    filename: "Contract_Draft.pdf",
    type: "contract",
    status: "processing",
    uploadedAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    filename: "Invoice_2024_002.pdf",
    type: "invoice",
    status: "completed",
    uploadedAt: "2024-01-14T16:20:00Z",
    confidence: 0.98,
  },
  {
    id: "5",
    filename: "Receipt_Hotel.png",
    type: "receipt",
    status: "failed",
    uploadedAt: "2024-01-14T15:10:00Z",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your document processing.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Documents"
            value={mockMetrics.totalDocuments.toLocaleString()}
            icon={FileText}
            description="This month"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Success Rate"
            value={`${mockMetrics.successRate}%`}
            icon={CheckCircle2}
            description="Successful extractions"
            trend={{ value: 2, isPositive: true }}
          />
          <MetricCard
            title="Avg Processing Time"
            value={`${mockMetrics.averageProcessingTime}s`}
            icon={Clock}
            description="Per document"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Time Saved"
            value={`${mockMetrics.timeSaved}h`}
            icon={TrendingUp}
            description="This month"
            trend={{ value: 15, isPositive: true }}
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
              <DocumentsTable documents={mockRecentDocuments} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMetrics.documentsByType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm capitalize">{item.type}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                ))}
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
              <Button variant="outline">Export Data</Button>
              <Button variant="outline">Create Template</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
