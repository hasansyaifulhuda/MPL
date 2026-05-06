import { schedule } from "./data.js";
import { getResult } from "./match.js";

export function createTeams(){
  return ["ONIC","DEWA","BTR","AE","EVOS","TLID","GEEK","NAVI","RRQ"]
  .map(n=>({name:n,mw:0,ml:0,gw:0,gl:0}));
}

export function calculate(teams){

  // reset semua
  teams.forEach(t=>{
    t.mw=0; t.ml=0; t.gw=0; t.gl=0;
  });

  // LOOP BARU (sesuai struktur baru)
  schedule.forEach(week=>{
    week.days.forEach(day=>{
      day.matches.forEach(m=>{

        const r = getResult(m.id);
        if(!r) return;

        const scoreA = r.scoreA;
        const scoreB = r.scoreB;

        // skip kalau 0-0 (belum dimainkan)
        if(scoreA === 0 && scoreB === 0) return;

        let A = teams.find(t=>t.name===m.teamA);
        let B = teams.find(t=>t.name===m.teamB);

        // game win
        A.gw += scoreA;
        A.gl += scoreB;

        B.gw += scoreB;
        B.gl += scoreA;

        // match win
        if(scoreA > scoreB){
          A.mw++; B.ml++;
        } else {
          B.mw++; A.ml++;
        }

      });
    });
  });

  return sort(teams);
}

function sort(t){
  return t.sort((a,b)=>{
    if(b.mw!==a.mw) return b.mw-a.mw;

    let netA = a.gw-a.gl;
    let netB = b.gw-b.gl;

    if(netB!==netA) return netB-netA;

    return b.gw-a.gw;
  });
}