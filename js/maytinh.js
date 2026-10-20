const roomNames=['Phòng thực hành 1','Phòng thực hành 2','Phòng thực hành 3','Phòng thực hành 4'];
const cpuList=['AMD Ryzen 5 5600G','Intel Core i5-10400','Intel Core i5-12400','Intel Core i7-11700'];
const ramList=['8GB','8GB','16GB','16GB'];
const diskList=['256GB SSD','1TB HDD','512GB SSD','512GB SSD'];
const gpuList=['AMD Radeon Graphics','NVIDIA GTX 1650','NVIDIA GTX 1650','NVIDIA GTX 1660'];
const dataDefault=roomNames.flatMap((room,ri)=>Array.from({length:30},(_,j)=>{
  const n=j+1, idx=(j+ri)%cpuList.length;
  const status=(j===5?'Hỏng':j===3||j===12?'Đang sử dụng':'Sẵn sàng');
  return {code:`A${ri+1}-101-${String(n).padStart(2,'0')}`,room,cpu:cpuList[idx],ram:ramList[idx],disk:diskList[idx],gpu:gpuList[idx],position:`Dãy ${Math.floor(j/10)+1} - Số ${(j%10)+1}`,status,date:'2023-08-15'};
}));
let machines=JSON.parse(localStorage.getItem('lm_machines_4rooms_v1')||'null')||dataDefault;

if(!localStorage.getItem('lm_machines_4rooms_v1')) localStorage.setItem('lm_machines_4rooms_v1',JSON.stringify(machines));
const $=id=>document.getElementById(id);
function badge(s){let c=s==='Sẵn sàng'?'ready':s==='Đang sử dụng'?'using':s==='Hỏng'?'broken':'maint';return `<span class="badge ${c}">${s}</span>`}
function rooms(){return [...new Set(machines.map(x=>x.room))]}
function fillRooms(){let r=rooms();$('roomFilter').innerHTML='<option value="">Tất cả phòng</option>'+r.map(x=>`<option>${x}</option>`).join('');$('room').innerHTML=r.map(x=>`<option>${x}</option>`).join('')}
function render(){let q=$('search').value.toLowerCase(),rf=$('roomFilter').value,sf=$('statusFilter').value;let list=machines.filter(x=>(!q||JSON.stringify(x).toLowerCase().includes(q))&&(!rf||x.room===rf)&&(!sf||x.status===sf));$('machineTable').innerHTML=list.map(x=>{let i=machines.indexOf(x);return `<tr><td><span class="code">${x.code}</span></td><td>${x.room}</td><td class="config"><b>${x.cpu}</b><br>${x.ram} · ${x.disk}<br>${x.gpu}</td><td>${x.position}</td><td>${badge(x.status)}</td><td>${x.date?x.date.split('-').reverse().join('/'):'—'}</td><td><button class="action-btn" onclick="editMachine(${i})">✎</button><button class="action-btn" onclick="deleteMachine(${i})">🗑</button></td></tr>`}).join('')||'<tr><td colspan="7" style="text-align:center;padding:35px">Không tìm thấy máy tính.</td></tr>';$('resultCount').textContent=`Hiển thị ${list.length} / ${machines.length} máy`;$('total').textContent=machines.length;$('ready').textContent=machines.filter(x=>x.status==='Sẵn sàng').length;$('using').textContent=machines.filter(x=>x.status==='Đang sử dụng').length;$('problem').textContent=machines.filter(x=>x.status==='Hỏng'||x.status==='Bảo trì').length}
function openModal(i=null){fillRooms();$('machineForm').reset();$('editIndex').value=i??'';$('modalTitle').textContent=i===null?'Thêm máy tính':'Cập nhật máy tính';if(i!==null){let x=machines[i];for(let k of ['code','room','position','status','cpu','ram','disk','gpu'])$(k).value=x[k]||'';$('os').value=x.os||'Windows 11 Pro';$('maintenance').value=x.date||'';$('note').value=x.note||''}else $('os').value='Windows 11 Pro';$('modal').classList.add('show')}
function closeModal(){$('modal').classList.remove('show')}
function editMachine(i){openModal(i)}
function deleteMachine(i){if(confirm('Xóa máy '+machines[i].code+'?')){machines.splice(i,1);localStorage.setItem('lm_machines_4rooms_v1',JSON.stringify(machines));fillRooms();render();toast('Đã xóa máy tính')}}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800)}
$('addBtn').onclick=()=>openModal();$('closeBtn').onclick=closeModal;$('cancelBtn').onclick=closeModal;$('search').oninput=render;$('roomFilter').onchange=render;$('statusFilter').onchange=render;$('machineForm').onsubmit=e=>{e.preventDefault();let x={code:$('code').value.trim(),room:$('room').value,position:$('position').value.trim(),status:$('status').value,cpu:$('cpu').value.trim()||'Chưa cập nhật',ram:$('ram').value.trim()||'—',disk:$('disk').value.trim()||'—',gpu:$('gpu').value.trim()||'—',os:$('os').value,date:$('maintenance').value,note:$('note').value};let i=$('editIndex').value;if(i==='')machines.push(x);else machines[+i]=x;localStorage.setItem('lm_machines_4rooms_v1',JSON.stringify(machines));fillRooms();render();closeModal();toast(i===''?'Đã thêm máy tính':'Đã cập nhật máy tính')};$('modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
fillRooms();render();
