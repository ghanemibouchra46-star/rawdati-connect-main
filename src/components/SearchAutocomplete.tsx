import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, GraduationCap } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { kindergartens as localKindergartens, Kindergarten } from '@/data/kindergartens';
import { useKindergartens } from '@/hooks/useKindergartens';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SearchAutocompleteProps {
    onSearch?: (query: string) => void;
    className?: string;
}

const SearchAutocomplete = ({ onSearch, className }: SearchAutocompleteProps) => {
    const { t, language, dir } = useLanguage();
    const navigate = useNavigate();
    const { data: supabaseKindergartens } = useKindergartens();
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const kindergartens = useMemo(() => {
        return (supabaseKindergartens && supabaseKindergartens.length > 0)
            ? supabaseKindergartens
            : localKindergartens;
    }, [supabaseKindergartens]);

    const filteredItems = useMemo(() => {
        if (!inputValue) return [];
        return kindergartens.filter((k) => {
            const name = language === 'ar' ? k.nameAr : k.nameFr;
            const municipality = language === 'ar' ? k.municipalityAr : k.municipalityFr;
            return (
                name.toLowerCase().includes(inputValue.toLowerCase()) ||
                municipality.toLowerCase().includes(inputValue.toLowerCase())
            );
        }).slice(0, 5);
    }, [kindergartens, inputValue, language]);

    const handleSelect = (id: string, name: string) => {
        setOpen(false);
        setInputValue(name);
        if (onSearch) {
            onSearch(name);
        } else {
            navigate(`/kindergartens?search=${encodeURIComponent(name)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue) {
            setOpen(false);
            handleSelect('manual', inputValue);
        }
    };

    return (
        <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="relative w-full">
                        <Search className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground",
                            dir === 'rtl' ? 'right-4' : 'left-4'
                        )} />
                        <input
                            type="text"
                            placeholder={t('kindergartens.searchPlaceholder')}
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setOpen(true);
                            }}
                            onKeyDown={handleKeyDown}
                            className={cn(
                                "w-full h-14 bg-card border-2 border-primary/20 rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-soft",
                                dir === 'rtl' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'
                            )}
                        />
                        <Button
                            onClick={() => handleSelect('manual', inputValue)}
                            className={cn(
                                "absolute top-1.5 h-11 px-6 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold",
                                dir === 'rtl' ? 'left-1.5' : 'right-1.5'
                            )}
                        >
                            {language === 'ar' ? 'بحث' : 'Rechercher'}
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0 w-[var(--radix-popover-trigger-width)] border-2 border-primary/10 rounded-2xl shadow-xl overflow-hidden"
                    align="start"
                    sideOffset={8}
                >
                    <Command className="w-full">
                        <CommandList>
                            {filteredItems.length === 0 ? (
                                <CommandEmpty className="py-6 text-center text-muted-foreground">
                                    {t('kindergartens.noResults')}
                                </CommandEmpty>
                            ) : (
                                <CommandGroup heading={language === 'ar' ? 'النتائج المقترحة' : 'Suggestions'}>
                                    {filteredItems.map((k) => {
                                        const name = language === 'ar' ? k.nameAr : k.nameFr;
                                        const muni = language === 'ar' ? k.municipalityAr : k.municipalityFr;
                                        return (
                                            <CommandItem
                                                key={k.id}
                                                value={name}
                                                onSelect={() => handleSelect(k.id, name)}
                                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 data-[selected=true]:bg-primary/10"
                                            >
                                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-primary/10">
                                                    <img src={k.images[0]} alt={name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="font-bold text-foreground truncate">{name}</span>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3 text-coral" />
                                                        <span className="truncate">{muni}</span>
                                                    </div>
                                                </div>
                                                <GraduationCap className="w-5 h-5 text-primary/40" />
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SearchAutocomplete;
