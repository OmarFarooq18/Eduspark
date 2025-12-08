import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Header } from '@/components/EduSpark/Header';
import { ResourceSearch } from '@/components/EduSpark/ResourceSearch';
import { StatsCards } from '@/components/EduSpark/StatsCards';
import { SubjectFilter } from '@/components/EduSpark/SubjectFilter';
import { ResourceCard } from '@/components/EduSpark/ResourceCard';
import { StudyTimer } from '@/components/EduSpark/StudyTimer';
import { SUBJECTS, INITIAL_RESOURCES } from '@/data/resources';
import { Resource } from '@/types/resource';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';

const STORAGE_KEYS = {
  customResources: 'eduspark-custom-resources',
};

export default function Index() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { bookmarks, courseProgress, loading: dataLoading, toggleBookmark, updateProgress } = useUserData();
  const navigate = useNavigate();
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [highlightedResourceId, setHighlightedResourceId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    // Load custom resources from localStorage
    const customResourcesData = localStorage.getItem(STORAGE_KEYS.customResources);
    if (customResourcesData) {
      const customResources = JSON.parse(customResourcesData);
      setResources([...customResources, ...INITIAL_RESOURCES]);
    }
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleResourceFound = (newResource: Resource) => {
    const normalizedNewTitle = newResource.title.toLowerCase().trim();
    const existingIndex = resources.findIndex(
      r => r.title.toLowerCase().trim() === normalizedNewTitle
    );

    let updatedResources: Resource[];
    if (existingIndex !== -1) {
      updatedResources = [...resources];
      updatedResources[existingIndex] = newResource;
    } else {
      updatedResources = [newResource, ...resources];
    }
    
    setResources(updatedResources);
    
    const customResources = updatedResources.filter(r => !INITIAL_RESOURCES.find(ir => ir.id === r.id));
    localStorage.setItem(STORAGE_KEYS.customResources, JSON.stringify(customResources));
    
    setSelectedSubject('');
    setSearchTerm('');
    setHighlightedResourceId(newResource.id);
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    setTimeout(() => {
      setHighlightedResourceId(null);
    }, 5000);
  };

  const filteredResources = resources.filter(resource => {
    const matchSubject = !selectedSubject || resource.subject === selectedSubject;
    const matchSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSubject && matchSearch;
  });

  const stats = {
    completed: Object.values(courseProgress).filter(s => s === 'completed').length,
    inProgress: Object.values(courseProgress).filter(s => s === 'in-progress').length,
    bookmarked: bookmarks.length,
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-12 w-full bg-secondary" />
          <Skeleton className="h-8 w-3/4 bg-secondary" />
          <Skeleton className="h-8 w-1/2 bg-secondary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = profile?.name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen gradient-hero">
      <Header 
        userName={userName}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResourceSearch onResourceFound={handleResourceFound} />
        
        <StatsCards 
          completed={stats.completed}
          inProgress={stats.inProgress}
          bookmarked={stats.bookmarked}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <StudyTimer />
            <SubjectFilter 
              subjects={SUBJECTS}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-display text-foreground">
                {selectedSubject || "All Courses"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredResources.length} courses available
              </span>
            </div>
            
            {filteredResources.length > 0 ? (
              <div className="grid gap-6">
                {filteredResources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isBookmarked={bookmarks.includes(String(resource.id))}
                    progressStatus={courseProgress[String(resource.id)] || 'not-started'}
                    isHighlighted={highlightedResourceId === resource.id}
                    onToggleBookmark={() => toggleBookmark(String(resource.id))}
                    onUpdateProgress={() => updateProgress(String(resource.id))}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Search className="text-muted-foreground mx-auto mb-4" size={48} />
                <p className="text-foreground text-lg font-display">No courses found</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Try a different search term or select another subject
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
