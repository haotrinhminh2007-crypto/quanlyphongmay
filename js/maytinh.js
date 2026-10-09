const dataDefault=[
['A1-101-02','Phòng thực hành 1','AMD Ryzen 5 6600G','8GB','256GB SSD','AMD Radeon Graphics','Dãy 1 - Số 2','Sẵn sàng'],
['A1-101-03','Phòng thực hành 1','Intel Core i5-10400','8GB','1TB HDD','NVIDIA GTX 1650','Dãy 1 - Số 3','Sẵn sàng'],
['A1-101-04','Phòng thực hành 1','Intel Core i5-12400','16GB','512GB SSD','NVIDIA GTX 1650','Dãy 1 - Số 4','Sẵn sàng'],
['A1-101-05','Phòng thực hành 1','Intel Core i7-11700','16GB','512GB SSD','NVIDIA GTX 1660','Dãy 1 - Số 5','Đang sử dụng'],
['A1-101-06','Phòng thực hành 1','AMD Ryzen 5 5600G','8GB','256GB SSD','AMD Radeon Graphics','Dãy 1 - Số 6','Sẵn sàng'],
['A1-101-07','Phòng thực hành 1','Intel Core i5-10400','8GB','1TB HDD','NVIDIA GTX 1650','Dãy 1 - Số 1','Hỏng'],
['A1-101-08','Phòng thực hành 1','Intel Core i5-12400','16GB','512GB SSD','NVIDIA GTX 1650','Dãy 2 - Số 2','Sẵn sàng'],
['A1-101-09','Phòng thực hành 1','Intel Core i7-11700','16GB','512GB SSD','NVIDIA GTX 1650','Dãy 2 - Số 3','Sẵn sàng']
].map(x=>({code:x[0],room:x[1],cpu:x[2],ram:x[3],disk:x[4],gpu:x[5],position:x[6],status:x[7],date:'2023-08-15'}));
let machines=JSON.parse(localStorage.getItem('lm_machines')||'null')||dataDefault;
const $=id=>document.getElementById(id);
function badge(s){let c=s==='Sẵn sàng'?'ready':s==='Đang sử dụng'?'using':s==='Hỏng'?'broken':'maint';return `<span class="badge ${c}">${s}</span>`}
function rooms(){return [...new Set(machines.map(x=>x.room))]}
function fillRooms(){let r=rooms();$('roomFilter').innerHTML='<option value="">Tất cả phòng</option>'+r.map(x=>`<option>${x}</option>`).join('');$('room').innerHTML=r.map(x=>`<option>${x}</option>`).join('')}
function render(){let q=$('search').value.toLowerCase(),rf=$('roomFilter').value,sf=$('statusFilter').value;let list=machines.filter(x=>(!q||JSON.stringify(x).toLowerCase().includes(q))&&(!rf||x.room===rf)&&(!sf||x.status===sf));$('machineTable').innerHTML=list.map(x=>{let i=machines.indexOf(x);return `<tr><td><span class="code">${x.code}</span></td><td>${x.room}</td><td class="config"><b>${x.cpu}</b><br>${x.ram} · ${x.disk}<br>${x.gpu}</td><td>${x.position}</td><td>${badge(x.status)}</td><td>${x.date?x.date.split('-').reverse().join('/'):'—'}</td><td><button class="action-btn" onclick="editMachine(${i})">✎</button><button class="action-btn" onclick="deleteMachine(${i})">🗑</button></td></tr>`}).join('')||'<tr><td colspan="7" style="text-align:center;padding:35px">Không tìm thấy máy tính.</td></tr>';$('resultCount').textContent=`Hiển thị ${list.length} / ${machines.length} máy`;$('total').textContent=machines.length;$('ready').textContent=machines.filter(x=>x.status==='Sẵn sàng').length;$('using').textContent=machines.filter(x=>x.status==='Đang sử dụng').length;$('problem').textContent=machines.filter(x=>x.status==='Hỏng'||x.status==='Bảo trì').length}
function openModal(i=null){fillRooms();$('machineForm').reset();$('editIndex').value=i??'';$('modalTitle').textContent=i===null?'Thêm máy tính':'Cập nhật máy tính';if(i!==null){let x=machines[i];for(let k of ['code','room','position','status','cpu','ram','disk','gpu'])$(k).value=x[k]||'';$('os').value=x.os||'Windows 11 Pro';$('maintenance').value=x.date||'';$('note').value=x.note||''}else $('os').value='Windows 11 Pro';$('modal').classList.add('show')}
function closeModal(){$('modal').classList.remove('show')}
function editMachine(i){openModal(i)}
function deleteMachine(i){if(confirm('Xóa máy '+machines[i].code+'?')){machines.splice(i,1);localStorage.setItem('lm_machines',JSON.stringify(machines));fillRooms();render();toast('Đã xóa máy tính')}}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800)}
$('addBtn').onclick=()=>openModal();$('closeBtn').onclick=closeModal;$('cancelBtn').onclick=closeModal;$('search').oninput=render;$('roomFilter').onchange=render;$('statusFilter').onchange=render;$('machineForm').onsubmit=e=>{e.preventDefault();let x={code:$('code').value.trim(),room:$('room').value,position:$('position').value.trim(),status:$('status').value,cpu:$('cpu').value.trim()||'Chưa cập nhật',ram:$('ram').value.trim()||'—',disk:$('disk').value.trim()||'—',gpu:$('gpu').value.trim()||'—',os:$('os').value,date:$('maintenance').value,note:$('note').value};let i=$('editIndex').value;if(i==='')machines.push(x);else machines[+i]=x;localStorage.setItem('lm_machines',JSON.stringify(machines));fillRooms();render();closeModal();toast(i===''?'Đã thêm máy tính':'Đã cập nhật máy tính')};$('modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
fillRooms();render();
