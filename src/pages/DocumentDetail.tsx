import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Save, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface DocumentData {
  id: string;
  filename: string;
  type: string;
  status: string;
  uploadedAt: string;
  processedAt?: string;
  confidence?: number;
  extractedData?: Record<string, any>;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await apiClient.getDocument(id!);
        setDocumentData(data.document);
        setExtractedData(data.document.extractedData || {});
      } catch (error) {
        console.error("Failed to fetch document:", error);
        toast.error("Failed to load document");
        navigate("/documents");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // En una implementacion real, aqui llamariamos a la API para guardar los cambios
      // await apiClient.updateDocument(id!, { extractedData });
      toast.success("Document data saved successfully");
    } catch (error) {
      console.error("Failed to save document:", error);
      toast.error("Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!documentData) return;
    
    const dataStr = JSON.stringify(extractedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentData.filename.replace(/\.[^/.]+$/, "")}_extracted_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Document exported as JSON");
  };

  const handleReprocess = async () => {
    try {
      toast.info("Reprocessing document...");
      // En una implementacion real, aqui llamariamos a la API para reprocesar
      // await apiClient.reprocessDocument(id!);
      setTimeout(() => {
        toast.success("Document reprocessed successfully");
        // Recargar los datos del documento
        if (id) {
          const fetchDocument = async () => {
            const data = await apiClient.getDocument(id);
            setDocumentData(data.document);
            setExtractedData(data.document.extractedData || {});
          };
          fetchDocument();
        }
      }, 2000);
    } catch (error) {
      console.error("Failed to reprocess document:", error);
      toast.error("Failed to reprocess document");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/documents")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/4 mt-2 animate-pulse"></div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] bg-muted rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                      <div className="h-10 bg-muted rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!documentData) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The document you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate("/documents")}>
              Back to Documents
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/documents")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{documentData.filename}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">{documentData.type}</Badge>
              <Badge variant={getStatusColor(documentData.status)} className="capitalize">
                {documentData.status}
              </Badge>
              {documentData.confidence && (
                <span className="text-sm text-muted-foreground">
                  Confidence: {(documentData.confidence * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {documentData.status === 'failed' && (
              <Button variant="outline" onClick={handleReprocess}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reprocess
              </Button>
            )}
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
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
                  <p className="font-medium">{documentData.fileType.toUpperCase()}</p>
                  <p className="text-sm">{documentData.filename}</p>
                  <p className="text-xs mt-2">
                    {(documentData.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
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
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Input 
                      value={value as string} 
                      onChange={(e) => setExtractedData(prev => ({ 
                        ...prev, 
                        [key]: e.target.value 
                      }))}
                    />
                  </div>
                ))}
                {Object.keys(extractedData).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No data extracted yet</p>
                    {documentData.status === 'processing' && (
                      <p className="text-sm mt-1">Document is still being processed...</p>
                    )}
                  </div>
                )}
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
              {documentData.processedAt && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Processing completed</p>
                    <p className="text-muted-foreground">
                      {new Date(documentData.processedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Document uploaded</p>
                  <p className="text-muted-foreground">
                    {new Date(documentData.uploadedAt).toLocaleString()}
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