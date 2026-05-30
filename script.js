const calendarGrid = document.querySelector("#calendarGrid");
const yearSelect = document.querySelector("#yearSelect");
const calendarTitle = document.querySelector("#calendarTitle");
const calendarSubtitle = document.querySelector("#calendarSubtitle");
const jumpToday = document.querySelector("#jumpToday");
const printCalendar = document.querySelector("#printCalendar");

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
const currentYear = today.getFullYear();

function getYearRange() {
  const start = currentYear - 2;
  const end = currentYear + 7;
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function createYearOptions() {
  const years = getYearRange();

  yearSelect.innerHTML = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");

  yearSelect.value = String(currentYear);
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function isToday(year, monthIndex, dateNumber) {
  return (
    year === today.getFullYear() &&
    monthIndex === today.getMonth() &&
    dateNumber === today.getDate()
  );
}

function buildMonth(year, monthIndex) {
  const month = document.createElement("article");
  month.className = "month-card";

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = getDaysInMonth(year, monthIndex);

  const weekdayMarkup = weekdayNames
    .map((day) => `<span>${day}</span>`)
    .join("");

  let dayMarkup = "";

  for (let blank = 0; blank < firstDay; blank += 1) {
    dayMarkup += `<span class="day empty" aria-hidden="true"></span>`;
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const todayClass = isToday(year, monthIndex, day) ? " today" : "";
    const label = `${monthNames[monthIndex]} ${day}, ${year}`;
    dayMarkup += `<span class="day${todayClass}" aria-label="${label}">${day}</span>`;
  }

  month.innerHTML = `
    <div class="month-header">
      <h3>${monthNames[monthIndex]}</h3>
      <span>${year}</span>
    </div>
    <div class="weekdays" aria-hidden="true">${weekdayMarkup}</div>
    <div class="days">${dayMarkup}</div>
  `;

  return month;
}

function renderCalendar(year) {
  calendarGrid.innerHTML = "";

  for (let month = 0; month < 12; month += 1) {
    calendarGrid.appendChild(buildMonth(year, month));
  }

  calendarTitle.textContent = `${year} Calendar`;
  calendarSubtitle.textContent =
    year === currentYear
      ? "Orange's current-year calendar is ready. Today is marked with a small paw."
      : `Orange's full ${year} calendar is ready.`;
}

function scrollToToday() {
  const selectedYear = Number(yearSelect.value);

  if (selectedYear !== currentYear) {
    yearSelect.value = String(currentYear);
    renderCalendar(currentYear);
  }

  const todayCell = document.querySelector(".day.today");

  if (todayCell) {
    todayCell.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

createYearOptions();
renderCalendar(currentYear);

yearSelect.addEventListener("change", (event) => {
  renderCalendar(Number(event.target.value));
});

jumpToday.addEventListener("click", scrollToToday);

printCalendar.addEventListener("click", () => {
  window.print();
});
