// Collection of motivational fitness quotes
export const motivationalQuotes = [
  {
    quote: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    quote: "Strength does not come from the body. It comes from the will.",
    author: "Gandhi"
  },
  {
    quote: "The difference between try and triumph is a little umph.",
    author: "Marvin Phillips"
  },
  {
    quote: "The body achieves what the mind believes.",
    author: "Napoleon Hill"
  },
  {
    quote: "Rome wasn't built in a day, but they were laying bricks every hour.",
    author: "John Heywood"
  },
  {
    quote: "The hard days are the best because that's when champions are made.",
    author: "Gabrielle Reece"
  },
  {
    quote: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn"
  },
  {
    quote: "The clock is ticking. Are you becoming the person you want to be?",
    author: "Greg Plitt"
  },
  {
    quote: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Arnold Schwarzenegger"
  },
  {
    quote: "If you want something you've never had, you must be willing to do something you've never done.",
    author: "Thomas Jefferson"
  },
  {
    quote: "Success is usually the culmination of controlling failure.",
    author: "Sylvester Stallone"
  },
  {
    quote: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon"
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    quote: "The successful warrior is the average person, with laser-like focus.",
    author: "Bruce Lee"
  },
  {
    quote: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  }
];
// Function to get a random motivational quote
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

