import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Zap, Shield, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // In a real app, you'd check authentication status here
  // For demo purposes, we redirect to login
  useEffect(() => {
    // Uncomment to auto-redirect authenticated users to dashboard
    // navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DocuMind AI</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")}>Get Started</Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16 animate-in">
          <h1 className="text-5xl font-bold tracking-tight">
            Intelligent Document Processing
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Automate document processing with AI. Save 10+ hours per week on manual document handling.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/register")}>
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Process documents in seconds with our AI-powered extraction",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Enterprise-grade security with end-to-end encryption",
            },
            {
              icon: BarChart3,
              title: "Smart Analytics",
              description: "Track performance and gain insights from your data",
            },
            {
              icon: FileText,
              title: "Multi-Format",
              description: "Support for PDF, images, and various document types",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 py-16 border-t">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground">
            Join thousands of businesses automating their document workflows
          </p>
          <Button size="lg" onClick={() => navigate("/register")}>
            Create Free Account
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
