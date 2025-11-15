//src\pages\DocumentUpload.tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUpload } from "@/components/documents/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Support for PDF, PNG, JPG, and TIFF files",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Average processing time of 2.3 seconds",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your documents are encrypted and secure",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Process documents anytime, anywhere",
  },
];

export default function DocumentUpload() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
          <p className="text-muted-foreground">
            Upload your documents for intelligent processing and data extraction
          </p>
        </div>

        <FileUpload />

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What happens after upload?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold">
                  1
                </span>
                <span>
                  Your document is securely uploaded and encrypted
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold">
                  2
                </span>
                <span>
                  Our AI analyzes and extracts key data points
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold">
                  3
                </span>
                <span>
                  You can review, edit, and export the extracted data
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold">
                  4
                </span>
                <span>
                  The processed data is ready for integration with your systems
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
