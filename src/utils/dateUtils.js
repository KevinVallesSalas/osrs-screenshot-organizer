// dateUtils.js

export function formatDate24hr(date) {
    return date.toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  }
  
  export function formatDate12hr(date) {
    return date.toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true,
    });
  }
  