/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Image, ArrowRight, Download, Calendar, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface Photo {
    id: string;
    url: string;
    thumbnail: string;
    title: string;
    date: string;
    childName: string;
    activity: string;
    liked: boolean;
}

const ParentPhotos = () => {
    const { t, dir, language } = useLanguage();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [selectedChild, setSelectedChild] = useState<string>('all');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            navigate('/auth');
            return;
        }
        loadPhotos();
    };

    const loadPhotos = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: children, error: childrenError } = await (supabase as any)
                .from('children')
                .select('id, name')
                .eq('parent_id', session.user.id);

            if (childrenError) {
                console.error('Error fetching children:', childrenError);
                setIsLoading(false);
                return;
            }

            if (!children || children.length === 0) {
                setPhotos([]);
                setIsLoading(false);
                return;
            }

            const childIds = children.map(c => c.id);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: activities, error: activitiesError } = await (supabase as any)
                .from('child_activities')
                .select('*')
                .in('child_id', childIds)
                .not('photo_url', 'is', null)
                .order('created_at', { ascending: false });

            if (activitiesError) {
                console.error('Error fetching activities:', activitiesError);
                setIsLoading(false);
                return;
            }

            console.log('Fetched activities:', activities);

            // Map to Photo interface
            const photosData: Photo[] = (activities || []).map((activity: any, index: number) => {
                const child = children?.find((c: any) => c.id === activity.child_id);
                const date = new Date(activity.created_at).toISOString().split('T')[0];
                
                return {
                    id: activity.id,
                    url: activity.photo_url,
                    thumbnail: activity.photo_url, // For now, same as url
                    title: activity.description || (language === 'ar' ? 'نشاط' : language === 'fr' ? 'Activité' : 'Activity'),
                    date,
                    childName: child?.name || (language === 'ar' ? 'الطفل' : 'Child'),
                    activity: activity.activity_type || (language === 'ar' ? 'نشاط' : 'Activity'),
                    liked: false // Could add a likes system later
                };
            });

            setPhotos(photosData);
        } catch (error) {
            console.error('Error loading photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLike = (id: string) => {
        setPhotos(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
        if (selectedPhoto?.id === id) {
            setSelectedPhoto(prev => prev ? { ...prev, liked: !prev.liked } : null);
        }
    };

    const navigatePhoto = (direction: 'prev' | 'next') => {
        if (!selectedPhoto) return;
        const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0) newIndex = filteredPhotos.length - 1;
        if (newIndex >= filteredPhotos.length) newIndex = 0;
        setSelectedPhoto(filteredPhotos[newIndex]);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const children = ['all', language === 'ar' ? 'أحمد' : 'Ahmed', language === 'ar' ? 'سارة' : 'Sara'];
    const filteredPhotos = selectedChild === 'all'
        ? photos
        : photos.filter(p => p.childName === selectedChild);

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
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Image className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-foreground">{t('parent.photos')}</h1>
                                <p className="text-xs text-muted-foreground">
                                    {filteredPhotos.length} {language === 'ar' ? 'صورة' : language === 'fr' ? 'photos' : 'photos'}
                                </p>
                            </div>
                        </div>
                        <LanguageSelector />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Child Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {children.map((child) => (
                        <Button
                            key={child}
                            variant={selectedChild === child ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedChild(child)}
                            className="whitespace-nowrap"
                        >
                            {child === 'all' ? (language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All') : child}
                        </Button>
                    ))}
                </div>

                {/* Photo Grid */}
                {filteredPhotos.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                            <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground text-lg">
                                {language === 'ar' ? 'لا توجد صور' : language === 'fr' ? 'Pas de photos' : 'No photos'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {language === 'ar' ? 'ستظهر هنا صور أنشطة طفلك من الروضة' : language === 'fr' ? 'Les photos des activités apparaîtront ici' : 'Photos of your child\'s activities will appear here'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredPhotos.map((photo) => (
                            <Card
                                key={photo.id}
                                className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <div className="relative aspect-square">
                                    <img
                                        src={photo.thumbnail}
                                        alt={photo.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder.svg';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                                        <p className="text-white/80 text-xs">{photo.childName}</p>
                                    </div>
                                    {photo.liked && (
                                        <div className="absolute top-2 right-2">
                                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Photo Lightbox */}
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
                <DialogContent className="max-w-4xl p-0 bg-black/95 border-0">
                    {selectedPhoto && (
                        <div className="relative">
                            {/* Close Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
                                onClick={() => setSelectedPhoto(null)}
                            >
                                <X className="w-6 h-6" />
                            </Button>

                            {/* Navigation */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
                                onClick={() => navigatePhoto('prev')}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
                                onClick={() => navigatePhoto('next')}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </Button>

                            {/* Image */}
                            <img
                                src={selectedPhoto.url}
                                alt={selectedPhoto.title}
                                className="w-full max-h-[70vh] object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                }}
                            />

                            {/* Info Bar */}
                            <div className="bg-black/80 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{selectedPhoto.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <Badge variant="secondary">{selectedPhoto.childName}</Badge>
                                            <span className="text-white/70 text-sm flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(selectedPhoto.date)}
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-sm mt-2">{selectedPhoto.activity}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`text-white hover:bg-white/20 rounded-full ${selectedPhoto.liked ? 'text-red-500' : ''}`}
                                            onClick={() => toggleLike(selectedPhoto.id)}
                                        >
                                            <Heart className={`w-6 h-6 ${selectedPhoto.liked ? 'fill-red-500' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 rounded-full"
                                            onClick={() => window.open(selectedPhoto.url, '_blank')}
                                        >
                                            <Download className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ParentPhotos;
