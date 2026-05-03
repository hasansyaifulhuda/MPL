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