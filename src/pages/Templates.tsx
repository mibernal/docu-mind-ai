import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import { Template } from "@/types";

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Standard Invoice",
    description: "Template for processing standard business invoices",
    documentType: "invoice",
    fields: [
      { id: "1", name: "Invoice Number", type: "text", required: true },
      { id: "2", name: "Date", type: "date", required: true },
      { id: "3", name: "Amount", type: "number", required: true },
      { id: "4", name: "Vendor", type: "text", required: true },
    ],
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Expense Receipt",
    description: "Template for expense receipts and reimbursements",
    documentType: "receipt",
    fields: [
      { id: "1", name: "Merchant", type: "text", required: true },
      { id: "2", name: "Total", type: "number", required: true },
      { id: "3", name: "Date", type: "date", required: true },
      { id: "4", name: "Category", type: "text", required: false },
    ],
    createdAt: "2024-01-08T14:30:00Z",
  },
  {
    id: "3",
    name: "Service Contract",
    description: "Template for service agreement contracts",
    documentType: "contract",
    fields: [
      { id: "1", name: "Contract Number", type: "text", required: true },
      { id: "2", name: "Client Name", type: "text", required: true },
      { id: "3", name: "Start Date", type: "date", required: true },
      { id: "4", name: "End Date", type: "date", required: true },
      { id: "5", name: "Value", type: "number", required: true },
    ],
    createdAt: "2024-01-05T09:15:00Z",
  },
];

export default function Templates() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground">
              Manage extraction templates for different document types
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {template.documentType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Fields ({template.fields.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 3).map((field) => (
                      <Badge key={field.id} variant="secondary" className="text-xs">
                        {field.name}
                      </Badge>
                    ))}
                    {template.fields.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.fields.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Templates define which fields should be extracted from your documents.
              Create custom templates to match your specific document types and workflows.
            </p>
            <p>
              Each template can include multiple fields with different data types
              (text, number, date, email) and validation rules.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
