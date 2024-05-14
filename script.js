let cachedResults = null;

// Fetch of results
async function fetchResults(searchedQuery) {
  const API_KEY = ""; //removed do to security
  const SEARCH_ENGINE_ID = ""; //removed do to security
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${searchedQuery}&start=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    cachedResults = data.items;
    return cachedResults;
  } catch (error) {
    console.error("Error fetching results:", error);
    return []; // Return an empty array if an error occurs
  }
}

// Handling of the search form
const searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchedQuery = document.getElementById("searchedQuery").value;
  const results = await fetchResults(searchedQuery);
  displayResults(results);
});

// Sellect all text on one click
const searchInput = document.getElementById("searchedQuery");

searchInput.addEventListener("click", function () {
  this.select(); // Use 'this' within the event listener to target the input
});

// Display of results
function displayResults(results) {
  const resultsElement = document.getElementById("results");
  resultsElement.innerHTML = ""; // Clear previous results

  if (results.length === 0) {
    resultsElement.textContent = "No results found.";
    return;
  }

  const list = document.createElement("ul");
  results.forEach((result) => {
    if (result.link && result.htmlTitle) {
      const listItem = document.createElement("li");
      const linkElement = document.createElement("a");
      linkElement.href = result.link;
      linkElement.textContent = result.title;
      linkElement.target = "_blank";
      listItem.appendChild(linkElement);
      list.appendChild(listItem);
    }
  });

  resultsElement.appendChild(list);

  // Function to handle the download action
  function downloadResultsAsJSON(results) {
    const json = JSON.stringify(results, null, 2); // Convert results to JSON string
    const blob = new Blob([json], { type: "application/json" }); // Create a Blob object
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement("a"); // Create a link element
    a.href = url; // Set the link's href attribute to the Blob URL
    a.download = "search_results.json"; // Set the filename for the downloaded file
    document.body.appendChild(a); // Append the link to the document body
    a.click(); // Simulate a click event on the link
    document.body.removeChild(a); // Remove the link from the document body
    URL.revokeObjectURL(url); // Release the resources associated with the Blob URL
  }

  // Create download button
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download JSON";
  downloadButton.addEventListener("click", async () => {
    downloadResultsAsJSON(cachedResults);
  });
  resultsElement.appendChild(downloadButton);
}
