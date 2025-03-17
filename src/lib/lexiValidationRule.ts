import { toast } from "sonner";

interface Rule {
	rule: string;
	getRule?: (param: string | number) => string;
	validator: (word: string, extraParam?: string | number) => boolean;
}

export const rules: Rule[] = [
	{
		rule: "Enter words that are at least 4 characters long",
		validator: (word: string) => {
			if (word.length < 4) {
				toast.error("Word must be at least 4 characters!", {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must contain a random letter",
		getRule: (param) => `Word must contain the letter '${param}'`,
		validator: (word: string, extraParam?: string | number) => {
			const randomLetter = String(extraParam);
			if (!randomLetter || !word.includes(randomLetter)) {
				toast.error(`Word must contain '${randomLetter}'!`, {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must not contain a random letter",
		getRule: (param) => `Word must NOT contain the letter '${param}'`,
		validator: (word: string, extraParam?: string | number) => {
			const randomLetter = String(extraParam);
			if (!randomLetter || word.includes(randomLetter)) {
				toast.error(`Word must NOT contain '${randomLetter}'!`, {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must start with a random letter",
		getRule: (param) => `Word must start with the letter '${param}'`,
		validator: (word: string, extraParam?: string | number) => {
			const randomLetter = String(extraParam);
			if (!randomLetter || !word.startsWith(randomLetter)) {
				toast.error(`Word must start with '${randomLetter}'!`, {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must end with a random letter",
		getRule: (param) => `Word must end with the letter '${param}'`,
		validator: (word: string, extraParam?: string | number) => {
			const randomLetter = String(extraParam);
			if (!randomLetter || !word.endsWith(randomLetter)) {
				toast.error(`Word must end with '${randomLetter}'!`, {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must end with 'tion'",
		validator: (word: string) => {
			if (!word.endsWith("tion")) {
				toast.error("Word must end with 'tion'!", {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must start with 'co'",
		validator: (word: string) => {
			if (!word.startsWith("co")) {
				toast.error("Word must start with 'co'!", {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must contain at least two pairs of double letters (e.g., 'butter', 'letter')",
		validator: (word: string) => {
			const forbiddenWords = new Set(["butter", "letter"]);
			if (forbiddenWords.has(word.toLowerCase())) {
				toast.error(
					"You can't use words in example that, is 'butter' or 'letter'!",
					{
						position: "top-center",
					}
				);
				return false;
			}

			const doubleLetterMatch = word.match(/([a-z])\1/gi);
			if (!doubleLetterMatch || doubleLetterMatch.length < 2) {
				toast.error(
					"Word must have at least two pairs of double letters (e.g., 'butter', 'coffee')!",
					{
						position: "top-center",
					}
				);
				return false;
			}

			return true;
		},
	},

	{
		rule: "Word must have a specific length",
		getRule: (param) => `Word must have exactly ${param} letters`,
		validator: (word: string, extraParam?: string | number) => {
			const randomLength = Number(extraParam);
			if (isNaN(randomLength) || word.length !== randomLength) {
				toast.error(
					`Word must be exactly ${randomLength} letters long!`,
					{
						position: "top-center",
					}
				);
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must start and end with a consonant",
		validator: (word: string) => {
			if (
				!/^[bcdfghjklmnpqrstvwxyz].*[bcdfghjklmnpqrstvwxyz]$/i.test(
					word
				)
			) {
				toast.error("Word must start and end with a consonant!", {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must start and end with a vowel",
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
		rule: "Word must contain at least one letter that appears exactly three times (e.g., 'banana', 'success'). You can't use words in the example.",
		validator: (word: string) => {
			const forbiddenWords = new Set(["banana", "success"]);
			if (forbiddenWords.has(word.toLowerCase())) {
				toast.error(
					"You can't use words in the example (e.g., 'banana', 'success')!",
					{
						position: "top-center",
					}
				);
				return false;
			}

			const letterCounts: Record<string, number> = {};
			for (const letter of word) {
				letterCounts[letter] = (letterCounts[letter] || 0) + 1;
			}
			const hasTripleLetter = Object.values(letterCounts).some(
				(count) => count === 3
			);
			if (!hasTripleLetter) {
				toast.error(
					"Word must contain at least one letter appearing exactly three times!",
					{
						position: "top-center",
					}
				);
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must be a palindrome",
		validator: (word: string) => {
			const reversed = word.split("").reverse().join("");
			if (word !== reversed) {
				toast.error("Word must be a palindrome!", {
					position: "top-center",
				});
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must have no repeating letters",
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
		rule: "Word must contain exactly 3 vowels and 3 consonants",
		validator: (word: string) => {
			const vowels = (word.match(/[aeiou]/gi) || []).length;
			const consonants = (word.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [])
				.length;
			if (vowels !== 3 || consonants !== 3) {
				toast.error(
					"Word must contain exactly 3 vowels and 3 consonants!",
					{
						position: "top-center",
					}
				);
				return false;
			}
			return true;
		},
	},

	{
		rule: "Word must contain the same letter three times",
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
		rule: "Word must have an equal number of vowels and consonants",
		validator: (word: string) => {
			const vowels = (word.match(/[aeiou]/gi) || []).length;
			const consonants = (word.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [])
				.length;
			if (vowels !== consonants) {
				toast.error(
					"Word must have an equal number of vowels and consonants!",
					{
						position: "top-center",
					}
				);
				return false;
			}
			return true;
		},
	},
];
