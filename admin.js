import { db, ref, get, set, ADMIN_UID } from "./firebase.js";
const currentUser=window.Telegram.WebApp.initDataUnsafe.user.id;
if(currentUser!=ADMIN_UID){document.body.innerHTML="<h2>Access Denied</h2>";throw new Error("Unauthorized");}

async function loadWithdrawRequests(){
  const snapshot=await get(ref(db,"withdraw"));
  const div=document.getElementById("withdrawList");
  div.innerHTML="";
  if(!snapshot.exists()) return;
  const data=snapshot.val();
  Object.keys(data).forEach(uid=>{
    const req=data[uid];
    const d=document.createElement("div");
    d.innerHTML=`${req.name}: ${req.coins} coins - ${req.status} <button onclick="approve('${uid}')">Approve</button><button onclick="deny('${uid}')">Deny</button>`;
    div.appendChild(d);
  });
}
window.approve=async uid=>{await set(ref(db,"withdraw/"+uid+"/status"),"approved");loadWithdrawRequests();}
window.deny=async uid=>{await set(ref(db,"withdraw/"+uid+"/status"),"denied");loadWithdrawRequests();}

async function loadLeaderboard(){
  const snapshot=await get(ref(db,"leaderboard"));
  const div=document.getElementById("leaderboardList");
  div.innerHTML="";
  if(!snapshot.exists()) return;
  const data=snapshot.val();
  Object.values(data).sort((a,b)=>b.score-a.score).forEach(u=>{
    const d=document.createElement("div");
    d.innerText=`${u.name}: ${u.score} points`;
    div.appendChild(d);
  });
}
loadWithdrawRequests();loadLeaderboard();