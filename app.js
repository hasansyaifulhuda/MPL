import { createTeams, calculate } from "./logic.js";
import { renderSchedule, renderTable } from "./ui.js";
import { loadResults } from "./match.js";

/* =========================
   SYNC HEIGHT (PRO FIX)
========================= */
function syncHeight() {
  const table = document.querySelector(".table-container");
  const schedule = document.querySelector(".schedule-container");

  if (!table || !schedule) return;

  // reset dulu biar ambil tinggi asli
  schedule.style.height = "auto";

  const tableHeight = table.offsetHeight;

  schedule.style.height = tableHeight + "px";
}

/* =========================
   INIT
========================= */
async function init(){

  await loadResults(); // WAJIB

  function update(){
    const teams = createTeams();
    const sorted = calculate(teams);
    renderTable(sorted);

    // 🔥 penting: sync setelah render
    requestAnimationFrame(syncHeight);
  }

  renderSchedule(update);
  update();

  // sync awal (double safety)
  setTimeout(syncHeight, 200);
}

init();

/* =========================
   LISTENER
========================= */

// resize layar
window.addEventListener("resize", () => {
  requestAnimationFrame(syncHeight);
});

// load awal
window.addEventListener("load", () => {
  requestAnimationFrame(syncHeight);
});

/* =========================
   CTRL + S EXPORT
========================= */
window.addEventListener("keydown", (e)=>{
  if(e.ctrlKey && e.key.toLowerCase() === "s"){
    e.preventDefault();

    const data = localStorage.getItem("mpl_results") || "{}";

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mpl-results.json";
    a.click();

    URL.revokeObjectURL(url);
  }
});