/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Calendar, ArrowRight, Clock, BookOpen, Utensils, Moon, Music, Palette, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';

interface ScheduleItem {
    id: string;
    time: string;
    title: string;
    description: string;
    type: 'learning' | 'meal' | 'nap' | 'play' | 'activity' | 'art' | 'music';
    duration: string;
}

interface DaySchedule {
    day: string;
    dayAr: string;
    dayFr: string;
    date: string;
    items: ScheduleItem[];
}

const ParentSchedule = () => {
    const { profile, loading: authLoading } = useAuth();
    const { t, dir, language } = useLanguage();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

    useEffect(() => {
        if (!authLoading) {
            if (profile) {
                loadSchedule();
            } else {
                navigate('/auth');
            }
        }
    }, [profile, authLoading, navigate]);

    useEffect(() => {
        // This useEffect now depends on authLoading and profile to ensure schedule loads only after auth check
        if (!authLoading && profile) {
            loadSchedule();
        }
    }, [currentWeekOffset, language, authLoading, profile]);


    const loadSchedule = () => {
        const today = new Date();
        today.setDate(today.getDate() + (currentWeekOffset * 7));
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());

        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];

        const schedule: DaySchedule[] = days.map((day, index) => {
            const date = new Date(sunday);
            date.setDate(sunday.getDate() + index);
            return {
                day: day,
                dayAr: t('days.' + day, 'ar'),
                dayFr: t('days.' + day, 'fr'),
                date: date.toISOString().split('T')[0],
                items: getScheduleItems(index)
            };
        });

        setWeekSchedule(schedule);
        // Set today as default if it's in the week
        const todayIndex = new Date().getDay();
        if (todayIndex < 5 && currentWeekOffset === 0) {
            setSelectedDayIndex(todayIndex);
        }
        setIsLoading(false);
    };

    const getScheduleItems = (dayIndex: number): ScheduleItem[] => {
        const baseSchedule: ScheduleItem[] = [
            {
                id: '1',
                time: '08:00',
                title: t('schedule.welcome'),
                description: t('schedule.welcomeDesc'),
                type: 'play',
                duration: '30 min'
            },
            {
                id: '2',
                time: '08:30',
                title: t('schedule.learning1'),
                description: t('schedule.learning1Desc'),
                type: 'learning',
                duration: '45 min'
            },
            {
                id: '3',
                time: '09:15',
                title: t('schedule.breakfast'),
                description: t('schedule.breakfastDesc'),
                type: 'meal',
                duration: '30 min'
            },
            {
                id: '4',
                time: '09:45',
                title: t('schedule.art'),
                description: t('schedule.artDesc'),
                type: 'art',
                duration: '45 min'
            },
            {
                id: '5',
                time: '10:30',
                title: t('schedule.outdoor'),
                description: t('schedule.outdoorDesc'),
                type: 'play',
                duration: '45 min'
            },
            {
                id: '6',
                time: '11:15',
                title: t('schedule.music'),
                description: t('schedule.musicDesc'),
                type: 'music',
                duration: '30 min'
            },
            {
                id: '7',
                time: '11:45',
                title: t('schedule.lunch'),
                description: t('schedule.lunchDesc'),
                type: 'meal',
                duration: '45 min'
            },
            {
                id: '8',
                time: '12:30',
                title: t('schedule.nap'),
                description: t('schedule.napDesc'),
                type: 'nap',
                duration: '1h 30min'
            },
            {
                id: '9',
                time: '14:00',
                title: t('schedule.learning2'),
                description: t('schedule.learning2Desc'),
                type: 'learning',
                duration: '45 min'
            },
            {
                id: '10',
                time: '14:45',
                title: t('schedule.freePlay'),
                description: t('schedule.freePlayDesc'),
                type: 'play',
                duration: '45 min'
            },
            {
                id: '11',
                time: '15:30',
                title: t('schedule.departure'),
                description: t('schedule.departureDesc'),
                type: 'activity',
                duration: '30 min'
            }
        ];

        // Add some variation based on day
        if (dayIndex === 1 || dayIndex === 3) { // Monday, Wednesday
            baseSchedule[3] = {
                ...baseSchedule[3],
                title: t('schedule.sports'),
                description: t('schedule.sportsDesc'),
                type: 'activity'
            };
        }

        return baseSchedule;
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'learning': return <BookOpen className="w-5 h-5" />;
            case 'meal': return <Utensils className="w-5 h-5" />;
            case 'nap': return <Moon className="w-5 h-5" />;
            case 'play': return <Users className="w-5 h-5" />;
            case 'art': return <Palette className="w-5 h-5" />;
            case 'music': return <Music className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'learning': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            case 'meal': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
            case 'nap': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30';
            case 'play': return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'art': return 'bg-pink-500/10 text-pink-500 border-pink-500/30';
            case 'music': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'short'
        });
    };

    const isToday = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Baby className="w-12 h-12 text-primary mx-auto animate-bounce" />
                    <p className="mt-4 text-muted-foreground">{t('auth.loading')}</p>
                </div>
            </div>
        );
    }

    const selectedDay = weekSchedule[selectedDayIndex];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir={dir}>
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/parent')}
                                className="rounded-full"
                            >
                                <ArrowRight className={`w-5 h-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
                            </Button>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-foreground">{t('parent.schedule')}</h1>
                                <p className="text-xs text-muted-foreground">
                                    {t('schedule.weekly')}
                                </p>
                            </div>
                        </div>
                        <LanguageSelector />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Week Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                        className="rounded-full"
                    >
                        <ChevronRight className={`w-5 h-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
                    </Button>
                    <span className="font-medium text-foreground">
                        {currentWeekOffset === 0
                            ? t('schedule.thisWeek')
                            : currentWeekOffset > 0
                                ? t('schedule.afterWeeks').replace('{weeks}', currentWeekOffset.toString())
                                : t('schedule.beforeWeeks').replace('{weeks}', Math.abs(currentWeekOffset).toString())
                        }
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                        className="rounded-full"
                    >
                        <ChevronLeft className={`w-5 h-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
                    </Button>
                </div>

                {/* Day Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {weekSchedule.map((day, index) => (
                        <Button
                            key={day.day}
                            variant={selectedDayIndex === index ? "default" : "outline"}
                            className={`flex-col h-auto py-3 px-4 min-w-[80px] ${isToday(day.date) && selectedDayIndex !== index ? 'border-primary' : ''}`}
                            onClick={() => setSelectedDayIndex(index)}
                        >
                            <span className="text-xs opacity-70">
                                {t('days.' + day.day).slice(0, 3)}
                            </span>
                            <span className="font-bold">{formatDate(day.date)}</span>
                            {isToday(day.date) && (
                                <Badge variant="secondary" className="text-[10px] mt-1 px-1">
                                    {t('schedule.today')}
                                </Badge>
                            )}
                        </Button>
                    ))}
                </div>

                {/* Schedule Timeline */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            {t('days.' + selectedDay?.day)} - {formatDate(selectedDay?.date || '')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedDay?.items.map((item, index) => (
                            <div key={item.id} className="relative flex gap-4">
                                {/* Timeline Line */}
                                {index < selectedDay.items.length - 1 && (
                                    <div className="absolute top-12 bottom-0 left-[19px] w-0.5 bg-border" style={{ transform: dir === 'rtl' ? 'translateX(50%)' : 'translateX(-50%)', left: dir === 'rtl' ? 'auto' : '19px', right: dir === 'rtl' ? '19px' : 'auto' }} />
                                )}

                                {/* Time */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(item.type)} border z-10`}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-primary">{item.time}</span>
                                        <Badge variant="outline" className="text-xs">{item.duration}</Badge>
                                    </div>
                                    <h4 className="font-medium text-foreground">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default ParentSchedule;
