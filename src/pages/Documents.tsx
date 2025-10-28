import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { Document, DocumentType, DocumentStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockDocuments: Document[] = [
  {
    id: "1",
    filename: "Invoice_2024_001.pdf",
    type: "invoice",
    status: "completed",
    uploadedAt: "2024-01-15T10:30:00Z",
    processedAt: "2024-01-15T10:32:15Z",
  },
  {
    id: "2",
    filename: "Receipt_Store_A.jpg",
    type: "receipt",
    status: "completed",
    uploadedAt: "2024-01-15T09:15:00Z",
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
  },
  {
    id: "5",
    filename: "Receipt_Hotel.png",
    type: "receipt",
    status: "failed",
    uploadedAt: "2024-01-14T15:10:00Z",
  },
  {
    id: "6",
    filename: "Contract_Agreement.pdf",
    type: "contract",
    status: "completed",
    uploadedAt: "2024-01-14T14:00:00Z",
  },
  {
    id: "7",
    filename: "Invoice_2024_003.pdf",
    type: "invoice",
    status: "completed",
    uploadedAt: "2024-01-14T11:30:00Z",
  },
  {
    id: "8",
    filename: "Document_Scan.tiff",
    type: "other",
    status: "processing",
    uploadedAt: "2024-01-14T10:15:00Z",
  },
];

export default function Documents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.filename
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">
              Manage and track all your processed documents
            </p>
          </div>
          <Button onClick={() => navigate("/documents/upload")}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="receipt">Receipt</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DocumentsTable documents={filteredDocuments} />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {filteredDocuments.length} of {mockDocuments.length} documents
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
