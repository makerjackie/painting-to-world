/* Original seeded brushwork; no downloaded textures, photographs, fonts or models. */
function surface(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];}
function makePaint(){const [c,x]=surface(512,512),r=RNG(9145);x.fillStyle='#c1c3b2';x.fillRect(0,0,512,512);
 // Broad, rounded deposits and parallel bristle ridges make pigment legible up close.
 const pigment=['#eeead1','#cbd2c1','#9eaeb0','#b3bba8','#dcd8b8','#8e9b9d','#d6d5c3'];
 for(let i=0;i<580;i++){let px=r()*512,py=r()*512,len=20+r()*95,ww=3+r()*13;
  x.save();x.translate(px,py);x.rotate(-.19+r()*.36);x.lineCap='round';x.strokeStyle=pigment[Math.floor(r()*pigment.length)];x.globalAlpha=.20+r()*.32;x.lineWidth=ww;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(-ww*.10,len*.45,ww*.28,len);x.stroke();
  for(let j=0;j<3;j++){x.lineWidth=.6+r()*.85;x.strokeStyle=j%2?'#758989':'#f6edc7';x.globalAlpha=.10+r()*.15;let a=(r()-.5)*ww;x.beginPath();x.moveTo(a,3);x.quadraticCurveTo(a+1,len*.45,a+ww*.28,len-4);x.stroke();}x.restore();}
 for(let i=0;i<2900;i++){const px=r()*512,py=r()*512,len=3+r()*24,v=Math.floor(110+r()*135);x.strokeStyle=`rgba(${v},${v-2},${v-7},${.07+r()*.20})`;x.lineWidth=.4+r()*1.2;x.beginPath();x.moveTo(px,py);x.lineTo(px+2,py+len);x.stroke();}
 let d=x.getImageData(0,0,512,512);for(let i=0;i<d.data.length;i+=4){let n=(r()-.5)*11;d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n;}x.putImageData(d,0,0);return c;}
function makeSky(){
 const [c,x]=surface(2048,1024),r=RNG(1893),g=x.createLinearGradient(0,0,0,1024);
 g.addColorStop(0,'#462f32');g.addColorStop(.14,'#96513c');g.addColorStop(.30,'#d27040');g.addColorStop(.44,'#f1ac63');g.addColorStop(.53,'#a88459');g.addColorStop(1,'#394d51');
 x.fillStyle=g;x.fillRect(0,0,2048,1024);
 const colors=['#bd502f','#e47a43','#df673b','#e39b55','#dcbc79','#904736','#eeac66','#d79650','#b4683c'];
 // Long, continuous wave bands; the horizontal period matches the sky seam.
 for(let j=0;j<62;j++){
  let base=55+j*7.2,amp=12+18*Math.sin(j*.19),phase=j*.08;x.beginPath();
  for(let k=0;k<=256;k++){let xx=k*8,y=base+Math.sin(xx/2048*Math.PI*4+phase)*amp+Math.sin(xx/2048*Math.PI*6-phase)*9;
   if(k===0)x.moveTo(xx,y);else x.lineTo(xx,y);}
  x.strokeStyle=colors[j%colors.length];x.globalAlpha=.33+r()*.24;x.lineWidth=4+r()*8;x.lineCap='round';x.stroke();
 }
 for(let i=0;i<19000;i++){
  let xx=r()*2048,y=r()*550,len=3+r()*24,phase=y*.011,slope=Math.cos(xx/2048*Math.PI*4+phase)*.15;
  x.strokeStyle=colors[Math.floor(r()*colors.length)];x.globalAlpha=.025+r()*.11;x.lineWidth=.5+r()*1.5;x.beginPath();x.moveTo(xx,y);x.lineTo(xx+len,y+len*slope);x.stroke();
 }
 x.globalAlpha=1;return c;
}
function makeLabels(){const [c,x]=surface(16,16);x.fillStyle='#d3c59e';x.fillRect(0,0,16,16);return c;}
