import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Zap, Target, TrendingUp, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float-delay-2" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="GoalFlow" className="h-12 w-12" />
            <span className="text-2xl font-bold gradient-text">GoalFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/signin")} className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button onClick={() => navigate("/signup")} size="lg">
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[72px] font-bold tracking-tight gradient-text leading-tight">
            Every Dollar Has a Purpose
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track expenses. Link to goals. Build the life you want.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")} 
              className="text-lg px-10 h-14 shadow-xl hover:shadow-2xl group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="glass" 
              onClick={() => navigate("/signin")} 
              className="text-lg px-10 h-14"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          <Card className="p-10 text-center space-y-6 glass-card hover-lift hover-glow border-2 rounded-3xl group">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Quick Expense Entry</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Log expenses in seconds with voice or tap
            </p>
          </Card>

          <Card className="p-10 text-center space-y-6 glass-card hover-lift hover-glow border-2 rounded-3xl group">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-secondary-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Goal-Linked Spending</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Connect every expense to your life goals
            </p>
          </Card>

          <Card className="p-10 text-center space-y-6 glass-card hover-lift hover-glow border-2 rounded-3xl group">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Smart Insights</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              See where your money is actually going
            </p>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-16 text-center relative z-10">
        <Card className="glass-card p-8 max-w-2xl mx-auto rounded-2xl">
          <p className="text-lg text-muted-foreground">
            Join <span className="text-primary font-bold text-2xl">100+</span> people building purposeful financial lives
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 bg-card/50 backdrop-blur relative z-10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors hover:underline">About</a>
            <a href="#" className="hover:text-foreground transition-colors hover:underline">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors hover:underline">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors hover:underline">Contact</a>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-6">
            © 2025 GoalFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
