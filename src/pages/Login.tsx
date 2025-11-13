// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 CORRECCIÓN: Usar el loading del auth combinado con el estado local
  const isLoading = authLoading || isSubmitting;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔥 CORRECCIÓN: Prevenir múltiples envíos
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Login error:', error);
      
      // 🔥 CORRECCIÓN: Mensaje de error específico para rate limiting
      if (error.status === 429) {
        toast.error("Too many attempts. Please wait 15 minutes before trying again.");
      } else {
        toast.error(error.message || "Invalid email or password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6 animate-in">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 rounded-lg bg-primary">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">DocuMind AI</h1>
          </div>
          <p className="text-muted-foreground">
            Intelligent Document Processing Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/register")}
                disabled={isLoading}
              >
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}