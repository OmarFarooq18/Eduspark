import { 
  CheckCircle, 
  Signal, 
  Clock, 
  Star, 
  Link2, 
  Youtube, 
  FileText, 
  ExternalLink, 
  BookmarkPlus, 
  Bookmark,
  Book,
  GraduationCap,
  Play
} from 'lucide-react';

const getVideoIcon = (url: string) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return <Youtube className="text-destructive mr-3" size={20} />;
  }
  if (url.includes('khanacademy.org')) {
    return <GraduationCap className="text-success mr-3" size={20} />;
  }
  if (url.includes('freecodecamp.org') || url.includes('codecademy.com')) {
    return <Play className="text-primary mr-3" size={20} />;
  }
  if (url.includes('ocw.mit.edu') || url.includes('coursera.org') || url.includes('edx.org')) {
    return <GraduationCap className="text-info mr-3" size={20} />;
  }
  return <Play className="text-primary mr-3" size={20} />;
};
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Resource, ProgressStatus } from '@/types/resource';

interface ResourceCardProps {
  resource: Resource;
  isBookmarked: boolean;
  progressStatus: ProgressStatus;
  isHighlighted: boolean;
  onToggleBookmark: () => void;
  onUpdateProgress: () => void;
}

const difficultyColors = {
  Beginner: 'bg-success/20 text-success border-success/30',
  Intermediate: 'bg-warning/20 text-warning border-warning/30',
  Advanced: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function ResourceCard({
  resource,
  isBookmarked,
  progressStatus,
  isHighlighted,
  onToggleBookmark,
  onUpdateProgress,
}: ResourceCardProps) {
  return (
    <Card 
      className={`bg-card border transition-all duration-300 hover:shadow-hover ${
        isHighlighted 
          ? 'border-accent shadow-lg animate-pulse-glow' 
          : 'border-border hover:border-primary/40'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold font-display text-foreground mb-1">
              {resource.title}
            </h3>
            <p className="text-sm text-primary">{resource.subject}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onToggleBookmark}
              variant="ghost"
              size="icon"
              className={isBookmarked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}
            >
              {isBookmarked ? <Bookmark size={20} fill="currentColor" /> : <BookmarkPlus size={20} />}
            </Button>
            <Badge className="bg-success/20 text-success border-success/30">
              <CheckCircle className="mr-1" size={12} />
              Free
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{resource.description}</p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={difficultyColors[resource.difficulty]}>
            <Signal className="mr-1" size={12} />
            {resource.difficulty}
          </Badge>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            <Clock className="mr-1" size={12} />
            {resource.duration}
          </Badge>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            <Star className="mr-1 text-primary" size={12} />
            {resource.rating} ({resource.reviews} reviews)
          </Badge>
        </div>

        <Button
          onClick={onUpdateProgress}
          variant="outline"
          className={`w-full ${
            progressStatus === 'completed'
              ? 'bg-success/20 text-success border-success/30 hover:bg-success/30'
              : progressStatus === 'in-progress'
              ? 'bg-info/20 text-info border-info/30 hover:bg-info/30'
              : 'bg-secondary text-foreground border-border hover:bg-secondary/80'
          }`}
        >
          {progressStatus === 'completed' ? (
            <>
              <CheckCircle className="mr-2" size={16} />
              Completed
            </>
          ) : progressStatus === 'in-progress' ? (
            <>
              <Book className="mr-2" size={16} />
              In Progress
            </>
          ) : (
            <>
              <Book className="mr-2" size={16} />
              Start Learning
            </>
          )}
        </Button>
        
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center">
            <Link2 className="mr-2" size={16} />
            Course Resources
          </h4>
          <div className="space-y-2">
            {resource.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-lg border border-border hover:border-primary/40 transition group"
              >
                <div className="flex items-center">
                  {link.type === 'video' ? (
                    getVideoIcon(link.url)
                  ) : (
                    <FileText className="text-info mr-3" size={20} />
                  )}
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
