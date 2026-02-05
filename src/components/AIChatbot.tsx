import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Baby, Stethoscope, Shirt, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { kindergartens } from '@/data/kindergartens';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIChatbot = () => {
    const { t, language, dir } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    text: t('chatbot.welcome'),
                    sender: 'ai',
                    timestamp: new Date(),
                },
            ]);
        }
    }, [t, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const getAIResponse = (userText: string): string => {
        const text = userText.toLowerCase();

        if (text.includes('روضة') || text.includes('jardin') || text.includes('kindergarten')) {
            const topKgs = kindergartens.slice(0, 3).map(k => language === 'ar' ? k.nameAr : k.nameFr).join('، ');
            return language === 'ar'
                ? `لدينا العديد من الروضات المميزة في معسكر، منها: ${topKgs}. يمكنك استكشاف القائمة الكاملة في قسم الروضات.`
                : `Nous avons plusieurs jardins d'enfants excellents à Mascara, tels que : ${topKgs}. Vous pouvez explorer la liste complète dans la section Jardins d'enfants.`;
        }

        if (text.includes('طبيب') || text.includes('médecin') || text.includes('doctor')) {
            return language === 'ar'
                ? 'يمكنني مساعدتك في العثور على أطباء الأطفال المتخصصين في ولاية معسكر من خلال قسم الأطباء.'
                : 'Je peux vous aider à trouver des pédiatres spécialisés dans la wilaya de Mascara via la section Médecins.';
        }

        if (text.includes('ملابس') || text.includes('vêtements') || text.includes('clothing')) {
            return language === 'ar'
                ? 'لدينا قائمة بأفضل محلات ملابس الأطفال في معسكر. يمكنك العثور عليها في قسم المحلات.'
                : 'Nous avons une liste des meilleures boutiques de vêtements pour enfants à Mascara. Vous pouvez les trouver dans la section Boutiques.';
        }

        if (text.includes('أرطفونيا') || text.includes('orthophoniste')) {
            return language === 'ar'
                ? 'يتوفر لدينا قائمة بأخصائيي الأرطفونيا المعتمدين في ولاية معسكر.'
                : 'Nous avons une liste d\'orthophonistes certifiés dans la wilaya de Mascara.';
        }

        return language === 'ar'
            ? 'أنا هنا لمساعدتك في العثور على أفضل الخدمات لأطفالك في معسكر. هل تود الاستفسار عن الروضات، الأطباء، أو المحلات؟'
            : 'Je suis là pour vous aider à trouver les meilleurs services pour vos enfants à Mascara. Voulez-vous vous renseigner sur les jardins d\'enfants, les médecins ou les boutiques ?';
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: getAIResponse(userMsg.text),
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className={cn("fixed bottom-6 z-[100] transition-all duration-300", dir === 'rtl' ? 'left-6' : 'right-6')}>
            {/* Chat Window */}
            {isOpen && (
                <Card className="mb-4 w-[350px] sm:w-[400px] h-[500px] shadow-2xl overflow-hidden flex flex-col border-2 border-primary/20 animate-scale-in">
                    <CardHeader className="p-4 gradient-accent flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-primary-foreground flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <span className="text-lg font-extrabold">{t('chatbot.title')}</span>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-primary-foreground hover:bg-white/20 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col bg-muted/30">
                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex max-w-[80%] flex-col gap-1",
                                        msg.sender === 'user'
                                            ? (dir === 'rtl' ? 'mr-auto items-start' : 'ml-auto items-end')
                                            : (dir === 'rtl' ? 'ml-auto items-end' : 'mr-auto items-start')
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm font-medium shadow-sm",
                                        msg.sender === 'user'
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-card text-foreground rounded-bl-none border border-border"
                                    )}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isTyping && (
                                <div className={cn("flex max-w-[80%] flex-col gap-1", dir === 'rtl' ? 'ml-auto items-end' : 'mr-auto items-start')}>
                                    <div className="bg-card text-foreground p-3 rounded-2xl rounded-bl-none border border-border flex items-center gap-1 shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-card border-t border-border">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t('chatbot.placeholder')}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="rounded-xl border-2 border-primary/10 focus:border-primary transition-all"
                                />
                                <Button
                                    onClick={handleSend}
                                    size="icon"
                                    className="rounded-xl gradient-accent border-0 shrink-0 shadow-soft hover:scale-105 transition-transform"
                                >
                                    <Send className={cn("w-5 h-5 text-primary-foreground", dir === 'rtl' && "rotate-180")} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Floating Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-full shadow-2xl gradient-accent border-0 flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce-slow",
                    isOpen && "opacity-0 pointer-events-none"
                )}
            >
                <Bot className="w-8 h-8 text-primary-foreground" />
            </Button>
        </div>
    );
};

export default AIChatbot;
