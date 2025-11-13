//src\pages\DocumentDetail.tsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, User, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Document, ContractCertificationData } from "@/types";
import { toast } from "sonner";
import { useDocumentStatus } from "@/hooks/useDocumentStatus";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Usar hook de polling
  const { status: liveStatus, isProcessing, refetch: refetchStatus } = useDocumentStatus(id);

  // ✅ CORREGIDO: useCallback para evitar recreación en cada render
  const fetchDocument = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getDocument(id!);
      setDocument(data.document);
    } catch (error) {
      console.error("Failed to fetch document:", error);
      toast.error("Failed to load document details");
    } finally {
      setIsLoading(false);
    }
  }, [id]); // ✅ Dependencia correcta

  // ✅ CORREGIDO: useEffect con dependencias adecuadas
  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id, fetchDocument]);

  // ✅ CORREGIDO: useEffect separado para liveStatus sin dependencia de document
  useEffect(() => {
    if (liveStatus && document) {
      // Solo actualizar si realmente hay cambios
      const hasChanges = 
        liveStatus.status !== document.status ||
        liveStatus.processedAt !== document.processedAt ||
        liveStatus.confidence !== document.confidence;

      if (hasChanges) {
        setDocument(prev => prev ? {
          ...prev,
          status: liveStatus.status,
          processedAt: liveStatus.processedAt,
          confidence: liveStatus.confidence,
        } : prev);
      }
    }
  }, [liveStatus]); // ✅ Solo dependencia de liveStatus

  const handleRefresh = () => {
    fetchDocument();
    refetchStatus();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice': return 'bg-purple-100 text-purple-800';
      case 'receipt': return 'bg-orange-100 text-orange-800';
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'contract_certification': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContractCertification = (data: any) => {
    const certData = data as ContractCertificationData;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Cliente:</span>
                <span>{certData.cliente || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contratista:</span>
                <span>{certData.contratista || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">NIT Contratista:</span>
                <span>{certData.nitContratista || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">No. Contrato:</span>
                <span>{certData.numeroContrato || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fechas y Duración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Fecha Inicio:</span>
                <span>{certData.fechaInicio || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha Fin:</span>
                <span>{certData.fechaFin || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duración:</span>
                <span>{certData.duracionMeses || 0} meses</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Valores Contractuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Valor sin IVA</div>
                <div className="text-2xl font-bold text-green-600">
                  ${certData.valorSinIva?.toLocaleString('es-CO') || '0'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Valor con IVA</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${certData.valorConIva?.toLocaleString('es-CO') || '0'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Valor en SMMLV</div>
                <div className="text-2xl font-bold text-orange-600">
                  {certData.valorSMMLV || 0}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">SMMLV con IVA</div>
                <div className="text-2xl font-bold text-purple-600">
                  {certData.valorSMMLVIva || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Objeto y Actividades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium mb-2">Objeto del Contrato:</div>
              <p className="text-sm text-muted-foreground">{certData.objeto || 'N/A'}</p>
            </div>
            
            {certData.actividades && certData.actividades.length > 0 && (
              <div>
                <div className="font-medium mb-2">Actividades Realizadas:</div>
                <ul className="list-disc list-inside space-y-1">
                  {certData.actividades.map((actividad, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {actividad}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {(certData.firmante || certData.cargoFirmante) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Firmante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="font-medium">Nombre:</span>
                <span>{certData.firmante || 'N/A'}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Cargo:</span>
                <span>{certData.cargoFirmante || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderNestedObject = (obj: any) => {
    return Object.entries(obj).map(([nestedKey, nestedValue]) => (
      <div key={nestedKey} className="text-sm">
        <span className="font-medium">{nestedKey}:</span> {String(nestedValue)}
      </div>
    ));
  };

  const renderExtractedData = (data: any) => {
    if (!data || typeof data !== 'object') {
      return <p className="text-muted-foreground">No extracted data available</p>;
    }

    if (document?.type === 'contract_certification') {
      return renderContractCertification(data);
    }

    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="border-b pb-2 last:border-b-0">
        <div className="flex justify-between items-start">
          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
          <span className="text-right">
            {Array.isArray(value) 
              ? value.map((item, index) => (
                  <div key={index} className="ml-4 border-l-2 pl-2 my-1">
                    {typeof item === 'object' 
                      ? renderNestedObject(item)
                      : String(item)
                    }
                  </div>
                ))
              : typeof value === 'object'
                ? renderNestedObject(value)
                : String(value)
            }
          </span>
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <Button onClick={() => navigate('/documents')}>
            Back to Documents
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{document.filename}</h1>
            <div className="flex gap-2 mt-2">
              <Badge className={getTypeColor(document.type)}>
                {document.type}
              </Badge>
              <Badge className={getStatusColor(document.status)}>
                {document.status}
                {isProcessing && (
                  <RefreshCw className="h-3 w-3 ml-1 animate-spin" />
                )}
              </Badge>
              {document.confidence && (
                <Badge variant="outline">
                  Confidence: {Math.round(document.confidence * 100)}%
                </Badge>
              )}
              {document.processingEngine && (
                <Badge variant="outline">
                  Engine: {document.processingEngine}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Document Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Filename:</span>
                <span className="text-right">{document.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">File Size:</span>
                <span>{document.fileSize ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">File Type:</span>
                <span>{document.fileType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Uploaded:</span>
                <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
              </div>
              {document.processedAt && (
                <div className="flex justify-between">
                  <span className="font-medium">Processed:</span>
                  <span>{new Date(document.processedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Processing Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                AI Extraction Results
              </CardTitle>
              <CardDescription>
                Data extracted by artificial intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              {document.extractedData ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {renderExtractedData(document.extractedData)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {document.status === 'processing' 
                      ? 'Document is being processed...' 
                      : 'No data extracted yet'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Raw Data Preview */}
        {document.extractedData && (
          <Card>
            <CardHeader>
              <CardTitle>Raw JSON Data</CardTitle>
              <CardDescription>
                Complete extracted data structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(document.extractedData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}