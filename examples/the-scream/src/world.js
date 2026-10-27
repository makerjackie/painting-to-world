/* The Scream: an authored, bounded interpretation, rebuilt for this bilingual kit.
   All landmarks are actual WebGL meshes. The original artwork is not embedded. */
function makeWorld(){
 const w=new World(), r=RNG(189309), rr=(a,b)=>a+(b-a)*r(), choose=a=>a[Math.floor(r()*a.length)];
 const tau=Math.PI*2;
 // An enclosing sky only. The landscape, figure and walkway are separate geometry.
 for(let j=0;j<32;j++)for(let i=0;i<96;i++){
  const a=i/96*tau,b=j/32*Math.PI,aa=(i+1)/96*tau,bb=(j+1)/32*Math.PI;
  const pt=(t,h)=>[Math.cos(t)*Math.sin(h)*205,Math.cos(h)*205,Math.sin(t)*Math.sin(h)*205];
  w.sky.quad(pt(a,b),pt(aa,b),pt(aa,bb),pt(a,bb),'#ffffff',1,0,1,[[i/96,1-j/32],[(i+1)/96,1-j/32],[(i+1)/96,1-(j+1)/32],[i/96,1-(j+1)/32]]);
 }
 // Wood on a real raised walkway. The deck has depth and a visible underside.
 w.box([0,-.27,-25],[7.7,.44,102],'#765333');
 let planks=0;
 const timber=['#b78249','#c29861','#ceaa75','#aa6d3f','#8e6341','#d3ab74','#a88559','#a57645'];
 for(let z=-75;z<26;z+=.43){
  const col=choose(timber), y=rr(-.025,.005);
  w.box([0,y-.035,z],[7.56,.10,.405],col,rr(-.002,.002));planks++;
  for(let k=0;k<18;k++){
   let x=rr(-3.74,3.7),length=rr(.14,1.32),zz=z+rr(-.17,.17);
   w.solid.quad([x,y+.020,zz],[Math.min(3.76,x+length),y+.020,zz+.004],[Math.min(3.76,x+length),y+.020,zz+.015],[x,y+.020,zz+.012],tint(col,rr(.62,1.23)),.06);
  }
  for(let x of [-3.24,3.24])w.cylinder([x,y+.024,z],[x,y+.029,z],.024,.024,'#4a463b',6);
 }
 // Railing: posts, three continuous beams, end grain and fastenings.
 for(let z=-76;z<27;z+=2.6){
  w.box([3.72,.65,z],[.20,1.45,.21],'#795035');
  w.box([3.72,1.39,z],[.30,.09,.30],'#cda166');
  for(let yy of [.43,.88]){w.sphere([3.58,yy,z],[.015,.029,.031],'#44423a',6,4);}
  w.box([3.66,.68,z+.066],[.015,1.20,.075],'#bc8950');
 }
 for(let yy of [.37,.82,1.26]){
  w.box([3.72,yy,-25],[.20,.14,103],'#bd8b50');
  w.box([3.63,yy+.052,-25],[.035,.02,103],'#dfb370');
  w.box([3.61,yy-.026,-25],[.016,.026,103],'#775035');
 }
 // Supporting braces are visible from outside the deck.
 for(let z=-72;z<25;z+=7){w.box([3.36,-2.3,z],[.26,4.4,.26],'#564b3c');w.cylinder([3.35,-2.4,z],[2.0,-.36,z+1.1],.11,.11,'#64513b',6);}
 // A rolling landmass left of the walkway, with contours following the surface.
 function land(x,z){let u=Math.max(0,(-x-3.8)/65);return -.18+u*(1.7+4.2*Math.sin(z*.018+.8))+Math.sin(z*.065+x*.026)*u*1.0;}
 const landCols=['#343c37','#3d443a','#465044','#4e5240','#5b5943'];
 for(let j=0;j<34;j++)for(let i=0;i<32;i++){
  let x=-4-i*2.8,z=28-j*4.8,x2=x-2.8,z2=z-4.8;
  w.solid.quad([x,land(x,z),z],[x2,land(x2,z),z],[x2,land(x2,z2),z2],[x,land(x,z2),z2],landCols[(i+Math.floor(j/5))%landCols.length]);
 }
 // Pigment ribbons are anchored to the hillside, not painted over the screen.
 for(let k=0;k<140;k++){
  let xx=-4.05-k*.50,width=rr(.025,.13),col=choose(['#8a7850','#a28c54','#627064','#263e3d','#9c874f']);
  for(let j=0;j<76;j++){
   let z=27-j*1.9,z2=z-1.9;
   const tx=t=>xx+Math.sin(t*.038+k*.024)*Math.min(7,k*.075)+Math.sin(t*.11)*.19;
   let x=tx(z),x2=tx(z2);
   w.solid.quad([x,land(x,z)+.025,z],[x+width,land(x+width,z)+.028,z],[x2+width,land(x2+width,z2)+.028,z2],[x2,land(x2,z2)+.025,z2],col,.13);
  }
 }
 // Right-hand bluff falls away into the fjord.
 for(let j=0;j<46;j++){
  let z=28-j*3.7,z2=z-3.7;
  w.solid.quad([3.9,-.5,z],[8+Math.sin(z*.037)*1.6,-7.2,z],[8+Math.sin(z2*.037)*1.6,-7.2,z2],[3.9,-.5,z2],'#485141');
 }
 // Broad water surface, painted reflection marks and distant vessels.
 w.solid.quad([6,-7.25,82],[161,-7.25,82],[161,-7.25,-162],[6,-7.25,-162],'#376477',.23);
 for(let i=0;i<3600;i++){
  let x=rr(8,150),z=rr(-156,72),len=rr(.13,.77),wid=rr(.018,.055),y=-7.22;
  let col=choose(['#698a82','#83a29b','#9d965f','#beaa74','#496f78','#3e596b']);
  w.solid.quad([x,y,z],[x+len,y,z],[x+len,y,z+wid],[x,y,z+wid],col,.3);
 }
 function boat(x,z,size=1){
  w.cylinder([x-size*.58,-7.01,z],[x+size*.60,-7.01,z],.13*size,.045*size,'#1f424e',8);
  w.cylinder([x,-6.94,z],[x,-6.94+size*1.45,z],.020*size,.012*size,'#97865e',5);
  w.solid.tri([x+.034,-6.9,z],[x+.034,-6.94+size*1.38,z],[x+size*.64,-6.9,z],'#c2bd93',undefined,.18);
 }
 boat(34,-34,1.5);boat(66,-81,2.1);boat(105,-104,1.3);
 // Distant ridges are volumetric ribbons, allowing an elevated/reverse viewpoint.
 const ridges=[{z:-103,amp:15,c:'#495647'},{z:-138,amp:19,c:'#666b50'},{z:-170,amp:22,c:'#73755a'}];
 for(let l=ridges.length-1;l>=0;l--){let h=ridges[l];
  for(let i=0;i<100;i++){
   let x=-145+i*3.2,x2=x+3.2;
   const crest=a=>h.amp*(.66+.30*Math.sin(a*.051+l*2)+.20*Math.sin(a*.10+1.2))-.5;
   let y=crest(x),y2=crest(x2),depth=11+l*4;
   w.solid.quad([x,-8,h.z+9],[x,y,h.z],[x2,y2,h.z],[x2,-8,h.z+9],h.c,.18);
   w.solid.quad([x,y,h.z],[x,-7,h.z-depth],[x2,-7,h.z-depth],[x2,y2,h.z],tint(h.c,.83),.10);
  }
 }
 // A few imagined shoreline lights, not a reconstructed historical city.
 for(let i=0;i<46;i++){
  let x=10+i*2.08,z=-97+Math.sin(i*.20)*3.1,h=rr(.32,1.05);
  w.box([x,-6.0+h/2,z],[rr(.45,.90),h,.50],choose(['#9c9369','#ac9a62','#8c9273']));
  w.box([x,-5.94+h*.57,z+.263],[.15,.19,.01],'#d0b77d',0,.6);
 }
 // Sculptural central figure: sinuous dark body, actual oval head and hands.
 const fx=1.13,fz=1.1;
 function bp(y){return [fx+Math.sin(y*2.1)*.095,y,fz+Math.sin(y*1.4)*.052];}
 function radius(y){return .24+.17*Math.sin(Math.min(1,y/1.9)*Math.PI)+.02*Math.sin(y*6);}
 for(let j=0;j<28;j++)for(let i=0;i<44;i++){
  let y=.06+j*1.95/28,y2=.06+(j+1)*1.95/28,a=i/44*tau,a2=(i+1)/44*tau;
  const pt=(yy,aa)=>{let p=bp(yy),rad=radius(yy);return [p[0]+Math.cos(aa)*rad,p[1],p[2]+Math.sin(aa)*rad*.61];};
  w.solid.quad(pt(y,a),pt(y,a2),pt(y2,a2),pt(y2,a),i%7===0?'#555044':'#343a36');
 }
 for(let k=0;k<28;k++){
  let a=k/28*tau;
  for(let j=0;j<31;j++){
   let y=.08+j*1.83/31,y2=y+1.83/31;
   const pt=(yy,aa)=>{let p=bp(yy),rad=radius(yy)+.006;return [p[0]+Math.cos(aa+Math.sin(yy*3.4)*.042)*rad,p[1],p[2]+Math.sin(aa+Math.sin(yy*3.4)*.042)*rad*.615];};
   w.solid.quad(pt(y,a),pt(y,a+.014),pt(y2,a+.014),pt(y2,a),k%3?'#9f9366':'#737960',.12);
  }
 }
 w.sphere([fx,1.94,fz],[.38,.26,.23],'#47473c',22,12);
 w.cylinder([fx,1.95,fz],[fx,2.21,fz],.13,.12,'#a9a57a',14);
 w.sphere([fx,2.56,fz],[.365,.53,.285],'#c3bc89',40,30,.09);
 // Small eyes, asymmetry and an open vertical mouth preserve the painted gesture.
 w.sphere([fx-.126,2.65,fz+.245],[.045,.079,.034],'#4e6557',16,12,.1);
 w.sphere([fx+.116,2.66,fz+.247],[.041,.080,.034],'#536857',16,12,.1);
 w.sphere([fx-.123,2.655,fz+.270],[.017,.042,.010],'#273f37',10,7);
 w.sphere([fx+.12,2.665,fz+.272],[.018,.043,.010],'#2b4138',10,7);
 w.sphere([fx+.006,2.47,fz+.277],[.028,.093,.036],'#b7b286',14,10,.08);
 w.sphere([fx+.022,2.243,fz+.244],[.097,.169,.021],'#787d5e',22,15,.14);
 w.sphere([fx+.022,2.247,fz+.261],[.077,.148,.016],'#203c37',24,18,.15);
 for(let s of [-1,1]){
  const sh=[fx+s*.32,1.96,fz],el=[fx+s*.54,1.59,fz+.12],wr=[fx+s*.40,2.34,fz+.15];
  w.cylinder(sh,el,.13,.11,'#44463b',12);w.cylinder(el,wr,.11,.068,'#48483d',12);
  w.sphere([fx+s*.33,2.43,fz+.12],[.085,.255,.090],'#c4b98b',18,12,.06);
  for(let k=0;k<4;k++){
   w.cylinder([fx+s*(.33+.025*k),2.48,fz+.13],[fx+s*(.25+.024*k),2.73-k*.018,fz+.135],.018,.013,'#d0c390',8,.08);
  }
 }
 // Two remote companions with heads, hats, coats and legs—not billboard silhouettes.
 function companion(x,z,s){
  w.cylinder([x,.39,z],[x,1.38,z],.14,.21,'#2c4140',12);
  for(let k of [-1,1]){w.cylinder([x+k*.085,.73,z],[x+k*.08,.09,z+.025*k],.061,.040,'#24383a',7);w.sphere([x+k*.09,.064,z+.063],[.065,.046,.122],'#253636',8,5);}
  for(let k of [-1,1])w.cylinder([x+k*.18,1.30,z],[x+k*.22,.70,z],.060,.035,'#33433e',8);
  w.sphere([x,1.60,z],[.11,.14,.10],'#a29a72',14,8);
  w.cylinder([x,1.68,z],[x,1.76,z],.15,.105,'#273b39',10);
 }
 companion(-.75,-38,1);companion(.15,-40,1);
 w.figure={x:fx,z:fz,r:.67};
 w.stats={planks,triangles:(w.solid.data.length+w.alpha.data.length+w.sky.data.length+w.labels.data.length)/42,opaqueVertices:w.solid.data.length/14,interpretation:'Authored 3D reconstruction; no original painting bitmap'};
 return w;
}
