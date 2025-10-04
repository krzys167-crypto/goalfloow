import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, TrendingUp, DollarSign, Target, LogOut } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import logo from "@/assets/logo.png";
import { AddExpenseModal } from "@/components/AddExpenseModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/signin");
      return;
    }
    
    setUser(user);
    setLoading(false);
  };

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false })
      .limit(5);
    
    if (data) {
      setExpenses(data);
    }
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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="GoalFlow" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">GoalFlow</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut} size="sm" className="text-xs sm:text-sm">
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || "there"}! 👋
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">Here's your financial overview</p>
        </div>

        {/* Monthly Total Card */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 glass-card rounded-2xl sm:rounded-3xl hover-lift border-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">Total This Month</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">$0.00</h2>
              <p className="text-success mt-1 sm:mt-2 flex items-center gap-1 text-xs sm:text-sm md:text-base">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                Start tracking your expenses
              </p>
            </div>
            <div className="hidden sm:block ml-4">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                <DollarSign className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Recent Expenses */}
          <div className="md:col-span-2 space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Recent Expenses</h3>
            <Card className="p-4 sm:p-6 glass-card rounded-2xl text-center py-12 sm:py-16 md:py-20">
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">No expenses yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Click the + button to add your first expense</p>
            </Card>
          </div>

          {/* Goals Sidebar */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Your Goals</h3>
            <Card className="p-4 sm:p-6 glass-card rounded-2xl">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm truncate">Emergency Fund</p>
                    <p className="text-xs text-muted-foreground">$0 / $5,000</p>
                  </div>
                </div>
                <Progress value={0} className="h-2" />
                
                <div className="pt-3 sm:pt-4 border-t">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">Add more goals to track your progress</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 min-w-[56px] min-h-[56px] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full shadow-2xl hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none z-50"
        aria-label="Add expense"
      >
        <Plus className="h-8 w-8 text-primary-foreground group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchExpenses}
      />
    </div>
  );
};

export default Dashboard;
