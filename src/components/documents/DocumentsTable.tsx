import { useNavigate } from "react-router-dom";
import { Document } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentsTableProps {
  documents: Document[];
  isLoading: boolean;
}

export function DocumentsTable({ documents, isLoading }: DocumentsTableProps) {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ACTUALIZAR: Agregar color para contract_certification
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No documents found</h3>
        <p className="text-muted-foreground">
          Upload your first document to get started with AI processing.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell 
              className="font-medium"
              onClick={() => navigate(`/documents/${document.id}`)}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {document.filename}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getTypeColor(document.type)}>
                {document.type}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(document.status)}
                <Badge variant="outline" className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              {document.confidence ? (
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${document.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{Math.round(document.confidence * 100)}%</span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(document.uploadedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/documents/${document.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}