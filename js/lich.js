// Trang Đặt lịch ca
let weekStart=mondayOf(new Date()), view='cur';
function mondayOf(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x}

function renderCal(){
  const days=[...Array(7)].map((_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d});
  const today=dkey(new Date()), now=new Date();
  document.getElementById('wlabel').textContent=fmtDate(dkey(days[0])).slice(0,5)+' – '+fmtDate(dkey(days[6]));
  let h='<thead><tr><th>Ca</th>'+days.map(d=>`<th class="${dkey(d)===today?'today':''}">${DOW[d.getDay()]}<small>${pad(d.getDate())}/${pad(d.getMonth()+1)}</small></th>`).join('')+'</tr></thead><tbody>';
  for(let s=1;s<=4;s++){
    h+=`<tr><td class="ca-col"><b>Ca ${s}</b><small>${hm(SHIFTS[s].s)} – ${hm(SHIFTS[s].e)}</small></td>`;
    days.forEach(d=>{
      const list=state.bookings.filter(b=>b.date===dkey(d)&&b.shift===s).sort((a,b)=>a.room-b.room);
      h+='<td>'+list.map(b=>`<span class="chip ${startOf(b)<=now?'live':''}">${esc(b.cls)}<small>Phòng máy ${b.room}</small></span>`).join('')+'</td>';
    });
    h+='</tr>';
  }
  document.getElementById('cal').innerHTML=h+'</tbody>';
}

function renderHist(){
  const el=document.getElementById('hist');
  if(!state.history.length){el.innerHTML='<div class="empty">Chưa có ca nào thực hành xong. Các ca đã qua giờ sẽ được lưu ở đây.</div>';return}
  const rows=[...state.history].sort((a,b)=>endOf(b)-endOf(a)).map(b=>`<tr><td>${fmtDate(b.date)}</td><td>Ca ${b.shift} (${hm(SHIFTS[b.shift].s)} – ${hm(SHIFTS[b.shift].e)})</td><td>${esc(b.cls)}</td><td>Phòng máy ${b.room}</td></tr>`).join('');
  el.innerHTML=`<table><thead><tr><th>Ngày</th><th>Ca</th><th>Lớp học phần</th><th>Phòng</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderAll(){archive();renderToday();renderCal();renderHist()}
// Lịch hiện tại / Lịch sử
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{
  view=b.dataset.view;
  document.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b));
  document.getElementById('calwrap').style.display=view==='cur'?'':'none';
  document.getElementById('hist').style.display=view==='his'?'':'none';
  document.getElementById('weekctl').style.display=view==='cur'?'inline-flex':'none';
});
const shiftWeek=n=>{weekStart.setDate(weekStart.getDate()+n*7);renderCal()};
prev.onclick=()=>shiftWeek(-1);next.onclick=()=>shiftWeek(1);
thisweek.onclick=()=>{weekStart=mondayOf(new Date());renderCal()};

// Form đăng kí
document.getElementById('f-shifts').innerHTML=[1,2,3,4].map(s=>`<label><input type="checkbox" value="${s}"> Ca ${s}<small>${hm(SHIFTS[s].s)} – ${hm(SHIFTS[s].e)}</small></label>`).join('');
const pop=document.getElementById('pop'), plus=document.getElementById('plus'), toast=document.getElementById('toast');
function setPop(open){pop.classList.toggle('on',open);plus.setAttribute('aria-expanded',open);if(open){toast.classList.remove('on');fdate.value=fdate.value||dkey(new Date())}}
const fdate=document.getElementById('f-date');
plus.onclick=()=>setPop(!pop.classList.contains('on'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setPop(false)});
let tt;
function notify(msg,type){
  toast.className='toast on '+type;toast.textContent=msg;
  clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('on'),4000);
}
pop.onsubmit=e=>{
  e.preventDefault();archive();
  const date=fdate.value, room=+document.querySelector('input[name=room]:checked').value, cls=document.getElementById('f-cls').value.trim();
  const picked=[...document.querySelectorAll('#f-shifts input:checked')].map(i=>+i.value);
  if(!date||!cls){notify('Hãy nhập ngày và lớp học phần.','err');return}
  if(!picked.length){notify('Hãy chọn ít nhất một ca.','err');return}
  if(picked.some(s=>endOf({date,shift:s})<=new Date())){notify('Ca này đã qua, hãy chọn ca khác.','err');return}
  if(picked.some(s=>state.bookings.some(b=>b.date===date&&b.shift===s&&b.room===room))){
    setPop(false);notify('Đã có lớp đăng kí ca này rồi.','err');return}
  picked.forEach(s=>state.bookings.push({id:Date.now()+'-'+s,date,shift:s,room,cls}));
  save();
  // chuyển lịch sang tuần của ngày vừa đăng kí
  weekStart=mondayOf(mk(date,[0,0]));
  setPop(false);pop.reset();
  notify('Đăng kí thành công: '+cls+', Phòng máy '+room+', '+fmtDate(date)+', ca '+picked.join(', ')+'.','ok');
  renderAll();
};

renderAll();
setInterval(renderAll,20000);
