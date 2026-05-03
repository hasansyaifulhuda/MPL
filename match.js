let cache = {};

/* =========================
   LOAD (LOCALSTORAGE)
========================= */
export function loadResults(){
  const saved = localStorage.getItem("mpl_results");

  if(saved){
    cache = JSON.parse(saved);
  } else {
    cache = {};
  }

  return cache;
}

/* =========================
   GET
========================= */
export function getResult(id){
  return cache[id];
}

/* =========================
   SAVE SATU
========================= */
export function setResult(id, a, b){
  cache[id] = {
    scoreA: a,
    scoreB: b
  };
}

/* =========================
   SAVE SEMUA (FIX STRUCTURE)
========================= */
export async function saveAllResults(schedule){

  schedule.forEach(week=>{
    week.days.forEach(day=>{
      day.matches.forEach(m=>{

        const inputA = document.getElementById(m.id + "-A");
        const inputB = document.getElementById(m.id + "-B");

        if(!inputA || !inputB) return;

        const a = parseInt(inputA.value);
        const b = parseInt(inputB.value);

        if(!isNaN(a) && !isNaN(b)){
          setResult(m.id, a, b);
        }

      });
    });
  });

  /* SIMPAN KE LOCAL */
  localStorage.setItem("mpl_results", JSON.stringify(cache));
}

/* =========================
   RESET
========================= */
export function resetResults(){
  localStorage.removeItem("mpl_results");
  cache = {};
}