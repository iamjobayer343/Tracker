// ---------- DATE ----------
let today = new Date();
let dateKey = today.toISOString().slice(0,10);

document.getElementById("date").innerText =
today.toDateString();

// ---------- DARK MODE ----------
function toggleDark(){
document.body.classList.toggle("dark");
localStorage.setItem("dark",document.body.classList.contains("dark"));
}

if(localStorage.getItem("dark") === "true"){
document.body.classList.add("dark");
}

// ---------- SALAH SYSTEM ----------
let prayers = ["fajr","dhuhr","asr","maghrib","isha"];

if(!localStorage.getItem(dateKey)){
localStorage.setItem(dateKey,JSON.stringify({
    fajr:false,
    dhuhr:false,
    asr:false,
    maghrib:false,
    isha:false,
    pages:0,
    minutes:0
}));
}

let data = JSON.parse(localStorage.getItem(dateKey));

prayers.forEach(p=>{
 let box=document.getElementById(p);
 box.checked=data[p];
 box.onchange=()=>{
   data[p]=box.checked;
   saveDay();
   updateProgress();
   updateStreak();
 };
});

function updateProgress(){
let count=prayers.filter(p=>data[p]).length;
document.getElementById("progress").style.width=(count/5*100)+"%";
document.getElementById("progressText").innerText=
`${count} / 5 prayers completed`;
}
updateProgress();

// ---------- READING PAGES ----------
function savePages(){
let p=document.getElementById("pages").value;
data.pages=p;
saveDay();
document.getElementById("pageResult").innerText=`You read ${p} pages today`;
}

if(data.pages > 0){
document.getElementById("pageResult").innerText=`You read ${data.pages} pages today`;
}

// ---------- TIMER ----------
let sec=0;
let timer=null;

function startTimer(){
if(timer) return;
timer=setInterval(()=>{
sec++;
updateTimeUI();
},1000);
}

function updateTimeUI(){
let m=Math.floor(sec/60);
let s=sec%60;
document.getElementById("time").innerText=
`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
data.minutes = sec;
saveDay();
}

function stopTimer(){
clearInterval(timer);
timer=null;
}

function resetTimer(){
stopTimer();
sec=0;
updateTimeUI();
}

// ---------- SAVE DATA ----------
function saveDay(){
localStorage.setItem(dateKey,JSON.stringify(data));
loadHistory();
}

// ---------- HISTORY ----------
function loadHistory(){
let box=document.getElementById("historyBox");
box.innerHTML="";

for(let k in localStorage){
 if(k.match(/^\d{4}-\d{2}-\d{2}$/)){
   let d=JSON.parse(localStorage[k]);
   let done=Object.values(d).filter(v=>v===true).length;

   box.innerHTML += `<p><b>${k}</b> → Salah: ${done}/5, Pages: ${d.pages}, Minutes: ${d.minutes}</p>`;
 }
}
}
loadHistory();

// ---------- STREAK ----------
function updateStreak(){
let streak=0;

let keys = Object.keys(localStorage)
.filter(k=>k.match(/^\d{4}-\d{2}-\d{2}$/))
.sort();

for(let i=keys.length-1; i>=0; i--){
let d=JSON.parse(localStorage[keys[i]]);
let done=prayers.filter(p=>d[p]).length;

if(done === 5){
 streak++;
} else break;
}

document.getElementById("streak").innerText =
`🔥 Streak: ${streak} days`;
}
updateStreak();

// ---------- RESET ----------
function resetDay(){
localStorage.removeItem(dateKey);
location.reload();
}