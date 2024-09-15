export default function handleDate(date) {
    const selectedDate = new Date(date);
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    return formattedDate
  }