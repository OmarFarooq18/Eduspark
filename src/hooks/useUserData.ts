import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProgressStatus } from '@/types/resource';

export function useUserData() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, ProgressStatus>>({});
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      setCourseProgress({});
      setLoading(false);
      return;
    }

    try {
      // Fetch bookmarks
      const { data: bookmarkData } = await supabase
        .from('bookmarks')
        .select('resource_id')
        .eq('user_id', user.id);

      if (bookmarkData) {
        setBookmarks(bookmarkData.map(b => b.resource_id));
      }

      // Fetch progress
      const { data: progressData } = await supabase
        .from('course_progress')
        .select('resource_id, status')
        .eq('user_id', user.id);

      if (progressData) {
        const progressMap: Record<string, ProgressStatus> = {};
        progressData.forEach(p => {
          const status = p.status === 'in_progress' ? 'in-progress' : 
                         p.status === 'not_started' ? 'not-started' : 
                         p.status as ProgressStatus;
          progressMap[p.resource_id] = status;
        });
        setCourseProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const toggleBookmark = async (resourceId: string) => {
    if (!user) return;

    const isBookmarked = bookmarks.includes(resourceId);

    if (isBookmarked) {
      // Remove bookmark
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('resource_id', resourceId);
      
      setBookmarks(prev => prev.filter(id => id !== resourceId));
    } else {
      // Add bookmark
      await supabase
        .from('bookmarks')
        .insert({ user_id: user.id, resource_id: resourceId });
      
      setBookmarks(prev => [...prev, resourceId]);
    }
  };

  const updateProgress = async (resourceId: string) => {
    if (!user) return;

    const currentStatus = courseProgress[resourceId] || 'not-started';
    let newStatus: ProgressStatus;
    let dbStatus: string;
    
    if (currentStatus === 'not-started') {
      newStatus = 'in-progress';
      dbStatus = 'in_progress';
    } else if (currentStatus === 'in-progress') {
      newStatus = 'completed';
      dbStatus = 'completed';
    } else {
      newStatus = 'not-started';
      dbStatus = 'not_started';
    }

    // Upsert progress
    await supabase
      .from('course_progress')
      .upsert({ 
        user_id: user.id, 
        resource_id: resourceId,
        status: dbStatus 
      }, {
        onConflict: 'user_id,resource_id'
      });

    setCourseProgress(prev => ({ ...prev, [resourceId]: newStatus }));
  };

  return {
    bookmarks,
    courseProgress,
    loading,
    toggleBookmark,
    updateProgress,
  };
}
