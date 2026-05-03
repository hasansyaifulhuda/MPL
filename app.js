import { createTeams, calculate } from "./logic.js";
import { renderSchedule, renderTable } from "./ui.js";
import { loadResults } from "./match.js";

/* LOAD DATA (WAJIB PERTAMA) */
loadResults();

function update(){
  const teams = createTeams();
  const sorted = calculate(teams);
  renderTable(sorted);
}

/* INIT */
renderSchedule(update);
update();
/* =========================
   EXPORT JSON (CTRL + S)
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