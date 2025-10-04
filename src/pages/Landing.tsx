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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="GoalFlow" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">GoalFlow</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" onClick={() => navigate("/signin")} className="hidden sm:inline-flex text-sm md:text-base" size="sm">
              Sign In
            </Button>
            <Button onClick={() => navigate("/signup")} size="sm" className="text-sm md:text-base md:h-10 md:px-6">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32 text-center relative z-10">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight gradient-text leading-tight px-2">
            Every Dollar Has a Purpose
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Track expenses. Link to goals. Build the life you want.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")} 
              className="text-base sm:text-lg px-8 sm:px-10 h-12 sm:h-14 shadow-xl hover:shadow-2xl group w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="glass" 
              onClick={() => navigate("/signin")} 
              className="text-base sm:text-lg px-8 sm:px-10 h-12 sm:h-14 w-full sm:w-auto"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto relative">
          <Card className="p-6 sm:p-8 md:p-10 text-center space-y-4 sm:space-y-6 glass-card hover-lift hover-glow border-2 rounded-2xl sm:rounded-3xl group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Quick Expense Entry</h3>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Log expenses in seconds with voice or tap
            </p>
          </Card>

          <Card className="p-6 sm:p-8 md:p-10 text-center space-y-4 sm:space-y-6 glass-card hover-lift hover-glow border-2 rounded-2xl sm:rounded-3xl group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-foreground" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Goal-Linked Spending</h3>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Connect every expense to your life goals
            </p>
          </Card>

          <Card className="p-6 sm:p-8 md:p-10 text-center space-y-4 sm:space-y-6 glass-card hover-lift hover-glow border-2 rounded-2xl sm:rounded-3xl group sm:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-accent-foreground" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Smart Insights</h3>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              See where your money is actually going
            </p>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 text-center relative z-10">
        <Card className="glass-card p-6 sm:p-8 max-w-2xl mx-auto rounded-2xl">
          <p className="text-base sm:text-lg text-muted-foreground">
            Join <span className="text-primary font-bold text-xl sm:text-2xl">100+</span> people building purposeful financial lives
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 sm:mt-16 md:mt-20 bg-card/50 backdrop-blur relative z-10">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors hover:underline">About</a>
            <a href="#" className="hover:text-foreground transition-colors hover:underline">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors hover:underline">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors hover:underline">Contact</a>
          </div>
          <div className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
            © 2025 GoalFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
