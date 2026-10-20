/* Small, dependency-free engineering line model. Coordinates are illustrative. */
(function(root){
'use strict';
function createCar(){
 const segments=[];
 const line=(a,b,layer=0,tone=0)=>segments.push({a,b,layer,tone});
 const chain=(pts,closed=false,layer=0,tone=0)=>{for(let i=1;i<pts.length;i++)line(pts[i-1],pts[i],layer,tone);if(closed)line(pts.at(-1),pts[0],layer,tone)};
 function box(cx,cy,cz,l,w,h,layer=0){const p=[];for(let z of [-1,1])for(let y of [-1,1])for(let x of [-1,1])p.push([cx+x*l/2,cy+y*w/2,cz+z*h/2]);for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j))line(p[i],p[j],layer,1)}
 function ring(cx,cy,cz,rx,ry,plane='xy',layer=0,tone=0,n=32){const p=[];for(let i=0;i<n;i++){let a=i/n*Math.PI*2;p.push(plane==='xz'?[cx+Math.cos(a)*rx,cy,cz+Math.sin(a)*ry]:[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,cz])}chain(p,true,layer,tone);return p}
 function loft(sections,layer=0){const loops=sections.map(([x,w,b,h])=>[[x,-w*.72,b],[x,-w,b+.14],[x,-w*.9,h-.1],[x,-w*.45,h],[x,w*.45,h],[x,w*.9,h-.1],[x,w,b+.14],[x,w*.72,b]]);loops.forEach(l=>chain(l,true,layer,1));for(let i=1;i<loops.length;i++)for(let j=0;j<8;j++)line(loops[i-1][j],loops[i][j],layer,j%2?0:1)}
 // Monocoque, nose and sidepods.
 loft([[-4,.4,.25,.62],[-3.3,.65,.2,.95],[-2.1,.75,.18,1.12],[-.8,.62,.18,1.13],[.3,.5,.17,1.0],[1.3,.34,.16,.62],[2.7,.18,.16,.34],[4.15,.12,.16,.27]]);
 for(let side of [-1,1]){const y=side;const p=[[-2.8,y*.68,.32],[-2.5,y*1.2,.37],[-1.5,y*1.3,.36],[.2,y*.88,.24],[.9,y*.45,.23]];chain(p);chain(p.map(v=>[v[0],v[1]*.93,v[2]+.44]));for(let i=0;i<p.length;i++)line(p[i],[p[i][0],p[i][1]*.93,p[i][2]+.44],0,1);for(let j=0;j<4;j++){let x=-2.2+j*.23;line([x,y*.9,.83],[x+.12,y*1.15,.73],0,1)}}
 // Flat floor, longitudinal strakes and front nose detail.
 chain([[-4,-1.1,.15],[-2.7,-1.4,.15],[.6,-1.05,.15],[2,-.3,.15],[2,.3,.15],[.6,1.05,.15],[-2.7,1.4,.15],[-4,1.1,.15]],true,0,1);
 for(let y of [-.8,-.4,0,.4,.8])line([-4,y,.16],[1,y*.6,.16],0,2);
 for(let y of [-.06,.06])line([1.4,y,.61],[4.12,y,.29],0,3);
 // Four tyres: wire toroids, hub rings and spokes.
 for(let x of [-3.15,2.95])for(let y of [-1.66,1.66]){const outer=.64,w=.54;for(let j=0;j<5;j++){const yy=y+(j/4-.5)*w,r=outer-(j===0||j===4?.07:0);ring(x,yy,.64,r,r,'xz',0,j%2?2:0,28)}for(let yy of [y-w/2,y+w/2]){ring(x,yy,.64,.37,.37,'xz',0,1,24);ring(x,yy,.64,.13,.13,'xz',0,1,16);for(let j=0;j<10;j++){let a=j*Math.PI/5;line([x+Math.cos(a)*.13,yy,.64+Math.sin(a)*.13],[x+Math.cos(a+.15)*.37,yy,.64+Math.sin(a+.15)*.37],0,1)}}for(let j=0;j<12;j++){let a=j*Math.PI/6;line([x+Math.cos(a)*.61,y-w/2,.64+Math.sin(a)*.61],[x+Math.cos(a+.12)*.61,y+w/2,.64+Math.sin(a+.12)*.61],0,2)}
  const sign=Math.sign(y);for(let z of [.32,.68])for(let dx of [-.45,.45])line([x+dx,sign*.42,z],[x,sign*1.43,.64],0,1);line([x-.5,sign*.3,.85],[x,sign*1.38,.7],0,0)}
 // Front multi-element wing and rear wing.
 for(let i=0;i<4;i++){let x=3.8+i*.19,z=.14+i*.035;chain([[x,-1.9,z],[x+.14,-1.9,z+.035],[x+.14,1.9,z+.035],[x,1.9,z]],true,2,1)}
 for(let side of [-1,1]){let y=side*1.9;chain([[3.65,y,.13],[4.6,y,.13],[4.6,y,.45],[3.9,y,.42]],true,2,0)}
 for(let i=0;i<3;i++){let x=-4.2+i*.22,z=1.27+i*.08;chain([[x,-1.45,z],[x+.17,-1.45,z+.04],[x+.17,1.45,z+.04],[x,1.45,z]],true,3,0)}
 for(let y of [-1.45,1.45])chain([[-4.4,y,.7],[-3.5,y,.7],[-3.5,y,1.68],[-4.4,y,1.68]],true,3,1);
 for(let y of [-.3,.3]){line([-3.7,y,.45],[-3.9,y,1.35],3,1);line([-3.65,y,.45],[-3.85,y,1.35],3,1)}
 // Engine, paired cylinder banks and exhaust plumbing.
 box(-2.2,0,1.1,1.65,.75,.52,1);
 for(let x of [-2.8,-2.4,-2,-1.6])for(let y of [-.32,.32]){const a=ring(x,y,1.48,.145,.145,'xy',1,1,16);const b=ring(x,y,1.2,.145,.145,'xy',1,2,16);for(let k=0;k<16;k+=4)line(a[k],b[k],1,1);ring(x,y,1.53,.11,.11,'xy',1,2,12);chain([[x,y*1.2,1.47],[x-.08,y*2,1.65],[x-.25,y*2.5,1.5],[-3.4,y*1.8,1.27]],false,1,1)}
 for(let y of [-.54,.54])chain([[-3.3,y,.85],[-3.45,y,1.15],[-3.8,y,1.18],[-4.1,y,1.05]],false,1,1);
 // Cockpit and halo, separate from the engine.
 ring(.05,0,1.02,.65,.38,'xy',0,0,40);ring(.05,0,1.08,.7,.42,'xy',0,1,40);
 const halo=[];for(let i=0;i<=24;i++){let a=i/24*Math.PI;halo.push([.05+Math.cos(a)*.62,Math.sin(a)*.42,1.62])}chain(halo,false,4,0);chain(halo.map(v=>[v[0],-v[1],v[2]]),false,4,0);for(let y of [-.36,.36])line([-.5,y,1.1],[-.5,y,1.62],4,1);line([.65,0,1.08],[.65,0,1.62],4,0);chain([[-.72,-.15,1.08],[-.72,-.15,1.75],[-.72,.15,1.75],[-.72,.15,1.08]],false,4,1);
 // Drafting datum underneath the assembly.
 for(let x=-5;x<=5;x+=.5)line([x,-2.5,-.05],[x,2.5,-.05],-1,2);
 for(let y=-2.5;y<=2.5;y+=.5)line([-5,y,-.05],[5,y,-.05],-1,2);
 return segments;
}
function projectPoint(v,angle,pitch,explode=0,layer=0){const c=Math.cos(angle),s=Math.sin(angle),x=v[0]*c-v[1]*s,y=v[0]*s+v[1]*c,z=v[2]+(layer>0?explode*(layer===1?1.8:layer===2?-.65:layer===3?1.05:2.7):0);return [x,y*Math.sin(pitch)-z*Math.cos(pitch),y*Math.cos(pitch)+z*Math.sin(pitch)]}
root.EngineeringDrawings={createCar,projectPoint};
})(typeof window!=='undefined'?window:globalThis);
