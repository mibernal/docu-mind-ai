// src/pages/Onboarding.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { FileText, Receipt, Scale, Settings, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { usePreferences } from '@/hooks/usePreferences';
import { useAuth } from '@/hooks/useAuth';
import { CustomField } from '@/types';

const useCases = [
  {
    id: 'CONTRACT_CERTIFICATION',
    title: 'Contract Certifications',
    description: 'Extract data from contract certifications and experience letters',
    icon: FileText,
    fields: [
      { name: 'client', type: 'text' as const, required: true, description: 'Client name' },
      { name: 'contractor', type: 'text' as const, required: true, description: 'Contractor name' },
      { name: 'startDate', type: 'date' as const, required: true, description: 'Start date' },
      { name: 'endDate', type: 'date' as const, required: true, description: 'End date' },
      { name: 'contractObject', type: 'text' as const, required: true, description: 'Contract object' },
      { name: 'valueWithoutVAT', type: 'currency' as const, required: true, description: 'Value without VAT' },
      { name: 'valueWithVAT', type: 'currency' as const, required: true, description: 'Value with VAT' },
    ],
  },
  {
    id: 'INVOICE_PROCESSING',
    title: 'Invoice Processing',
    description: 'Extract data from invoices and receipts',
    icon: Receipt,
    fields: [
      { name: 'invoiceNumber', type: 'text' as const, required: true, description: 'Invoice number' },
      { name: 'date', type: 'date' as const, required: true, description: 'Invoice date' },
      { name: 'vendor', type: 'text' as const, required: true, description: 'Vendor name' },
      { name: 'customer', type: 'text' as const, required: true, description: 'Customer name' },
      { name: 'total', type: 'currency' as const, required: true, description: 'Total amount' },
    ],
  },
  {
    id: 'LEGAL_DOCUMENTS',
    title: 'Legal Documents',
    description: 'Extract data from legal documents and court filings',
    icon: Scale,
    fields: [
      { name: 'caseNumber', type: 'text' as const, required: true, description: 'Case number' },
      { name: 'court', type: 'text' as const, required: true, description: 'Court name' },
      { name: 'plaintiff', type: 'text' as const, required: true, description: 'Plaintiff name' },
      { name: 'defendant', type: 'text' as const, required: true, description: 'Defendant name' },
      { name: 'filingDate', type: 'date' as const, required: true, description: 'Filing date' },
    ],
  },
  {
    id: 'CUSTOM',
    title: 'Custom Setup',
    description: 'Define your own fields and extraction rules',
    icon: Settings,
    fields: [],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setUserPreferences, isLoading } = usePreferences();
  const [selectedUseCase, setSelectedUseCase] = useState<string>('CONTRACT_CERTIFICATION');

  useEffect(() => {
    // If user already has preferences, redirect to dashboard
    if (user?.preferences) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedUseCaseData = useCases.find(uc => uc.id === selectedUseCase);
    if (!selectedUseCaseData) return;

    try {
      await setUserPreferences({
        useCase: selectedUseCase,
        customFields: selectedUseCaseData.fields as CustomField[],
      });
      toast.success('Preferences saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const selectedUseCaseData = useCases.find(uc => uc.id === selectedUseCase);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-4xl space-y-6 animate-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to DocuMind AI</h1>
          <p className="text-muted-foreground">
            Let's customize your experience. How will you use our document processing?
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-primary">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Use Case</span>
            </div>
            <div className="w-12 h-0.5 bg-muted" />
            <div className="flex items-center text-muted-foreground">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                2
              </div>
              <span className="ml-2 text-sm font-medium">Fields</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Select Your Use Case</CardTitle>
              <CardDescription>
                Choose the primary use case for document processing. You can change this later in settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={selectedUseCase} onValueChange={setSelectedUseCase} className="space-y-4">
                {useCases.map((useCase) => (
                  <div key={useCase.id} className="flex items-start space-x-3 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value={useCase.id} id={useCase.id} />
                    <Label htmlFor={useCase.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 mt-1">
                          <useCase.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{useCase.title}</p>
                            {useCase.id === 'CONTRACT_CERTIFICATION' && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {useCase.description}
                          </p>
                          {useCase.fields.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                Extracted fields:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {useCase.fields.slice(0, 4).map((field, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {field.name}
                                  </Badge>
                                ))}
                                {useCase.fields.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{useCase.fields.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {selectedUseCaseData && selectedUseCaseData.fields.length > 0 && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Fields that will be extracted:</h4>
                  <div className="grid gap-2 text-sm">
                    {selectedUseCaseData.fields.map((field, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium">{field.name}</span>
                        <span className="text-muted-foreground">- {field.description}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {field.type}
                        </Badge>
                        {field.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={isLoading}
                >
                  Skip for now
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Preferences & Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>You can always change these settings later in your profile preferences.</p>
        </div>
      </div>
    </div>
  );
}