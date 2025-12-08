import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'focus' | 'short_break' | 'long_break';

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const SETTINGS_STORAGE_KEY = 'eduspark-timer-settings';

export function useStudyTimer() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(120);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Track if settings have actually changed to avoid resetting timer on pause
  const prevSettingsRef = useRef(settings);
  const prevModeRef = useRef(mode);
  
  // Update timeLeft when settings or mode change (not when pause/resume)
  useEffect(() => {
    const settingsChanged = JSON.stringify(prevSettingsRef.current) !== JSON.stringify(settings);
    const modeChanged = prevModeRef.current !== mode;
    
    if ((settingsChanged || modeChanged) && !isRunning) {
      const duration = mode === 'focus' 
        ? settings.focusDuration 
        : mode === 'short_break' 
          ? settings.shortBreakDuration 
          : settings.longBreakDuration;
      setTimeLeft(duration * 60);
    }
    
    prevSettingsRef.current = settings;
    prevModeRef.current = mode;
  }, [settings, mode]);

  const fetchTodayData = useCallback(async () => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('duration_minutes, session_type')
      .eq('user_id', user.id)
      .gte('completed_at', today.toISOString());

    if (sessions) {
      const focusSessions = sessions.filter(s => s.session_type === 'focus');
      const totalMinutes = focusSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
      setTodayMinutes(totalMinutes);
      setCompletedSessions(focusSessions.length);
    }

    const { data: goalData } = await supabase
      .from('study_goals')
      .select('daily_goal_minutes')
      .eq('user_id', user.id)
      .single();

    if (goalData) {
      setDailyGoal(goalData.daily_goal_minutes);
    }
  }, [user]);

  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    
    if (!user) return;

    const duration = mode === 'focus' 
      ? settings.focusDuration 
      : mode === 'short_break' 
        ? settings.shortBreakDuration 
        : settings.longBreakDuration;

    await supabase.from('study_sessions').insert({
      user_id: user.id,
      session_type: mode,
      duration_minutes: duration,
    });

    if (mode === 'focus') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      setTodayMinutes(prev => prev + duration);

      toast({
        title: "Focus session complete!",
        description: `Great work! You've completed ${newCompleted} session${newCompleted > 1 ? 's' : ''} today.`,
      });

      if (newCompleted % settings.sessionsBeforeLongBreak === 0) {
        setMode('long_break');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('short_break');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      toast({
        title: "Break complete!",
        description: "Ready for another focus session?",
      });
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);
    }

    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRcAO5Peli4CAD2V2fGLNgAAQJXW8YkzAABBldXxiTMAAEGV1fGJMwAAQZXV8YkzAABBldXxiTMAAEGV1fGJMw==');
      audio.volume = 0.3;
      audio.play();
    } catch (e) {}
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = mode === 'focus' 
      ? settings.focusDuration 
      : mode === 'short_break' 
        ? settings.shortBreakDuration 
        : settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    const duration = newMode === 'focus' 
      ? settings.focusDuration 
      : newMode === 'short_break' 
        ? settings.shortBreakDuration 
        : settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateDailyGoal = async (minutes: number) => {
    if (!user) return;

    await supabase.from('study_goals').upsert({
      user_id: user.id,
      daily_goal_minutes: minutes,
    }, {
      onConflict: 'user_id',
    });

    setDailyGoal(minutes);
    toast({
      title: "Goal updated",
      description: `Daily goal set to ${Math.floor(minutes / 60)}h ${minutes % 60}m`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDuration = mode === 'focus' 
    ? settings.focusDuration 
    : mode === 'short_break'
      ? settings.shortBreakDuration
      : settings.longBreakDuration;
  
  const progress = ((currentDuration * 60 - timeLeft) / (currentDuration * 60)) * 100;
  const dailyProgress = Math.min((todayMinutes / dailyGoal) * 100, 100);

  return {
    mode,
    timeLeft,
    isRunning,
    completedSessions,
    todayMinutes,
    dailyGoal,
    progress,
    dailyProgress,
    settings,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    updateSettings,
    updateDailyGoal,
  };
}
