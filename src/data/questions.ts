import { QuizQuestion } from "../types";

export const quizArray: QuizQuestion[] = [
  {
    id: "0",
    question: "What does Krishna advise Arjuna to do in the face of challenges and dilemmas?",
    options: [
      "Renounce the world",
      "Fight with determination and without attachment",
      "Seek revenge",
      "Surrender to the enemy",
    ],
    correct: "Fight with determination and without attachment",
  },
  {
    id: "1",
    question: "Who is the author of the Bhagavad Gita?",
    options: ["Valmiki", "Veda Vyasa", "Kalidasa", "Tulsidas"],
    correct: "Veda Vyasa",
  },
  {
    id: "2",
    question: "In which battle was the Bhagavad Gita spoken?",
    options: ["Battle of Panipat", "Battle of Plassey", "Battle of Kurukshetra", "Battle of Haldighati"],
    correct: "Battle of Kurukshetra",
  },
  {
    id: "3",
    question: "What is the meaning of 'Yoga' in the context of the Gita?",
    options: ["Physical exercise", "Union with the Divine", "Mental relaxation", "Breath control"],
    correct: "Union with the Divine",
  },
  {
    id: "4",
    question: "Which of these is NOT one of the three Gunas (qualities of nature)?",
    options: ["Sattva", "Rajas", "Tamas", "Moksha"],
    correct: "Moksha",
  },
  {
    id: "5",
    question: "What is the literal meaning of 'Bhagavad Gita'?",
    options: ["Song of the Lord", "Story of the King", "Path of Wisdom", "The Great War"],
    correct: "Song of the Lord",
  },
  {
    id: "6",
    question: "How many chapters are there in the Bhagavad Gita?",
    options: ["12", "18", "24", "108"],
    correct: "18",
  },
  {
    id: "7",
    question: "To whom did Krishna first impart the knowledge of the Gita, according to Chapter 4?",
    options: ["Arjuna", "Vivasvan (The Sun-god)", "Manu", "Ikshvaku"],
    correct: "Vivasvan (The Sun-god)",
  },
  {
    id: "8",
    question: "What is 'Dharma' often translated as in the context of the Gita?",
    options: ["Religion", "Duty or Righteousness", "Meditation", "Sacrifice"],
    correct: "Duty or Righteousness",
  },
  {
    id: "9",
    question: "Which bird was on the flag of Arjuna's chariot?",
    options: ["Eagle", "Peacock", "Hanuman", "Swan"],
    correct: "Hanuman",
  },
  {
    id: "10",
    question: "What is the name of Krishna's conch shell?",
    options: ["Panchajanya", "Devadatta", "Paundra", "Anantavijaya"],
    correct: "Panchajanya",
  }
];

export const getRandomQuestions = (count: number) => {
  const shuffled = [...quizArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
