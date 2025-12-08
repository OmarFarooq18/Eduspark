import { useState } from 'react';
import { Play, Pause, RotateCcw, Clock, Target, Flame, Coffee, Brain, ChevronDown, ChevronUp, Settings, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import { cn } from '@/lib/utils';

export function StudyTimer() {
  const {
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
  } = useStudyTimer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGoalEditor, setShowGoalEditor] = useState(false);

  const modeConfig = {
    focus: {
      label: 'Focus',
      shortLabel: 'Focus',
      icon: Brain,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      settingKey: 'focusDuration' as const,
    },
    short_break: {
      label: 'Short Break',
      shortLabel: 'Short',
      icon: Coffee,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      settingKey: 'shortBreakDuration' as const,
    },
    long_break: {
      label: 'Long Break',
      shortLabel: 'Long',
      icon: Coffee,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      settingKey: 'longBreakDuration' as const,
    },
  };

  const currentConfig = modeConfig[mode];
  const ModeIcon = currentConfig.icon;

  const goalOptions = [60, 90, 120, 150, 180, 240];

  const adjustDuration = (key: keyof typeof settings, delta: number) => {
    const current = settings[key];
    const newValue = Math.max(1, Math.min(120, current + delta));
    updateSettings({ [key]: newValue });
  };

  return (
    <Card className={cn(
      "border transition-all duration-300 overflow-hidden",
      currentConfig.borderColor,
      currentConfig.bgColor,
      isExpanded ? "shadow-glow" : ""
    )}>
      <CardContent className="p-4">
        {/* Collapsed View */}
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", currentConfig.bgColor)}>
              <ModeIcon className={cn("h-5 w-5", currentConfig.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{currentConfig.label}</p>
              <p className={cn("text-2xl font-bold font-display", currentConfig.color)}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>{completedSessions}</span>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                isRunning ? pauseTimer() : startTimer();
              }}
              className={cn("h-8 w-8 p-0 rounded-full", currentConfig.bgColor, currentConfig.color)}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-6 space-y-4 animate-fade-in">
            {/* Timer Circle */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="6" fill="none" className="text-secondary" />
                  <circle
                    cx="80" cy="80" r="72"
                    stroke="currentColor" strokeWidth="6" fill="none"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * progress) / 100}
                    className={cn("transition-all duration-1000", currentConfig.color)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ModeIcon className={cn("h-6 w-6 mb-1", currentConfig.color)} />
                  <span className={cn("text-3xl font-bold font-display", currentConfig.color)}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-3">
              <Button 
                size="default" 
                variant="outline" 
                onClick={resetTimer} 
                className="rounded-full h-10 w-10 p-0 border-border"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="default"
                onClick={isRunning ? pauseTimer : startTimer}
                className={cn(
                  "rounded-full px-6 h-10",
                  mode === 'focus' ? "bg-primary hover:bg-primary/90" 
                    : mode === 'short_break' ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {isRunning ? <><Pause className="h-4 w-4 mr-2" />Pause</> : <><Play className="h-4 w-4 mr-2" />Start</>}
              </Button>
              <Button 
                size="default" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }} 
                className={cn("rounded-full h-10 w-10 p-0 border-border", showSettings && "bg-secondary border-primary")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Mode Tabs - Vertical Stack */}
            <div className="flex flex-col gap-1.5">
              {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((key) => {
                const config = modeConfig[key];
                const Icon = config.icon;
                const isActive = mode === key;
                return (
                  <button
                    key={key}
                    onClick={() => switchMode(key)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                      isActive ? cn(
                        "text-background border-transparent",
                        key === 'focus' && "bg-primary",
                        key === 'short_break' && "bg-emerald-500",
                        key === 'long_break' && "bg-blue-500"
                      ) : "text-muted-foreground hover:text-foreground bg-transparent border-border hover:bg-secondary/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="space-y-3 p-3 bg-secondary/30 rounded-lg animate-fade-in">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timer Duration (minutes)</p>
                
                {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((key) => {
                  const config = modeConfig[key];
                  const Icon = config.icon;
                  const value = settings[config.settingKey];
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", config.color)} />
                        <span className="text-sm">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => adjustDuration(config.settingKey, -5)}
                          disabled={isRunning}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className={cn("w-8 text-center font-bold", config.color)}>{value}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => adjustDuration(config.settingKey, 5)}
                          disabled={isRunning}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Daily Progress */}
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Daily Goal</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-6 px-2"
                  onClick={() => setShowGoalEditor(!showGoalEditor)}
                >
                  {Math.floor(dailyGoal / 60)}h {dailyGoal % 60 > 0 ? `${dailyGoal % 60}m` : ''}
                </Button>
              </div>
              
              <Progress value={dailyProgress} className="h-2" />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m studied</span>
                <span>{Math.round(dailyProgress)}%</span>
              </div>

              {showGoalEditor && (
                <div className="flex flex-wrap gap-1.5 pt-1 animate-fade-in">
                  {goalOptions.map((mins) => (
                    <Button
                      key={mins}
                      size="sm"
                      variant={dailyGoal === mins ? "default" : "outline"}
                      className="text-xs h-6 px-2"
                      onClick={() => {
                        updateDailyGoal(mins);
                        setShowGoalEditor(false);
                      }}
                    >
                      {Math.floor(mins / 60)}h{mins % 60 > 0 ? ` ${mins % 60}m` : ''}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Session Stats - Compact */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
              <div className="text-center p-2 bg-secondary/30 rounded-lg">
                <Flame className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{completedSessions}</p>
                <p className="text-[10px] text-muted-foreground">Sessions</p>
              </div>
              <div className="text-center p-2 bg-secondary/30 rounded-lg">
                <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{todayMinutes}</p>
                <p className="text-[10px] text-muted-foreground">Minutes</p>
              </div>
              <div className="text-center p-2 bg-secondary/30 rounded-lg">
                <Target className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{Math.round(dailyProgress)}%</p>
                <p className="text-[10px] text-muted-foreground">Goal</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
