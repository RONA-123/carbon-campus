import * as THREE from 'three';
// Seamless, seeded microdetail maps; colour uses sRGB while height/roughness remain linear.
export function surface(color,kind='concrete'){
 const n=256,c=document.createElement('canvas'),r=document.createElement('canvas'),h=document.createElement('canvas');for(const a of[c,r,h])a.width=a.height=n;
 const ctx=c.getContext('2d'),rc=r.getContext('2d'),hc=h.getContext('2d'),image=ctx.createImageData(n,n),rough=rc.createImageData(n,n),height=hc.createImageData(n,n);let seed=81;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=(y*n+x)*4,v=rand(),joint=kind==='paving'&&(x%64<2||y%64<2),pore=v>.985;let b=kind==='asphalt'?95+v*100:kind==='soil'?120+v*90:205+v*40;if(joint)b=120;if(pore)b-=35;image.data.set([b,b,b,255],i);const rv=kind==='metal'?125:kind==='asphalt'?235:205;rough.data.set([rv,rv,rv,255],i);const hv=joint?65:pore?85:120+v*35;height.data.set([hv,hv,hv,255],i);}ctx.putImageData(image,0,0);if(kind==='grass'){for(let k=0;k<22000;k++){const x=rand()*n,y=rand()*n;ctx.strokeStyle=rand()>.5?'rgba(110,139,64,.32)':'rgba(24,56,20,.24)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(rand()-.5)*2,y-1-rand()*3);ctx.stroke();}}rc.putImageData(rough,0,0);hc.putImageData(height,0,0);
 const tex=(canvas,srgb=false)=>{const t=new THREE.CanvasTexture(canvas);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,1);t.anisotropy=8;if(srgb)t.colorSpace=THREE.SRGBColorSpace;return t;};
 return new THREE.MeshStandardMaterial({color,map:tex(c,true),roughnessMap:tex(r),bumpMap:tex(h),bumpScale:kind==='soil'?.1:kind==='asphalt'?.025:.012,roughness:1,metalness:kind==='metal'?.75:0});
}

