// Trang Phòng máy
function renderRooms(){
  const now=new Date();
  document.getElementById('rooms').innerHTML=[1,2,3,4].map(r=>{
    const b=state.bookings.find(b=>b.room===r&&startOf(b)<=now&&now<endOf(b));
    return `<div class="room ${b?'busy':''}"><div class="row"><h3>Phòng máy ${r}</h3><span class="dot" aria-hidden="true"></span></div>
    <div><div class="st">${b?'Đang thực hành':'Trống'}</div><div class="info">${b?'<b>'+esc(b.cls)+'</b>Ca '+b.shift+' · '+hm(SHIFTS[b.shift].s)+' – '+hm(SHIFTS[b.shift].e):'Chưa có lớp thực hành'}</div></div></div>`;
  }).join('');
}

function renderAll(){archive();renderToday();renderRooms()}
renderAll();
setInterval(renderAll,20000);
