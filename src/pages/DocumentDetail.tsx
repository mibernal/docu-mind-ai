// src/pages/DocumentDetail.tsx - VERSIÓN CORREGIDA
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, FileText, Calendar, Clock, User, Building, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { ProcessedDocument, CustomField } from "@/types";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface FieldDisplay {
  name: string;
  value: any;
  description: string;
  type: string;
  required: boolean;
  isPreferred: boolean;
}

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documentData, setDocumentData] = useState<ProcessedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      try {
        const data = await apiClient.getDocument(id);
        setDocumentData(data.document);
      } catch (error) {
        console.error("Failed to fetch document:", error);
        toast.error("Failed to load document");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Function to format field values
  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    if (typeof value === "number" && value > 1000) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    }
    return String(value);
  };

  // Determine which fields to display based on user preferences
  const getFieldsToDisplay = (): FieldDisplay[] => {
    if (!documentData?.extractedData) return [];
    
    const extractedData = documentData.extractedData;
    const userFields = user?.preferences?.customFields || [];
    
    // If user has custom fields, prioritize those
    if (userFields.length > 0) {
      const fields: FieldDisplay[] = [];
      for (const field of userFields) {
        if (extractedData[field.name] !== undefined) {
          fields.push({
            name: field.name,
            value: extractedData[field.name],
            description: field.description || '',
            type: field.type,
            required: field.required,
            isPreferred: true
          });
        }
      }
      
      // Add additional fields not in preferences
      Object.entries(extractedData).forEach(([key, value]) => {
        if (!fields.find(f => f.name === key) && !key.startsWith('_')) {
          fields.push({
            name: key,
            value: value,
            description: '',
            type: 'auto',
            required: false,
            isPreferred: false
          });
        }
      });
      
      return fields;
    }
    
    // If no preferences, show all fields
    return Object.entries(extractedData)
      .filter(([key]) => !key.startsWith('_'))
      .map(([key, value]) => ({
        name: key,
        value: value,
        description: '',
        type: 'auto',
        required: false,
        isPreferred: false
      }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/documents")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-1">
              <div className="h-8 w-64 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded animate-pulse" />
              <div className="h-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!documentData) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/documents")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Document not found</h1>
              <p className="text-muted-foreground">The document you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const fieldsToDisplay = getFieldsToDisplay();
  const hasExtractedData = documentData.extractedData && Object.keys(documentData.extractedData).length > 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "contract_certification":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "invoice":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "receipt":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "legal":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFieldIcon = (fieldName: string) => {
    const lowerName = fieldName.toLowerCase();
    if (lowerName.includes('date') || lowerName.includes('fecha')) return Calendar;
    if (lowerName.includes('name') || lowerName.includes('nombre')) return User;
    if (lowerName.includes('company') || lowerName.includes('empresa')) return Building;
    if (lowerName.includes('amount') || lowerName.includes('valor') || lowerName.includes('price')) return DollarSign;
    return FileText;
  };

  const handleExportData = () => {
    if (documentData.extractedData) {
      const dataStr = JSON.stringify(documentData.extractedData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentData.filename}-extracted-data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/documents")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold truncate">{documentData.filename}</h1>
            <p className="text-muted-foreground">
              Uploaded on {new Date(documentData.uploadedAt).toLocaleDateString()} at{" "}
              {new Date(documentData.uploadedAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={documentData.fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - Extracted Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Processing Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  {documentData.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : documentData.status === "processing" ? (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Processing Results
                </CardTitle>
                <CardDescription>
                  {documentData.status === "completed" 
                    ? "Document processed successfully" 
                    : documentData.status === "processing"
                    ? "Document is being processed"
                    : "Document processing failed"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-2 ${getStatusColor(documentData.status)}`}>
                      {documentData.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <Badge className={`ml-2 ${getTypeColor(documentData.type)}`}>
                      {documentData.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span>
                    <span className="ml-2 font-medium">
                      {documentData.confidence ? `${(documentData.confidence * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">AI Engine:</span>
                    <span className="ml-2 font-medium capitalize">
                      {documentData.processingEngine || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Data */}
            {hasExtractedData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Information</CardTitle>
                  <CardDescription>
                    {user?.preferences?.customFields && user.preferences.customFields.length > 0 
                      ? "Data filtered based on your preferences" 
                      : "All extracted data from the document"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Preferred fields */}
                    {fieldsToDisplay.filter(f => f.isPreferred).length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Your Preferred Fields
                        </h4>
                        <div className="grid gap-3">
                          {fieldsToDisplay.filter(f => f.isPreferred).map((field, index) => {
                            const FieldIcon = getFieldIcon(field.name);
                            return (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                                <FieldIcon className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium capitalize">
                                      {field.name.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    </span>
                                    {field.required && (
                                      <Badge variant="secondary" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {field.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {field.description}
                                  </p>
                                  <p className="text-sm font-medium mt-1">
                                    {formatFieldValue(field.value)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Additional fields */}
                    {fieldsToDisplay.filter(f => !f.isPreferred).length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                          Additional Extracted Fields
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Field</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fieldsToDisplay.filter(f => !f.isPreferred).map((field, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium capitalize">
                                  {field.name.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </TableCell>
                                <TableCell>
                                  {formatFieldValue(field.value)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Data Extracted</h3>
                    <p className="text-muted-foreground mt-2">
                      {documentData.status === "processing" 
                        ? "Document is still being processed. Please check back later." 
                        : "No data could be extracted from this document."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Raw Data (For debugging only) */}
            {hasExtractedData && (
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data</CardTitle>
                  <CardDescription>
                    Complete JSON data extracted from the document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                    {JSON.stringify(documentData.extractedData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Document Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">File Name</span>
                    <span className="text-sm text-right truncate max-w-[200px]" title={documentData.filename}>
                      {documentData.filename}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">File Size</span>
                    <span className="text-sm">
                      {documentData.fileSize ? `${(documentData.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">File Type</span>
                    <span className="text-sm capitalize">{documentData.fileType || 'N/A'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Uploaded</span>
                    <span className="text-sm">
                      {new Date(documentData.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {documentData.processedAt && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Processed</span>
                        <span className="text-sm">
                          {new Date(documentData.processedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <a href={documentData.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download Original
                  </a>
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleExportData}
                  disabled={!documentData.extractedData}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate("/documents/upload")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Another
                </Button>
              </CardContent>
            </Card>

            {/* Processing Info */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Engine</span>
                  <span className="font-medium capitalize">{documentData.processingEngine || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Score</span>
                  <span className="font-medium">
                    {documentData.confidence ? `${(documentData.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Document Type</span>
                  <span className="font-medium capitalize">
                    {documentData.type.replace('_', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}