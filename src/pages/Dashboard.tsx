import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, TrendingUp, DollarSign, Target, LogOut } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import logo from "@/assets/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/signin");
      return;
    }
    
    setUser(user);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="GoalFlow" className="h-10 w-10" />
            <span className="text-2xl font-bold gradient-text">GoalFlow</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || "there"}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">Here's your financial overview</p>
        </div>

        {/* Monthly Total Card */}
        <Card className="p-8 mb-8 glass-card rounded-3xl hover-lift border-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-2 text-lg">Total This Month</p>
              <h2 className="text-5xl md:text-6xl font-bold gradient-text">$0.00</h2>
              <p className="text-success mt-2 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Start tracking your expenses
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                <DollarSign className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Recent Expenses */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold">Recent Expenses</h3>
            <Card className="p-6 glass-card rounded-2xl text-center py-20">
              <p className="text-muted-foreground mb-4">No expenses yet</p>
              <p className="text-sm text-muted-foreground">Click the + button to add your first expense</p>
            </Card>
          </div>

          {/* Goals Sidebar */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Your Goals</h3>
            <Card className="p-6 glass-card rounded-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Emergency Fund</p>
                    <p className="text-xs text-muted-foreground">$0 / $5,000</p>
                  </div>
                </div>
                <Progress value={0} className="h-2" />
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">Add more goals to track your progress</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full shadow-2xl hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none z-50"
        aria-label="Add expense"
      >
        <Plus className="h-8 w-8 text-primary-foreground group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default Dashboard;
