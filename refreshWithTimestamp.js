
// Get the current URL and its query parameters
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

// Get the timestamp from the URL query parameter
const timestamp = parseInt(params.get('timestamp'), 10);

// Get the current time in milliseconds
const currentTime = Date.now();
const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

// Determine the timestamp to use (existing if valid, otherwise current time)
const effectiveTimestamp = (!timestamp || isNaN(timestamp) || (currentTime - timestamp) > oneHourInMs)
  ? currentTime.toString()
  : timestamp.toString();

// Check if timestamp is missing or older than 1 hour
if (!timestamp || isNaN(timestamp) || (currentTime - timestamp) > oneHourInMs) {
  // Update or add the new timestamp to the query parameters
  params.set('timestamp', effectiveTimestamp);
  
  // Construct the new URL with updated query parameters
  const newUrl = `${url.pathname}?${params.toString()}`;
  
  // Refresh the page with the new URL
  window.location.replace(newUrl);
} else {
  document.addEventListener('DOMContentLoaded', function() {
  // Update all static hyperlinks to include the timestamp
  document.querySelectorAll('a[href]').forEach(link => {
    try {
      const linkUrl = new URL(link.href, window.location.origin);
      
      // Skip in-page anchors, non-HTTP/HTTPS links, and links to the current page
      if (
        linkUrl.hash && !linkUrl.pathname && !linkUrl.search && !linkUrl.hostname
        || !['http:', 'https:'].includes(linkUrl.protocol)
        || (linkUrl.pathname === url.pathname && linkUrl.search === url.search && linkUrl.hash)
      ) {
        return;
      }
      
      // Create or update the query parameters for the link
      const linkParams = new URLSearchParams(linkUrl.search);
      linkParams.set('timestamp', effectiveTimestamp);
      
      // Update the href with the new query parameters
      linkUrl.search = linkParams.toString();
      link.href = linkUrl.toString();
      
      console.log(`Updated link: ${link.href}`);
    } catch (e) {
      console.error(`Error updating link ${link.href}:`, e);
    }
  });
});
}