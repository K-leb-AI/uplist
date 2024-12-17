export function formatDateToCustom(dateString) {
  // Create an array of month names
  const date = new Date(dateString);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract the month, day, and year from the date
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Return the formatted string
  return `${month} ${day}, ${year}`;
}
