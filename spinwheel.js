export function spinWheel(){
  const coins=[50,100,150,200,300,500];
  const reward=coins[Math.floor(Math.random()*coins.length)];
  alert(`🎉 Congratulations! You won ${reward} coins!`);
  const scoreDisplay=document.getElementById('score');
  scoreDisplay.innerText=parseInt(scoreDisplay.innerText)+reward;
}