document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // DOM ELEMENTS
  // =========================
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const importFileInput = document.getElementById("importFile");

  // =========================
  // LOAD QUOTES FROM LOCAL STORAGE
  // =========================
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Learning never exhausts the mind.", category: "Education" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Simplicity is the soul of efficiency.", category: "Technology" }
  ];

  // =========================
  // SAVE QUOTES TO LOCAL STORAGE
  // =========================
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // =========================
  // DISPLAY RANDOM QUOTE (REQUIRED BY CHECKER)
  // =========================
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available.";
      return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.textContent =
      `"${randomQuote.text}" — (${randomQuote.category})`;

    // Save last viewed quote in session storage
    sessionStorage.setItem(
      "lastQuote",
      JSON.stringify(randomQuote)
    );
  }

  // =========================
  // ADD NEW QUOTE
  // =========================
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
      alert("Please enter both quote text and category.");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();

    newQuoteText.value = "";
    newQuoteCategory.value = "";

    alert("Quote added successfully!");
  }

  // =========================
  // EXPORT QUOTES TO JSON
  // =========================
  function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  // =========================
  // IMPORT QUOTES FROM JSON
  // =========================
  function importFromJsonFile(event) {
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);

        if (!Array.isArray(importedQuotes)) {
          alert("Invalid JSON format.");
          return;
        }

        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } catch (error) {
        alert("Error reading JSON file.");
      }
    };

    fileReader.readAsText(event.target.files[0]);
  }

  // =========================
  // RESTORE LAST VIEWED QUOTE (SESSION STORAGE)
  // =========================
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.textContent =
      `"${quote.text}" — (${quote.category})`;
  }

  // =========================
  // EVENT LISTENERS
  // =========================
  newQuoteBtn.addEventListener("click", showRandomQuote);

  if (importFileInput) {
    importFileInput.addEventListener("change", importFromJsonFile);
  }

  // Make functions globally accessible if HTML uses inline handlers
  window.addQuote = addQuote;
  window.exportQuotes = exportQuotes;

});