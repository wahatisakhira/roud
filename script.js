const viewer=document.getElementById('viewer');
const total=9; let current=1;
for(let i=1;i<=total;i++){
  const page=document.createElement('section');
  page.className='page'+(i===1?' active':'');
  const img=document.createElement('img');
  img.src=`pages/page-${i}.png`;
  img.alt=`صفحة ${i} من تصميم روض واحتي الصغيرة`;
  page.appendChild(img);
  viewer.appendChild(page);
}
const pages=[...document.querySelectorAll('.page')];
const counter=document.getElementById('counter');
function show(n){
  current=Math.max(1,Math.min(total,n));
  pages.forEach((p,i)=>p.classList.toggle('active',i===current-1));
  counter.textContent=`${current} / ${total}`;
  window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('prev').onclick=()=>show(current-1);
document.getElementById('next').onclick=()=>show(current+1);
document.getElementById('full').onclick=()=>document.documentElement.requestFullscreen?.();
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft')show(current+1);
  if(e.key==='ArrowRight')show(current-1);
});
