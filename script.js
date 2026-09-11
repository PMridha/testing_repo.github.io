const F=["State","District","Latitude","Longitude","Movement_Type","Movement_History","Annual_Rainfall_Normal_mm","Rainfall_Pattern","Soil_Distribution","Vegetation"];
const R={"0":"LOW","1":"MEDIUM","2":"HIGH"};let M,D;
async function init(){[M,D]=await Promise.all([fetch("model.json").then(r=>r.json()),fetch("metadata.json").then(r=>r.json())]);
["State","Movement_Type","Annual_Rainfall_Normal_mm","Rainfall_Pattern","Soil_Distribution","Vegetation","District"].forEach(x=>fill(x,D.categories[x]));
document.getElementById("State").onchange=filterDistrict;filterDistrict();}
function fill(id,a){let e=document.getElementById(id);e.innerHTML="";a.forEach(v=>{let o=document.createElement("option");o.value=v;o.textContent=v;e.appendChild(o)})}
function filterDistrict(){let s=document.getElementById("State").value;let a=[...new Set(D.location_rows.filter(x=>x.State===s).map(x=>x.District).filter(Boolean))];if(a.length)fill("District",a)}
function enc(f,v){let a=M.encoders[f];if(!a)return Number(v);let i=a.indexOf(String(v));if(i>=0)return i;
if(f==="Latitude"||f==="Longitude"){let n=Number(v),best=0,bd=Infinity;a.forEach((q,j)=>{let d=Math.abs(Number(q)-n);if(d<bd){bd=d;best=j}});return best}
throw Error(`"${v}" is not a training value for ${f}.`)}
function predict(inp){let x=F.map(f=>enc(f,inp[f])),tot=Array(M.classes.length).fill(0);
M.trees.forEach(t=>{let n=0;while(t.children_left[n]!==-1){let j=t.feature[n];n=x[j]<=t.threshold[n]?t.children_left[n]:t.children_right[n]}
let c=t.value[n],s=c.reduce((a,b)=>a+b,0);c.forEach((v,i)=>tot[i]+=s?v/s:0)});let p=tot.map(v=>v/M.trees.length),b=p.indexOf(Math.max(...p));return{c:String(M.classes[b]),p}}
function show(z){let name=R[z.c]||`CLASS ${z.c}`;document.getElementById("riskLevel").textContent=name;
document.getElementById("riskText").textContent=`Highest model probability: ${name.toLowerCase()} risk.`;
let box=document.getElementById("probabilities");box.innerHTML="";z.p.forEach((v,i)=>{let n=R[String(M.classes[i])]||`CLASS ${M.classes[i]}`,q=(v*100).toFixed(1);
box.insertAdjacentHTML("beforeend",`<div class="prob-row"><b>${n}</b><div class="bar"><div class="fill" style="width:${q}%"></div></div><span>${q}%</span></div>`)});
document.getElementById("result").classList.remove("hidden");}
document.getElementById("riskForm").onsubmit=e=>{e.preventDefault();try{let x={};F.forEach(f=>x[f]=document.getElementById(f).value);x.Movement_History=Number(x.Movement_History);show(predict(x))}catch(err){alert(err.message)}};
init().catch(e=>alert("Model files could not be loaded. Use a web server/GitHub Pages, not file://."));