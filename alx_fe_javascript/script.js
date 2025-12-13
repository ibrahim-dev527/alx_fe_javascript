// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function () {

  // Select DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  // Array of quote objects
  const quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Success is not final; failure is not fatal.", category: "Life" }
  ];

  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
  }

  // Function to add a new quote
  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();

    if (quoteText === "" || quoteCategory === "") {
      alert("Please enter both quote text and category.");
      return;
    }

    // Add new quote object to the array
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });

    // Clear inputs
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    alert("Quote added successfully!");
  }

  // Event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);

});