import { Filter, Grid, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Subject } from '@/types/resource';

interface SubjectFilterProps {
  subjects: Subject[];
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

export function SubjectFilter({ subjects, selectedSubject, onSubjectChange }: SubjectFilterProps) {
  return (
    <Card className="bg-card border-border shadow-card sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold font-display text-primary flex items-center">
          <Filter className="mr-2" size={20} />
          Subjects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => onSubjectChange('')}
          variant={!selectedSubject ? "default" : "ghost"}
          className={`w-full justify-start ${!selectedSubject ? 'gradient-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}`}
        >
          <Grid className="mr-2" size={16} />
          All Courses
        </Button>

        {subjects.map(subject => (
          <Button
            key={subject.id}
            onClick={() => onSubjectChange(subject.name)}
            variant={selectedSubject === subject.name ? "default" : "ghost"}
            className={`w-full justify-start ${selectedSubject === subject.name ? 'gradient-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}`}
          >
            <Book className="mr-2" size={16} />
            {subject.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
