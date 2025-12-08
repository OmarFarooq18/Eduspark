import { GraduationCap, Search, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLogout: () => void;
}

export function Header({ userName, searchTerm, onSearchChange, onLogout }: HeaderProps) {
  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="gradient-primary p-2 rounded-lg mr-3">
              <GraduationCap className="text-primary-foreground" size={24} />
            </div>
            <span className="text-xl font-bold font-display text-primary">EduSpark</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 w-64 bg-secondary border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2 bg-secondary px-3 py-2 rounded-lg">
              <User className="text-primary" size={18} />
              <span className="text-sm text-foreground">{userName}</span>
            </div>

            <Button
              onClick={onLogout}
              variant="ghost"
              className="text-primary hover:bg-primary/10"
            >
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
