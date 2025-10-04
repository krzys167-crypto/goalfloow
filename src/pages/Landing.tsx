import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Zap, Target, TrendingUp } from "lucide-react";
import logo from "@/assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="GoalFlow" className="h-10 w-10" />
            <span className="text-2xl font-bold text-primary">GoalFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/signup")}>Get Started Free</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Every Dollar Has a Purpose
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Track expenses. Link to goals. Build the life you want.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/signup")} className="text-lg px-8">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/signin")} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Quick Expense Entry</h3>
            <p className="text-muted-foreground">
              Log expenses in seconds with voice or tap
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-semibold">Goal-Linked Spending</h3>
            <p className="text-muted-foreground">
              Connect every expense to your life goals
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold">Smart Insights</h3>
            <p className="text-muted-foreground">
              See where your money is actually going
            </p>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">
          Join 100+ people building purposeful financial lives
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            © 2025 GoalFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
