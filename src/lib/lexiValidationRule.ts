// lib/lexiValidationRule.ts
import { toast } from "sonner";

interface Rule {
  rule: string;
  validator: (word: string) => boolean;
}

export const rules = (minWordLength: number, randomLetter: string): Rule[] => [
  {
    rule: `Word must be at least ${minWordLength} characters!`,
    validator: (word: string) => {
      if (word.length < minWordLength) {
        toast.error(`Word must be at least ${minWordLength} characters!`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must contain the letter '${randomLetter}' and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (!word.includes(randomLetter)) {
        toast.error(`Word must contain '${randomLetter}'`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must NOT contain the letter '${randomLetter}' and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (word.includes(randomLetter)) {
        toast.error(`Word must NOT contain '${randomLetter}'`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must start with the letter '${randomLetter}' and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (!word.startsWith(randomLetter)) {
        toast.error(`Word must start with '${randomLetter}'`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must end with the letter '${randomLetter}' and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (!word.endsWith(randomLetter)) {
        toast.error(`Word must end with '${randomLetter}'`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must end with 'tion' and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (!word.endsWith("tion")) {
        toast.error(`Word must end with 'tion'`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must start with 'co' and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (!word.startsWith("co")) {
        toast.error(`Word must start with 'co'`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  //check out rule
  {
    rule: `Word must contain at least two pairs of double letters and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      const doubleLetterMatch = word.match(/([a-z])\1/gi);
      if (!doubleLetterMatch || doubleLetterMatch.length < 2) {
        toast.error("Word must have at least two pairs of double letters!", {
          position: "top-center",
        });
        return false;
      }

      return true;
    },
  },

  {
    rule: `Word must have exactly ${minWordLength + 2} letters`,
    validator: (word: string) => {
      if (word.length !== minWordLength + 2) {
        toast.error(`Word must be exactly ${minWordLength + 2} letters long!`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must start and end with a consonant and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (!/^[bcdfghjklmnpqrstvwxyz].*[bcdfghjklmnpqrstvwxyz]$/i.test(word)) {
        toast.error("Word must start and end with a consonant!", {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must start and end with a vowel and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      if (!/^[aeiou].*[aeiou]$/i.test(word)) {
        toast.error("Word must start and end with a vowel!", {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must contain at least one letter that appears exactly three times and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      const letterCounts: Record<string, number> = {};
      for (const letter of word) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      }
      const hasTripleLetter = Object.values(letterCounts).some(
        (count) => count === 3,
      );
      if (!hasTripleLetter) {
        toast.error(
          "Word must contain at least one letter appearing exactly three times!",
          {
            position: "top-center",
          },
        );
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must be a palindrome and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      const reversed = word.split("").reverse().join("");
      if (word !== reversed) {
        toast.error(`Word must be a palindrome`, {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must have no repeating letters and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      const uniqueLetters = new Set(word);
      if (uniqueLetters.size !== word.length) {
        toast.error("Word must have no repeating letters!", {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must contain exactly 3 vowels and 3 consonants and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      const vowels = (word.match(/[aeiou]/gi) || []).length;
      const consonants = (word.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
      if (vowels !== 3 || consonants !== 3) {
        toast.error("Word must contain exactly 3 vowels and 3 consonants!", {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must contain the same letter three times and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      const letterCounts: Record<string, number> = {};
      for (const letter of word) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      }
      if (!Object.values(letterCounts).includes(3)) {
        toast.error("Word must contain the same letter three times!", {
          position: "top-center",
        });
        return false;
      }
      return true;
    },
  },

  {
    rule: `Word must have an equal number of vowels and consonants and be at least ${minWordLength} characters long`,
    validator: (word: string) => {
      const vowels = (word.match(/[aeiou]/gi) || []).length;
      const consonants = (word.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
      if (vowels !== consonants) {
        toast.error(
          "Word must have an equal number of vowels and consonants!",
          {
            position: "top-center",
          },
        );
        return false;
      }
      return true;
    },
  },
];
