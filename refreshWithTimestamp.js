console.log("Checking cache");

// Get the current URL and its query parameters
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

// Get the timestamp from the URL query parameter
const timestamp = parseInt(params.get('timestamp'), 10);

// Get the current time in milliseconds
const currentTime = Date.now();
const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

// Check if timestamp is missing or older than 1 hour
if (!timestamp || isNaN(timestamp) || (currentTime - timestamp) > oneHourInMs) {
  // Update or add the new timestamp to the query parameters
  params.set('timestamp', currentTime.toString());
  
  // Construct the new URL with updated query parameters
  const newUrl = `${url.pathname}?${params.toString()}`;
  
  // Refresh the page with the new URL
  window.location.replace(newUrl);
}