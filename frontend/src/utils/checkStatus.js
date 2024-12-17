export function isDueToday(dateString) {
  // Parse the input date string into a Date object
  const inputDate = new Date(dateString);

  // Check if the parsed date is valid
  if (isNaN(inputDate)) {
    throw new Error('Invalid date string provided');
  }

  // Get today's date
  const today = new Date();

  // Return true if all components match
  if (
    inputDate.getFullYear() > today.getFullYear() ||
    inputDate.getMonth() > today.getMonth() ||
    inputDate.getDate() > today.getDate()
  )
    return 0;
  else if (
    inputDate.getFullYear() < today.getFullYear() ||
    inputDate.getMonth() < today.getMonth() ||
    inputDate.getDate() < today.getDate()
  )
    return 1;
  else return 2;
}
