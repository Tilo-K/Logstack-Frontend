import { adjectives, nouns } from "./words";

export function namePlaceholder() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNound = nouns[Math.floor(Math.random() * nouns.length)]; 

    return `${randomAdjective} ${randomNound}`;
}

export function getImagePlaceholder(name: string) {
    const clean = name.replace(" ", "").trim().toLowerCase();
    
    return `https://picsum.photos/seed/${clean}/300/300`;
}