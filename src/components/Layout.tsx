
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Book, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Archive
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-legacy-cream">
      {/* Header */}
      <header className="bg-white border-b border-legacy-sepia sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Book className="h-6 w-6 text-legacy-copper mr-2" />
            <span className="text-xl font-serif text-legacy-mahogany">LegacyChain</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            {/* Mobile Menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-legacy-cream">
                <SheetHeader>
                  <SheetTitle className="font-serif text-legacy-mahogany">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-legacy-ink"
                    onClick={() => { 
                      navigate('/'); 
                      setMenuOpen(false); 
                    }}
                  >
                    <Archive className="mr-2 h-5 w-5" />
                    My Vaults
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-legacy-ink"
                    onClick={() => { 
                      navigate('/settings'); 
                      setMenuOpen(false); 
                    }}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-legacy-ink"
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Button 
                variant="ghost" 
                className="text-legacy-ink"
                onClick={() => navigate('/')}
              >
                <Archive className="mr-2 h-5 w-5" />
                My Vaults
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings')}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-legacy-sepia py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-legacy-ink/60">
            &copy; {new Date().getFullYear()} LegacyChain — Preserve your most precious memories
          </p>
        </div>
      </footer>
    </div>
  );
}
