import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Save, FileText } from "lucide-react";
import { toast } from "sonner";

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const document = {
    id,
    filename: "Invoice_2024_001.pdf",
    type: "invoice",
    status: "completed",
    uploadedAt: "2024-01-15T10:30:00Z",
    processedAt: "2024-01-15T10:32:15Z",
    confidence: 0.96,
    extractedData: {
      invoiceNumber: "INV-2024-001",
      date: "2024-01-15",
      vendor: "Acme Corporation",
      amount: "1,250.00",
      currency: "USD",
      taxAmount: "125.00",
      total: "1,375.00",
    },
  };

  const handleSave = () => {
    toast.success("Document data saved successfully");
  };

  const handleExport = () => {
    toast.success("Document exported as JSON");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/documents")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{document.filename}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{document.type}</Badge>
              <Badge>{document.status}</Badge>
              <span className="text-sm text-muted-foreground">
                Confidence: {(document.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[8.5/11] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-2" />
                  <p>PDF Preview</p>
                  <p className="text-sm">{document.filename}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(document.extractedData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Input defaultValue={value} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Processing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="font-medium">Processing completed</p>
                  <p className="text-muted-foreground">
                    {new Date(document.processedAt!).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="font-medium">Document uploaded</p>
                  <p className="text-muted-foreground">
                    {new Date(document.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
