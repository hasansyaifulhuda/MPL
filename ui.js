import { schedule } from "./data.js";
import { getResult, saveAllResults, resetResults } from "./match.js";

/* =========================
   TABLE
========================= */
export function renderTable(teams){

  const table = document.getElementById("table");
  let html = "";

  teams.forEach((t,i)=>{

    const net = t.gw - t.gl;
    let rowClass = i < 6 ? "playoff" : "eliminated";

    html += `
    <tr class="${rowClass}">
      <td class="rank">${i+1}</td>

      <td class="team">
        <div class="team-box">
          <img src="assets/logos/${t.name}.png">
          <span>${t.name}</span>
        </div>
      </td>

      <td class="red">${t.mw}</td>
      <td>${t.mw} - ${t.ml}</td>
      <td class="red">${net}</td>
      <td>${t.gw} - ${t.gl}</td>
    </tr>
    `;
  });

  table.innerHTML = html;
}

/* =========================
   SCHEDULE
========================= */
let currentWeek = 0;

export function renderSchedule(update){

  const container = document.getElementById("schedule");

  let html = `
  <div class="schedule-header">
    <h2>JADWAL</h2>
    <div>
      <button id="resetBtn">RESET</button>
      <button id="saveAllBtn">SAVE ALL</button>
    </div>
  </div>
  `;

  /* WEEK TABS */
  html += `<div class="week-tabs">`;
  schedule.forEach((w,i)=>{
    html += `<div class="week-tab ${i===currentWeek?"active":""}" data-i="${i}">Week ${w.week}</div>`;
  });
  html += `</div>`;

  const week = schedule[currentWeek];

  html += `<div class="week-grid">`;

  week.days.forEach(day=>{
    html += `
    <div class="day-box">
      <div class="day-title">${day.date}</div>
    `;

    day.matches.forEach(m=>{
      const r = getResult(m.id);

      html += `
      <div class="match-card">

        <!-- KIRI -->
        <div class="team-side left">
          <img src="assets/logos/${m.teamA}.png">
          <span>${m.teamA}</span>
        </div>

        <!-- TENGAH -->
        <div class="center-box">
          <div class="time">${m.time}</div>
          <div class="score-box">
            <input id="${m.id}-A" value="${r?.scoreA ?? 0}">
            <span class="vs">VS</span>
            <input id="${m.id}-B" value="${r?.scoreB ?? 0}">
          </div>
        </div>

        <!-- KANAN (LOGO DI POJOK KANAN) -->
        <div class="team-side right">
  <img src="assets/logos/${m.teamB}.png">
  <span>${m.teamB}</span>
</div>

      </div>
      `;
    });

    html += `</div>`;
  });

  html += `</div>`;
  container.innerHTML = html;

  /* =========================
     WEEK TAB CLICK
  ========================= */
  document.querySelectorAll(".week-tab").forEach(tab=>{
    tab.onclick = ()=>{
      currentWeek = parseInt(tab.dataset.i);
      renderSchedule(update);
    };
  });

  /* =========================
     INPUT VALIDATION
  ========================= */
  document.querySelectorAll(".match-card input").forEach(inp=>{

    inp.oninput = ()=>{
      inp.value = inp.value.replace(/[^0-9]/g,"");
    };

    inp.onfocus = ()=>{
      if(inp.value === "0") inp.value = "";
    };

    inp.onblur = ()=>{
      if(inp.value === "") inp.value = "0";
    };

  });

  /* =========================
     SAVE
  ========================= */
  document.getElementById("saveAllBtn").onclick = async function(){

    this.innerText = "Saving...";
    this.disabled = true;

    await saveAllResults(schedule);

    this.innerText = "Saved ✓";

    setTimeout(()=>{
      this.innerText = "SAVE ALL";
      this.disabled = false;
    },1500);

    update();
  };

  /* =========================
     RESET
  ========================= */
  document.getElementById("resetBtn").onclick = ()=>{
    if(confirm("Reset semua data?")){
      resetResults();
      renderSchedule(update);
      update();
    }
  };
}