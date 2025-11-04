import { useState, useCallback } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  documentId?: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/tiff"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Please upload PDF, PNG, JPG, or TIFF files.";
    }

    if (file.size > maxSize) {
      return "File size exceeds 10MB limit.";
    }

    return null;
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      
      if (error) {
        toast.error(error);
        return;
      }

      if (files.length + newFiles.length >= 5) {
        toast.error("Maximum 5 files per batch");
        return;
      }

      newFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: "pending",
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [files]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFile = async (fileData: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileData.id ? { ...f, status: "uploading", progress: 10 } : f
      )
    );

    try {
      const formData = new FormData();
      formData.append("document", fileData.file);

      // Simular progreso inicial
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileData.id && f.progress < 80) {
              return { ...f, progress: Math.min(f.progress + 10, 80) };
            }
            return f;
          })
        );
      }, 300);

      // Subida real
      const result = await apiClient.uploadDocument(formData);
      
      clearInterval(progressInterval);

      // Completar progreso
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? { ...f, status: "success", progress: 100, documentId: result.documentId }
            : f
        )
      );

      toast.success(`${fileData.file.name} uploaded successfully! Processing started.`);
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? { ...f, status: "error", error: "Upload failed", progress: 0 }
            : f
        )
      );
      toast.error(`Failed to upload ${fileData.file.name}`);
    }
  };

  const uploadAll = async () => {
    const filesToUpload = files.filter(f => f.status === "pending");
    
    for (const file of filesToUpload) {
      await uploadFile(file);
    }
  };

  const retryUpload = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      uploadFile(file);
    }
  };

  const hasFilesToUpload = files.some((f) => f.status === "pending");

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Support for PDF, PNG, JPG, TIFF (max 10MB, 5 files per batch)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.tiff"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button asChild>
              <span className="cursor-pointer">Select Files</span>
            </Button>
          </label>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Files ({files.length}/5)</h4>
              {hasFilesToUpload && (
                <Button onClick={uploadAll} size="sm">
                  Upload All
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {(file.status === "uploading" || file.status === "success") && (
                      <Progress value={file.progress} className="mt-2" />
                    )}
                    {file.error && (
                      <p className="text-xs text-destructive mt-1">{file.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                    {file.status === "error" && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    {file.status === "error" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryUpload(file.id)}
                      >
                        Retry
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === "uploading"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}