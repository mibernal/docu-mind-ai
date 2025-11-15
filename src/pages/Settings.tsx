// src/pages/Settings.tsx
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { FileText, Receipt, Scale, Settings as SettingsIcon } from "lucide-react";

const useCaseIcons = {
  CONTRACT_CERTIFICATION: FileText,
  INVOICE_PROCESSING: Receipt,
  LEGAL_DOCUMENTS: Scale,
  CUSTOM: SettingsIcon,
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { preferences, updateUserPreferences } = usePreferences();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [organization, setOrganization] = useState({
    name: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
      });
      setOrganization({
        name: user.organization?.name || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real implementation, we would call the API here
      // await apiClient.updateProfile(profile);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePreferences = async (newUseCase: string) => {
    try {
      setIsSaving(true);
      await updateUserPreferences({
        useCase: newUseCase,
        customFields: preferences?.customFields || [],
      });
      toast.success("Preferences updated successfully");
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const CurrentUseCaseIcon = preferences?.useCase ? 
    useCaseIcons[preferences.useCase as keyof typeof useCaseIcons] : FileText;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* NEW SECTION: DOCUMENT PROCESSING PREFERENCES */}
        <Card>
          <CardHeader>
            <CardTitle>Document Processing Preferences</CardTitle>
            <CardDescription>
              Configure how you want to process your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Current Use Case</Label>
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="p-3 rounded-lg bg-primary/10">
                  <CurrentUseCaseIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">
                    {preferences?.useCase?.toLowerCase().replace(/_/g, ' ') || 'Not set'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {preferences?.useCase === 'CONTRACT_CERTIFICATION' && 'Extract data from contract certifications'}
                    {preferences?.useCase === 'INVOICE_PROCESSING' && 'Extract data from invoices and receipts'}
                    {preferences?.useCase === 'LEGAL_DOCUMENTS' && 'Extract data from legal documents'}
                    {preferences?.useCase === 'CUSTOM' && 'Custom field extraction'}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {preferences?.useCase?.toLowerCase().replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Available Use Cases</Label>
              <div className="grid gap-3">
                {Object.entries(useCaseIcons).map(([useCase, Icon]) => (
                  <div
                    key={useCase}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      preferences?.useCase === useCase
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleUpdatePreferences(useCase)}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium capitalize">
                        {useCase.toLowerCase().replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {useCase === 'CONTRACT_CERTIFICATION' && 'For contract certifications and experience letters'}
                        {useCase === 'INVOICE_PROCESSING' && 'For invoices and receipts'}
                        {useCase === 'LEGAL_DOCUMENTS' && 'For legal documents and court filings'}
                        {useCase === 'CUSTOM' && 'Define your own extraction fields'}
                      </p>
                    </div>
                    {preferences?.useCase === useCase && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Custom Fields</Label>
                  <p className="text-sm text-muted-foreground">
                    Fields that will be extracted from your documents
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Manage Fields
                </Button>
              </div>
              
              {preferences?.customFields && preferences.customFields.length > 0 ? (
                <div className="grid gap-2">
                  {preferences.customFields.slice(0, 5).map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium">{field.name}</span>
                        <span className="text-sm text-muted-foreground">{field.description}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {field.type}
                        </Badge>
                        {field.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {preferences.customFields.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{preferences.customFields.length - 5} more fields
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom fields configured
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your account details and email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSaveProfile}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={organization.name}
                  onChange={(e) => setOrganization(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              <Button type="submit" className="mt-4" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">
                  {user?.plan === 'free' && 'Free Plan - $0/month'}
                  {user?.plan === 'pro' && 'Professional Plan - $49/month'}
                  {user?.plan === 'business' && 'Business Plan - $99/month'}
                </p>
              </div>
              <Badge>
                {user?.plan === 'free' && 'Free'}
                {user?.plan === 'pro' && 'Pro'}
                {user?.plan === 'business' && 'Business'}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documents this month</span>
                <span className="font-medium">0 / 
                  {user?.plan === 'free' && ' 50'}
                  {user?.plan === 'pro' && ' 1,000'}
                  {user?.plan === 'business' && ' Unlimited'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">API calls</span>
                <span className="font-medium">0 / 
                  {user?.plan === 'free' && ' 100'}
                  {user?.plan === 'pro' && ' 10,000'}
                  {user?.plan === 'business' && ' Unlimited'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Change Plan</Button>
              <Button variant="outline">Billing History</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your documents
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Processing Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when document processing completes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summary of your activity
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}