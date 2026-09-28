const nav=document.getElementById("nav"), menuBtn=document.getElementById("menuBtn");
menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
document.getElementById("registerForm").addEventListener("submit",e=>{e.preventDefault();alert("شكراً لكم. سنتواصل معكم لتأكيد التسجيل واستكمال باقي الإجراءات.");e.target.reset();});
document.getElementById("complaintForm").addEventListener("submit",e=>{e.preventDefault();alert("شكراً على تواصلكم وتقييمكم.");e.target.reset();});
