//apps\web\src\features\documents\components\DocumentsTable.tsx
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2 } from "lucide-react";
import { ProcessedDocument } from "@/types";

interface DocumentsTableProps {
  documents?: ProcessedDocument[];
  isLoading?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  "contract_certification": "bg-blue-100 text-blue-800 border-blue-200",
  "invoice": "bg-purple-100 text-purple-800 border-purple-200",
  "receipt": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "legal": "bg-orange-100 text-orange-800 border-orange-200",
  "default": "bg-gray-100 text-gray-800 border-gray-200"
};

const STATUS_COLORS: Record<string, string> = {
  "completed": "bg-green-100 text-green-800 border-green-200",
  "processing": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "failed": "bg-red-100 text-red-800 border-red-200",
  "default": "bg-gray-100 text-gray-800 border-gray-200"
};

export function DocumentsTable({ documents, isLoading = false }: DocumentsTableProps) {
  // ✅ Manejo seguro de datos
  const docs = Array.isArray(documents) ? documents : [];
  
  // ✅ Mostrar loader si está cargando
  if (isLoading) {
    return (
      <div className="w-full rounded-lg border bg-white p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  // ✅ Mostrar estado vacío
  if (docs.length === 0) {
    return (
      <div className="w-full rounded-lg border bg-white p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-medium">No documents found</p>
            <p className="text-sm text-muted-foreground">
              Upload your first document to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Document</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Confidence</TableHead>
            <TableHead className="font-semibold">AI Engine</TableHead>
            <TableHead className="font-semibold">Uploaded</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((doc) => {
            const typeColor = TYPE_COLORS[doc.type] || TYPE_COLORS.default;
            const statusColor = STATUS_COLORS[doc.status] || STATUS_COLORS.default;
            
            return (
              <TableRow key={doc.id} className="group hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium" title={doc.filename}>
                        {doc.filename}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {doc.fileType} • {(doc.fileSize || 0) > 0 
                          ? `${(doc.fileSize! / 1024 / 1024).toFixed(2)} MB` 
                          : 'Unknown size'
                        }
                      </p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    className={`${typeColor} capitalize font-medium`}
                    variant="outline"
                  >
                    {doc.type.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    className={`${statusColor} font-medium`}
                    variant="outline"
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    {doc.confidence !== undefined && doc.confidence !== null ? (
                      <>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${doc.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {(doc.confidence * 100).toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm font-medium capitalize">
                    {doc.processingEngine || 'Unknown'}
                  </span>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {doc.uploadedAt 
                      ? new Date(doc.uploadedAt).toLocaleDateString()
                      : 'Unknown'
                    }
                  </span>
                </TableCell>
                
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    asChild
                  >
                    <Link to={`/documents/${doc.id}`}>
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}