// Fetch Daily Quote
async function loadQuote() {
  const quoteText = document.getElementById("quoteText");

  // Fallback quotes to avoid CORS issues
  const fallbackQuotes = [
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Innovation distinguishes between a leader and a follower. — Steve Jobs",
    "Life is what happens when you're busy making other plans. — John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. — Aristotle"
  ];

  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    quoteText.textContent = data[0].q + " — " + data[0].a;
  } catch (err) {
    // Use fallback quote
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    quoteText.textContent = randomQuote;
  }
}


// Fetch Local Time
async function loadTime() {
  const timeText = document.getElementById("timeText");

  try {
    const response = await fetch("https://worldtimeapi.org/api/ip");
    const data = await response.json();

    const dateTime = new Date(data.datetime);
    timeText.textContent = dateTime.toLocaleString();
  } catch (err) {
    // Use local time as fallback
    const now = new Date();
    timeText.textContent = now.toLocaleString();
  }
}


// Run when dashboard loads
window.addEventListener("DOMContentLoaded", () => {
  loadQuote();
  loadTime();
});
