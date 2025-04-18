const months: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * The function formats a date to a readable string format.
 * The format is as follows:
 * For a post posted on Day X, 
 * the post date should appear in seconds (if posted 0 mins. ago), 
 * minutes (if posted 0 hours ago), 
 * or hours (if posted less than 24 hours ago). 
 * The displayed string should read "<Month><day> at <hh:min>"
 * after 24 hours of posting. 
 * Date should be displayed as "<Month><day>, <year> at <hh:min>"
 * if viewed after a year of posting.
 * @param date the posted date
 * @returns a string representation of the date
 */
const getMetaData = (date: Date): string => {
  const now = new Date();
  const diffs = Math.floor(Math.abs(now.getTime() - date.getTime()) / 1000);

  if (diffs < 60) {
    return `${diffs} seconds ago`;
  } else if (diffs < 60 * 60) {
    return `${Math.floor(diffs / 60)} minutes ago`;
  } else if (diffs < 60 * 60 * 24) {
    const h = Math.floor(diffs / 3600);
    return `${h} hours ago`;
  } else if (diffs < 60 * 60 * 24 * 365) {
    return `${months[date.getMonth()]} ${getDateHelper(date)} at ${date
      .toTimeString()
      .slice(0, 8)}`;
  } else {
    return `${months[date.getMonth()]} ${getDateHelper(
      date
    )}, ${date.getFullYear()} at ${date.toTimeString().slice(0, 8)}`;
  }
};

const getDateHelper = (date: Date): string => {
  const day = date.getDate();
  if (day < 10) {
    return `0${day}`;
  }
  return `${day}`;
};

export { getMetaData };
