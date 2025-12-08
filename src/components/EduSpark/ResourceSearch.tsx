import { useState } from 'react';
import { Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Resource } from '@/types/resource';

interface ResourceSearchProps {
  onResourceFound: (resource: Resource) => void;
}

export function ResourceSearch({ onResourceFound }: ResourceSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Tell us what you want to learn",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-resources', {
        body: { query: query.trim() }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to find resources');
      }

      const newResource: Resource = {
        ...data.resource,
        id: Date.now(),
        rating: 4.5,
        reviews: 0,
        type: 'Video Course',
        subject: data.resource.subject || 'Other',
      };

      onResourceFound(newResource);
      setQuery('');
      
      toast({
        title: "Resource found!",
        description: `Added "${newResource.title}" to your courses`,
      });

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Please try a different search term",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="gradient-accent rounded-xl p-6 mb-8 animate-fade-in shadow-card animate-pulse-glow">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Sparkles className="text-accent-foreground" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold font-display text-foreground mb-2">
            Need a Specific Resource?
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Tell us what you want to learn, and we'll find the best free resources for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
              placeholder="e.g., Machine Learning, React Hooks, Quantum Physics..."
              className="flex-1 bg-background/50 border-accent/30 focus:ring-accent"
              disabled={isSearching}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all min-w-[160px]"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <MessageSquare size={18} className="mr-2" />
                  Find Resource
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
