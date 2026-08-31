export function formatDate(date?: string, includeRelative = false) {
  if (!date) {
    return "";
  }

  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  if (daysAgo < 0) {
    monthsAgo -= 1;
    // Get the number of days in the previous month relative to currentDate
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    daysAgo += previousMonth.getDate();
  }

  if (monthsAgo < 0) {
    yearsAgo -= 1;
    monthsAgo += 12;
  }

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
