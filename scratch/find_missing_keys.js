
import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/admin/Desktop/rawdati-connect-main/src/contexts/LanguageContext.tsx';
const content = fs.readFileSync(filePath, 'utf-8');

// Simple regex to extract translations object
const translationsMatch = content.match(/const translations: Record<Language, Record<string, string>> = ({[\s\S]*?});/);
if (!translationsMatch) {
    console.error("Could not find translations object");
    process.exit(1);
}

// This is a bit risky but we can try to evaluate it as JS if it's clean enough, 
// or just parse it manually.
// Let's try to extract keys for each language.

const languages = ['ar', 'fr', 'en'];
const keys = { ar: [], fr: [], en: [] };

languages.forEach(lang => {
    const langSectionRegex = new RegExp(`${lang}: \\{([\\s\\S]*?)\\},`, 'g');
    const match = langSectionRegex.exec(translationsMatch[1]);
    if (match) {
        const lines = match[1].split('\n');
        lines.forEach(line => {
            const keyMatch = line.match(/'(.*?)':/);
            if (keyMatch) {
                keys[lang].push(keyMatch[1]);
            }
        });
    }
});

console.log(`AR keys: ${keys.ar.length}`);
console.log(`FR keys: ${keys.fr.length}`);
console.log(`EN keys: ${keys.en.length}`);

const allKeys = Array.from(new Set([...keys.ar, ...keys.fr]));
const missingInEn = allKeys.filter(k => !keys.en.includes(k));

console.log("Missing in EN:");
console.log(JSON.stringify(missingInEn, null, 2));
