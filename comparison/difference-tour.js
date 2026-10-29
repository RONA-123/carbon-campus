import * as THREE from 'three';
const chapters=[
 {title:'01 总图结构',text:['围合翼楼建立中央大院，空间向内集中。','保留原有建筑组合，以多处庭院串联。','拆分建筑组团，让连续公园穿过园区。']},
 {title:'02 建筑体量',text:['观察高亮翼楼：转角主楼与侧翼围合成院。','观察高亮原有主楼：保留南侧与西侧体量关系。','观察高亮主楼：分散布置，三座主楼逐层退台。']},
 {title:'03 庭院与绿地',text:['中央铺装大院为主要集散空间，绿化沿边组织。','绿地与步行联系形成多个共享庭院节点。','连续绿地连接小组团，步道穿行于公园之间。']},
 {title:'04 入口与步行',text:['集中到达 → 步行主轴 → 中央院落。','外围到达 → 庭院串联 → 共享空间。','外围服务 → 公园步道 → 分散建筑组团。']},
 {title:'05 夜景与规模',text:['规模指数 104，较 B 约 +4%；侧重集中形象。','规模指数 100，作为保留原图的比较基准。','规模指数 90，较 B 约 −10%；需平衡功能承载。']}
];
export function createDifferenceTour(sites,panes){
 const bar=document.createElement('nav');bar.className='difference-chapters';bar.setAttribute('aria-label','重点差异比选');bar.innerHTML='<b>重点差异</b>'+chapters.map((c,i)=>`<button data-difference="${i}">${c.title}</button>`).join('')+'<button data-clear-difference>收起高亮</button>';document.querySelector('.workspace-top').after(bar);
 const captions=panes.map((p,i)=>{const el=document.createElement('div');el.className='difference-caption';el.hidden=true;p.querySelector('.view-window').append(el);return el;});
 const colours=[0xe9a338,0x36b9bb,0x93c940];
 const groups=sites.map((s,i)=>{const g=new THREE.Group();g.renderOrder=20;s.scene.add(g);const mats=[];s.specs.forEach(spec=>{const points=spec.pts.map(([x,y])=>new THREE.Vector3((x-440)*.22,spec.floors*3.65+.8,(y-430)*.22));points.push(points[0].clone());const material=new THREE.LineBasicMaterial({color:colours[i],transparent:true,opacity:.95,depthTest:false});const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);g.add(line);mats.push(material);});g.visible=false;return {g,mats};});
 const markers=sites.map((s,i)=>{const g=new THREE.Group();s.scene.add(g);const ring=new THREE.Mesh(new THREE.RingGeometry(4,4.7,48),new THREE.MeshBasicMaterial({color:colours[i],transparent:true,opacity:.8,side:THREE.DoubleSide,depthTest:false}));ring.rotation.x=-Math.PI/2;ring.renderOrder=21;g.add(ring);g.visible=false;return g;});
 let chapter=-1;
 const api={onSelect:null,show(k){chapter=k;const c=chapters[k];captions.forEach((el,i)=>{el.hidden=false;el.innerHTML=`<strong>${c.title} · ${'ABC'[i]}</strong><span>${c.text[i]}</span><small>${k===4?'模型相对指数，B=100；不是报批面积':'彩色轮廓与光圈为比较提示；不代表真实设施'}</small>`;});groups.forEach(({g},i)=>{g.visible=true;g.children.forEach((l,j)=>l.visible=k!==1||sites[i].specs[j].floors>1);markers[i].visible=k===2||k===3;});bar.querySelectorAll('[data-difference]').forEach(b=>b.classList.toggle('active',+b.dataset.difference===k));},animate(i,t){groups[i].mats.forEach(m=>m.opacity=.65+.35*(.5+.5*Math.sin(t*3.5)));const g=markers[i],q=chapter===3?[390,577]:[[405,455],[389,456],[448,463]][i];g.position.set((q[0]-440)*.22,1.6,(q[1]-430)*.22);g.scale.setScalar(1+(t%1.8)/1.8*.65);g.children[0].material.opacity=.85-(t%1.8)/1.8*.6;}};
 bar.querySelectorAll('[data-difference]').forEach(b=>b.onclick=()=>api.onSelect?.(+b.dataset.difference));bar.querySelector('[data-clear-difference]').onclick=()=>{captions.forEach(c=>c.hidden=true);groups.forEach(x=>x.g.visible=false);markers.forEach(g=>g.visible=false);bar.querySelectorAll('.active').forEach(b=>b.classList.remove('active'));};return api;
}
