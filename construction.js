import * as THREE from 'three';
// Deterministic component scheduling: members retain their actual section sizes.
export function construct({s,i,pts,polygon,box,materials,scene,picks}){
 const root=new THREE.Group();scene.add(root);const tasks=[],floors=[],ceilings=[],clamp=THREE.MathUtils.clamp;
 const {concrete,steel,wall,glass,roof,soil}=materials;const roomMaterials=[],interiorLights=[];let night=false;
 const add=(mesh,start,end,kind='place')=>{tasks.push({mesh,start,end,kind,y:mesh.position.y,sy:mesh.scale.y});mesh.userData.index=i;picks.push(mesh);return mesh;};
 const inside=(x,z)=>{let yes=false;for(let a=0,b=pts.length-1;a<pts.length;b=a++){const p=pts[a],q=pts[b];if((p[1]>z)!==(q[1]>z)&&x<(q[0]-p[0])*(z-p[1])/(q[1]-p[1])+p[0])yes=!yes;}return yes;};
 const xs=pts.map(p=>p[0]),zs=pts.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),grid=[];
 const gx=[],gz=[];for(let x=minX+.6;x<maxX-.6;x+=6)gx.push(x);gx.push(maxX-.6);for(let z=minZ+.6;z<maxZ-.6;z+=6)gz.push(z);gz.push(maxZ-.6);for(const x of gx)for(const z of gz)if(inside(x,z))grid.push([x,z]);
 const pit=polygon(pts,.15,soil,root,-3.25);pit.userData.pit=true;
 const earth=polygon(pts,3.35,soil,root,-3.15);
 for(let e=0;e<pts.length;e++){const a=pts[e],b=pts[(e+1)%pts.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]);const m=box((a[0]+b[0])/2,(a[1]+b[1])/2,len,.25,3.3,soil,root,-3.2);m.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);}
 grid.forEach(([x,z],k)=>{const t=k/grid.length*.06;add(box(x,z,2.2,2.2,.55,concrete,root,-2.9),.055+t,.085+t,'pour');for(let a=0;a<4;a++){const r=box(x+(a%2-.5)*.38,z+(Math.floor(a/2)-.5)*.38,.045,.045,2.9,steel,root,-2.5);add(r,.1+t,.125+t,'place');}add(box(x,z,.65,.65,2.5,concrete,root,-2.35),.13+t,.16+t,'pour');});
 add(polygon(pts,.35,concrete,root,.15),.205,.24,'pour');
 for(let f=0;f<s.floors;f++){
  const level=new THREE.Group();root.add(level);level.position.y=f*s.height;floors.push(level);const base=.25+f/s.floors*.35,span=.35/s.floors;
  grid.forEach(([x,z],k)=>{const t=k/grid.length*span*.18;add(box(x,z,.6,.6,s.height-.32,concrete,level,.5),base+t,base+t+span*.3,'pour');});
  grid.forEach(([x,z],k)=>{const right=grid.filter(p=>Math.abs(p[1]-z)<.1&&p[0]>x+.1).sort((a,b)=>a[0]-b[0])[0],next=grid.filter(p=>Math.abs(p[0]-x)<.1&&p[1]>z+.1).sort((a,b)=>a[1]-b[1])[0];for(const p of[right,next]){if(!p)continue;const dx=p[0]-x,dz=p[1]-z;if(Math.hypot(dx,dz)>6.1||!inside(x+dx/2,z+dz/2))continue;const m=box(x+dx/2,z+dz/2,dx||.4,dz||.4,.6,concrete,level,s.height-.45);add(m,base+span*.34+k/grid.length*span*.14,base+span*.68,'pour');}});
  const ceiling=add(polygon(pts,.25,concrete,level,s.height+.12),base+span*.7,base+span*.98,'pour');ceilings.push({mesh:ceiling,y:ceiling.position.y});
  const timber=new THREE.MeshStandardMaterial({color:0x9e805a,roughness:.9});
  const form=polygon(pts,.09,timber,level,s.height+.02);form.userData.temporary=[base+span*.28,Math.min(.62,base+span*1.22)];
  for(const [x,z] of grid){const prop=box(x+1,z+1,.085,.085,s.height-.1,steel,level,.2);prop.userData.temporary=[base+span*.28,Math.min(.62,base+span*1.22)];}
  for(let e=0;e<pts.length;e++){
   const a=pts[e],b=pts[(e+1)%pts.length],length=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(length/3.2),w=length/n,angle=-Math.atan2(b[1]-a[1],b[0]-a[0]);
   for(let k=0;k<n;k++){
    const t=(k+.5)/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,start=.625+f/s.floors*.075+(e/pts.length+k/n/pts.length)*.045;
    for(const [h,y,width] of [[1.1,.5,w],[s.height-3.1,3.2,w],[1.6,1.6,Math.max(.3,w-2.1)]]){const m=box(x,z,width,.32,Math.max(.15,h),wall,level,y);m.rotation.y=angle;if(y===1.6){const offset=(w-width)/2;m.position.x+=Math.cos(angle)*offset;m.position.z-=Math.sin(angle)*offset;}add(m,start,start+.025,'place');m.userData.envelope=true;m.userData.shell=true;}
    const win=box(x-Math.cos(angle)*(w-2.1)/2,z+Math.sin(angle)*(w-2.1)/2,2.05,.12,1.55,glass,level,1.63);win.rotation.y=angle;win.userData.shell=true;
    const lit=((k*7+e*13+f*5+i*3)%10)<7;const roomMat=new THREE.MeshStandardMaterial({color:lit?0xc6bd9f:0x424c50,roughness:.7,emissive:lit?0xffcf89:0x6482a3,emissiveIntensity:0});roomMaterials.push({material:roomMat,lit});win.material=glass.clone();win.material.emissive.setHex(lit?0xffc77a:0x4a6385);roomMaterials.push({material:win.material,lit,gain:.75});
    const inward=new THREE.Vector2(-(b[1]-a[1]),b[0]-a[0]).normalize();const centerX=(minX+maxX)/2,centerZ=(minZ+maxZ)/2;if(inward.x*(centerX-x)+inward.y*(centerZ-z)<0)inward.negate();
    const room=box(win.position.x+inward.x*.22,win.position.z+inward.y*.22,1.94,.1,1.43,roomMat,level,1.68);room.rotation.y=angle;room.userData.shell=true;add(room,.765+f/s.floors*.04+k/n*.025,.805+f/s.floors*.04+k/n*.025,'place');
    add(win,.765+f/s.floors*.04+k/n*.025,.805+f/s.floors*.04+k/n*.025,'place');
    for(const off of [-1.03,1.03]){const frame=box(win.position.x+Math.cos(angle)*off,win.position.z-Math.sin(angle)*off,.055,.17,1.65,steel,level,1.6);frame.rotation.y=angle;frame.userData.shell=true;add(frame,.765+f/s.floors*.04+k/n*.025,.805+f/s.floors*.04+k/n*.025);}
   }
  }
 }
 for(let f=0;f<Math.min(2,s.floors);f++){const light=new THREE.PointLight(0xffd6a3,0,14,2);light.position.set((minX+maxX)/2,2.8,(minZ+maxZ)/2);floors[f].add(light);interiorLights.push(light);}
 const top=polygon(pts,.16,roof,floors.at(-1),s.height+.39);ceilings.push({mesh:top,y:top.position.y});add(top,.86,.89,'place');
 // Parapets and rooftop equipment are installed after the waterproof roof finish.
 for(let e=0;e<pts.length;e++){const a=pts[e],b=pts[(e+1)%pts.length],len=Math.hypot(a[0]-b[0],a[1]-b[1]);const m=box((a[0]+b[0])/2,(a[1]+b[1])/2,len,.22,.65,wall,floors.at(-1),s.height+.5);m.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);m.userData.envelope=true;add(m,.865,.905);}
 for(let k=0;k<3;k++)if(inside(minX+4+k*4,minZ+4))add(box(minX+4+k*4,minZ+4,2.5,2,1.1,steel,floors.at(-1),s.height+.6),.89+k*.005,.92+k*.005);
 return {group:root,floors,tasks,setCut(f){if(f===null)return;floors.forEach((l,k)=>{l.visible=k<=f;if(k===f)for(const t of tasks){if(t.mesh.parent===l&&(t.mesh.userData.shell||t.y>=s.height-.5))t.mesh.visible=false;}});},setNight(value){night=value;roomMaterials.forEach(o=>o.material.emissiveIntensity=value?(o.lit?(o.gain||2.8):.025):0);interiorLights.forEach(l=>l.intensity=value?75:0);},update(p,explode){interiorLights.forEach(l=>l.intensity=night&&p>.82?75:0);earth.scale.z=Math.max(.001,p<.055?1-p/.055:clamp((p-.18)/.025,0,1)*.91);earth.visible=p<.055||p>.18;for(const t of tasks){const q=clamp((p-t.start)/(t.end-t.start),0,1),ease=q*q*(3-2*q);t.mesh.visible=q>0;if(t.kind==='pour'){if(t.mesh.geometry.type==='BoxGeometry'){t.mesh.scale.y=Math.max(.001,ease);t.mesh.position.y=t.y-(1-ease)*t.mesh.geometry.parameters.height/2;}else{t.mesh.scale.z=Math.max(.001,ease);}}else{t.mesh.position.y=t.y+(1-ease)*3.5;}}for(const t of tasks)if(floors.includes(t.mesh.parent)&&t.y>=s.height+.38)t.mesh.position.y+=explode*2.8;floors.forEach((l,f)=>{l.visible=true;l.position.y=f*s.height+f*explode*10;});ceilings.forEach(o=>o.mesh.position.y=o.y+explode*2.8);root.traverse(m=>{const t=m.userData.temporary;if(t)m.visible=p>=t[0]&&p<t[1];});},select(active){root.traverse(m=>{if(m.userData.envelope)m.material=active?materials.highlight:wall;});}};
}

