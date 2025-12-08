import { Award, Book, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  completed: number;
  inProgress: number;
  bookmarked: number;
}

export function StatsCards({ completed, inProgress, bookmarked }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-card border-success/20 shadow-card hover:shadow-hover transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="text-2xl font-bold font-display text-foreground">{completed}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <Award className="text-success" size={28} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-info/20 shadow-card hover:shadow-hover transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">In Progress</p>
              <p className="text-2xl font-bold font-display text-foreground">{inProgress}</p>
            </div>
            <div className="p-3 bg-info/10 rounded-lg">
              <Book className="text-info" size={28} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-accent/20 shadow-card hover:shadow-hover transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Bookmarked</p>
              <p className="text-2xl font-bold font-display text-foreground">{bookmarked}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Bookmark className="text-accent" size={28} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
