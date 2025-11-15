// src/components/documents/DocumentsTable.tsx - VERSIÓN CORREGIDA
import { useState } from "react";
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
import { FileText, Download } from "lucide-react";
import { ProcessedDocument } from "@/types";

interface DocumentsTableProps {
  documents: ProcessedDocument[];
  isLoading?: boolean;
}

export function DocumentsTable({ documents, isLoading }: DocumentsTableProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>AI Engine</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="animate-pulse bg-muted h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted h-6 rounded"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>AI Engine</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No documents found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>AI Engine</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate max-w-[200px]" title={document.filename}>
                    {document.filename}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getTypeColor(document.type)} variant="outline">
                  {document.type.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(document.status)} variant="outline">
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell>
                {document.confidence ? `${(document.confidence * 100).toFixed(1)}%` : 'N/A'}
              </TableCell>
              <TableCell>
                <span className="text-sm capitalize">
                  {document.processingEngine || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                {new Date(document.uploadedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/documents/${document.id}`}>
                    View Details
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}