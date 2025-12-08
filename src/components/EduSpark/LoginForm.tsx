import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="bg-card border border-border p-8 rounded-xl shadow-card w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="gradient-primary p-3 rounded-full w-fit mx-auto mb-4 shadow-glow">
            <GraduationCap className="text-primary-foreground" size={32} />
          </div>
          <h1 className="text-3xl font-bold font-display text-primary">EduSpark</h1>
          <p className="text-muted-foreground mt-2">Your curated learning platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 bg-secondary border-border focus:ring-primary"
              placeholder="john@student.edu"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 bg-secondary border-border focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          
          <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Login
          </Button>
        </form>

        <div className="mt-6 p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Demo: Use any email and password</p>
        </div>
      </div>
    </div>
  );
}
