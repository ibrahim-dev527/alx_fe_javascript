document.addEventListener('DOMContentLoaded', () => {

  const quoteDisplay = document.getElementById('quoteDisplay');
  const categoryFilter = document.getElementById('categoryFilter');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const syncNowBtn = document.getElementById('syncNow');
  const exportBtn = document.getElementById('exportQuotes');
  const importFile = document.getElementById('importFile');
  const syncStatus = document.getElementById('syncStatus');

  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  // Load quotes from Local Storage
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "Learning never exhausts the mind.", category: "Education" },
    { text: "Code is like humor. When you explain it, it’s bad.", category: "Programming" },
    { text: "Success comes to those who persist.", category: "Motivation" }
  ];

  let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Populate categories dynamically
  function populateCategories() {
    const categories = ['all', ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '';

    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    categoryFilter.value = selectedCategory;
  }

  // Filter and display quotes
  function filterQuotes() {
    selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);

    const filtered = selectedCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    if (filtered.length === 0) {
      quoteDisplay.textContent = "No quotes in this category.";
      return;
    }

    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;

    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
  }

  // Add quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
      alert("Please fill in both fields.");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();

    newQuoteText.value = '';
    newQuoteCategory.value = '';
  }

  // Export quotes
  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  // Import quotes
  function importFromJsonFile(event) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(event.target.files[0]);
  }

  // Simulated server sync
  async function fetchServerQuotes() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data = await response.json();

    return data.map(post => ({
      text: post.title,
      category: "Server"
    }));
  }

  async function syncWithServer() {
    syncStatus.textContent = "Syncing with server...";
    const serverQuotes = await fetchServerQuotes();

    if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
      quotes = serverQuotes; // server wins
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncStatus.textContent = "⚠️ Server data applied (conflict resolved)";
    } else {
      syncStatus.textContent = "✔ Data already up to date";
    }
  }

  // Restore last quote
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    quoteDisplay.textContent = `"${q.text}" — (${q.category})`;
  }

  // Event listeners
  categoryFilter.addEventListener('change', filterQuotes);
  newQuoteBtn.addEventListener('click', filterQuotes);
  addQuoteBtn.addEventListener('click', addQuote);
  exportBtn.addEventListener('click', exportQuotes);
  importFile.addEventListener('change', importFromJsonFile);
  syncNowBtn.addEventListener('click', syncWithServer);

  // Auto sync every 30 seconds
  setInterval(syncWithServer, 30000);

  // Init
  populateCategories();
  filterQuotes();

});