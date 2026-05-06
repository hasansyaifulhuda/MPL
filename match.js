let cache = {};

/* =========================
   LOAD (LOCALSTORAGE)
========================= */
export async function loadResults(){

  try{
    const res = await fetch("./data/results.json");
    const json = await res.json();

    const local = localStorage.getItem("mpl_results");

    if(local){
      cache = JSON.parse(local); // user override
    } else {
      cache = json; // default dari GitHub
    }

  }catch(err){
    console.error("Gagal load JSON:", err);
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

    if(!week.days) return; // 🔥 FIX

    week.days.forEach(day=>{

      if(!day.matches) return; // 🔥 FIX

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

  localStorage.setItem("mpl_results", JSON.stringify(cache));
}

/* =========================
   RESET
========================= */
export function resetResults(){
  localStorage.removeItem("mpl_results");
  cache = {};
}