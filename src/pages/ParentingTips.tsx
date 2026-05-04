import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, ArrowLeft, Search, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { parentingArticles, type Article } from '@/data/parentingTips';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ParentingTips = () => {
  const { t, language, dir } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const langSuffix = language === 'ar' ? '_ar' : language === 'fr' ? 'Fr' : 'En';

  const filteredArticles = parentingArticles.filter(article => {
    const title = article[`title${langSuffix}`] || '';
    const description = article[`description${langSuffix}`] || '';
    const category = article[`category${langSuffix}`] || '';
    return title.includes(searchQuery) || 
           description.includes(searchQuery) ||
           category.includes(searchQuery);
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-pink-500/10 text-pink-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            {t('tips.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('tips.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={t('tips.searchPlaceholder')}
              className={`${dir === 'rtl' ? 'pr-10' : 'pl-10'} py-6 bg-card border-muted shadow-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Card 
              key={article.id} 
              className="group border-0 shadow-soft hover:shadow-hover transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="h-4 bg-gradient-to-r from-pink-500 via-pink-400 to-emerald-500" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-muted/50 text-pink-500 group-hover:scale-110 transition-transform`}>
                    <article.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-100 border-0">
                    {article[`category${langSuffix}`]}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold mb-2 group-hover:text-pink-600 transition-colors">
                  {article[`title${langSuffix}`]}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-base">
                  {article[`description${langSuffix}`]}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex items-center text-pink-600 font-semibold gap-2">
                <span>{t('tips.readMore')}</span>
                <ArrowIcon className="w-4 h-4" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Fallback */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {t('tips.noResults')}
            </p>
          </div>
        )}

        {/* Back to Home CTA */}
        <div className="mt-16 text-center border-t border-muted pt-12">
          <Button 
            variant="ghost" 
            size="lg" 
            className="gap-2 text-muted-foreground hover:text-pink-500 active:scale-95 transition-all"
            onClick={() => navigate('/')}
          >
            <ArrowIcon className="w-5 h-5 rotate-180" />
            {t('tips.backToHome')}
          </Button>
        </div>
      </main>

      {/* Article Detail Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-pink-100 text-pink-600">
                    <selectedArticle.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-pink-600 border-pink-200 mb-1">
                      {selectedArticle[`category${langSuffix}`]}
                    </Badge>
                    <DialogTitle className={`text-2xl font-black ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {selectedArticle[`title${langSuffix}`]}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>
              <div className={`prose prose-pink max-w-none ${dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={dir}>
                <div className="whitespace-pre-line text-lg leading-relaxed text-foreground/80">
                  {selectedArticle[`content${langSuffix}`]}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-muted flex justify-center">
                <Button 
                  onClick={() => setSelectedArticle(null)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8"
                >
                  {t('tips.close')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ParentingTips;
