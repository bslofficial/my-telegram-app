import { db, ref, set, ADMIN_UID } from './firebase.js';
import { spinWheel } from './spinwheel.js';

const tg=window.Telegram.WebApp;
tg.expand();
const grid=document.getElementById('grid'),scoreDisplay=document.getElementById('score'),timerDisplay=document.getElementById('timer');
const width=8,squares=[];let score=0,timeLeft=60,selectedSquareId,targetSquareId;

let AdController;
if(window.Adsgram){AdController=window.Adsgram.init({blockId:"bot-23742"});}

function createBoard(){
  for(let i=0;i<width*width;i++){
    const square=document.createElement('div');
    let randomColor=Math.floor(Math.random()*5);
    square.classList.add(`candy-${randomColor}`);
    square.id=i;
    square.addEventListener('touchstart',e=>selectedSquareId=parseInt(e.target.id));
    square.addEventListener('touchend',e=>{
      const t=e.changedTouches[0];
      const target=document.elementFromPoint(t.clientX,t.clientY);
      if(target&&target.id){targetSquareId=parseInt(target.id);moveCandies();}
    });
    grid.appendChild(square);squares.push(square);
  }
}
createBoard();

function moveCandies(){
  const valid=[selectedSquareId-1,selectedSquareId+1,selectedSquareId-width,selectedSquareId+width];
  if(valid.includes(targetSquareId)){
    let s=squares[selectedSquareId].className,t=squares[targetSquareId].className;
    squares[selectedSquareId].className=t;
    squares[targetSquareId].className=s;
    checkMatches();
  }
}

function checkMatches(){
  for(let i=0;i<62;i++){
    const row=[i,i+1,i+2],c=squares[i].className;
    if((i+1)%width!==0&&(i+2)%width!==0&&c!==''){
      if(row.every(idx=>squares[idx].className===c)){
        score+=10;scoreDisplay.innerText=score;
        row.forEach(idx=>squares[idx].className='candy-'+Math.floor(Math.random()*5));
      }
    }
  }
}

document.getElementById('watchAdBtn').onclick=function(){
  if(AdController){
    AdController.show().then(()=>{score+=500;scoreDisplay.innerText=score;alert("৫০০ পয়েন্ট বোনাস পেলেন!");}).catch(()=>{alert("বিজ্ঞাপন দেখা সম্ভব হয়নি।");});
  }else{score+=500;scoreDisplay.innerText=score;alert("৫০০ পয়েন্ট বোনাস (Dummy)");}
}

document.getElementById('resetBtn').onclick=()=>location.reload();
document.getElementById('spinWheelBtn').onclick=()=>spinWheel();

setInterval(()=>{
  timeLeft--;timerDisplay.innerText=timeLeft;
  if(timeLeft<=0){alert("সময় শেষ! স্কোর: "+score);location.reload();}
},1000);

setInterval(checkMatches,300);

const today=new Date().toDateString();
if(localStorage.getItem("dailyReward")!==today){
  score+=100;scoreDisplay.innerText=score;
  localStorage.setItem("dailyReward",today);
  set(ref(db,'dailyRewards/'+tg.initDataUnsafe.user.id),{lastClaim:today,coins:100});
  alert("Daily Reward +100 coins!");
}