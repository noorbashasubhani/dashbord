export const formatDate = (isoString) => {
    const date = new Date(isoString);
  
    return date.toLocaleString("en-US", {
      weekday: "long",  // 'Monday'
      year: "numeric",  // '2025'
      month: "long",    // 'March'
      day: "numeric",   // '8'
      hour: "numeric",  // '5'
      minute: "numeric",// '28'
      second: "numeric",// '54'
      hour12: true      // 'AM/PM'
    });
  };
  