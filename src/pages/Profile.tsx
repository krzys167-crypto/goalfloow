import { useEffect, useState } from "react";
import { User, Settings, HelpCircle, Bell, CreditCard, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState("");
  const [expenseCount, setExpenseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/signin");
        return;
      }
      
      setUserEmail(user.email || "");

      const { count } = await supabase
        .from('expenses')
        .select('*', { count: 'exact', head: true });

      setExpenseCount(count || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "See you soon! 👋",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-16">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Header */}
        <Card className="mb-6 glass-card rounded-3xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-primary to-primary-glow">
                <AvatarFallback className="text-primary-foreground text-xl sm:text-2xl font-bold">
                  {getInitials(userEmail)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-1">{userEmail}</h2>
                <p className="text-sm sm:text-base text-muted-foreground">{expenseCount} expenses tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          <Card className="glass-card rounded-2xl hover-lift cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">Settings</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manage your preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl hover-lift cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Configure alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl hover-lift cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">Payment Methods</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manage cards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl hover-lift cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted/20 rounded-full flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">Help & Support</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Get assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full mt-6 rounded-2xl h-12 sm:h-14 text-destructive border-destructive/50 hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
