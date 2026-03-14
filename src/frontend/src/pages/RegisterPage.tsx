import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, Package } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export default function RegisterPage() {
  const { role } = useParams({ from: "/register/$role" });
  const navigate = useNavigate();
  const { register, login } = useApp();

  const [mode, setMode] = useState<"register" | "login">("register");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const targetRole = role === "sender" ? "sender" : "customer";
  const isCustomer = targetRole === "customer";

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regLocation) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = register({
      name: regName,
      email: regEmail,
      password: regPassword,
      location: regLocation,
      role: targetRole,
    });
    setLoading(false);
    if (result.success) {
      toast.success("Welcome to MEDISHARE!");
      navigate({ to: isCustomer ? "/customer" : "/sender" });
    } else {
      toast.error(result.error || "Registration failed");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      navigate({ to: isCustomer ? "/customer" : "/sender" });
    } else {
      toast.error(result.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="gradient-hero px-6 py-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </button>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            {isCustomer ? (
              <Heart className="w-5 h-5 text-white" />
            ) : (
              <Package className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {isCustomer ? "Customer" : "Sender"} Portal
            </h1>
            <p className="text-white/70 text-sm">
              {isCustomer
                ? "Find and book medicines nearby"
                : "List your medicines and help others"}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl">
                Get Started
              </CardTitle>
              <CardDescription>
                Create an account or sign in to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as "register" | "login")}
              >
                <TabsList className="w-full mb-5">
                  <TabsTrigger value="register" className="flex-1">
                    Register
                  </TabsTrigger>
                  <TabsTrigger value="login" className="flex-1">
                    Login
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input
                        id="reg-name"
                        data-ocid="register.input"
                        placeholder="Priya Sharma"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        data-ocid="register.input"
                        type="email"
                        placeholder="priya@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        data-ocid="register.input"
                        type="password"
                        placeholder="Create a password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-location">Your Location</Label>
                      <Input
                        id="reg-location"
                        data-ocid="register.input"
                        placeholder="e.g. Koramangala, Bangalore"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                      />
                    </div>
                    <div className="bg-secondary rounded-lg px-3 py-2 text-sm text-secondary-foreground">
                      Role: <strong className="capitalize">{targetRole}</strong>
                    </div>
                    <Button
                      data-ocid="register.submit_button"
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        data-ocid="register.input"
                        type="email"
                        placeholder="priya@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        data-ocid="register.input"
                        type="password"
                        placeholder="Your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      data-ocid="register.submit_button"
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
