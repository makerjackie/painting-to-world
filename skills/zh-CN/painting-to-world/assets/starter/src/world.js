/* The imagined Place du Forum. Dimensions are artistic, not a survey of Arles. */
function makeWorld(){
 const w=new World();
 const C={gold:'#dcb63e',lit:'#ebce5e',ochre:'#b98c36',blue:'#386c84',deep:'#214658',teal:'#254e4e',trim:'#467b80',iron:'#253f40',wood:'#a67537',cream:'#c9d4b4',roof:'#365962'};
 const p=(x,y,z)=>[x,y,z];
 // Enclosing hand-painted sky sphere, with a full 360° texture.
 for(let j=0;j<32;j++)for(let i=0;i<64;i++){let a=i/64*Math.PI*2,b=j/32*Math.PI,aa=(i+1)/64*Math.PI*2,bb=(j+1)/32*Math.PI;let pt=(t,h)=>[Math.cos(t)*Math.sin(h)*180,Math.cos(h)*180,Math.sin(t)*Math.sin(h)*180];w.sky.quad(pt(a,b),pt(aa,b),pt(aa,bb),pt(a,bb),'#ffffff',1,0,1,[[i/64,1-j/32],[(i+1)/64,1-j/32],[(i+1)/64,1-(j+1)/32],[i/64,1-(j+1)/32]]);}
 w.box([0,-.19,-26],[112,.28,135],'#416368');
 w.box([-3.7,.065,-6.7],[5.5,.21,22.9],'#a88142');
 // Uneven individual stones: warm near the terrace, cobalt and jade farther away.
 function cobble(x,z,sx,sz,color){let y=.009+range(-.015,.019),a=range(-.1,.1),r=range(.065,.12),poly=[[-sx/2+r,-sz/2],[sx/2-r,-sz/2],[sx/2,-sz/2+r],[sx/2,sz/2-r],[sx/2-r,sz/2],[-sx/2+r,sz/2],[-sx/2,sz/2-r],[-sx/2,-sz/2+r]];
  let q=poly.map(v=>w.transform([v[0]+range(-.022,.022),y+.024+range(-.006,.006),v[1]+range(-.012,.012)],[x,0,z],a)),b=poly.map(v=>w.transform([v[0]*1.04,y-.010,v[1]*1.04],[x,0,z],a));let uv=poly.map(v=>[v[0]/sx+.5,v[1]/sz+.5]);
  for(let i=0;i<8;i++){let j=(i+1)%8;w.solid.tri([x,y+.031,z],q[j],q[i],color,[[.5,.5],uv[j],uv[i]]);w.solid.quad(b[i],b[j],q[j],q[i],tint(color,.78));}
 }
 let stones=0;
 const cool=['#617d89','#7e9291','#3a666f','#53788b','#928e67','#ad975f','#384e61','#739690','#416272','#c0ab71'];
 const warm=['#b89748','#cdb16a','#ae9d61','#70878a','#d6ba65','#7e8665','#a38d4b','#516c71'];
 for(let z=17,row=0;z>-74;z-=.56,row++){let min=z>4?-17:-.5,max=z>-25?10.2:8.5;for(let x=min+(row%2)*.42;x<max;x+=.86){if(x>9.1&&z<5&&z>-22)continue;let glow=x<2.5&&z<7&&z>-22;let col=pick(glow?warm:cool);cobble(x+range(-.04,.04),z+range(-.035,.035),range(.77,.84),range(.48,.535),tint(col,range(.88,1.12)));stones++;}}
 // Terrace boards and the low lip, with directional painted grain.
 for(let z=-18;z<4.7;z+=.28)w.box([-3.42,.188,z],[4.7,.024,.25],tint('#b58a40',range(.91,1.11)));
 w.box([-.94,.165,-6.6],[.14,.27,23.1],'#d2ab4f');w.box([-3.45,.16,4.88],[5.2,.24,.16],'#be9046');
 function wallWindow(x,z,y,side,col=C.teal,lit=false,size=1){let origin=[x,y,z],rot=side*Math.PI/2;const tr=q=>w.transform(q,origin,rot);const bx=(q,s,c,r=0,em=0)=>w.box(tr(q),s,c,rot+r,em);let ww=1.1*size,hh=1.75*size;
  bx([0,0,0],[ww+.28,hh+.27,.16],tint(C.trim,.83));bx([0,0,.10],[ww,hh,.08],lit?'#c4ac57':'#193e51',0,lit?.64:0);bx([0,0,.16],[.055,hh,.09],C.teal);bx([0,.12,.16],[ww,.05,.09],C.teal);
  bx([0,-hh/2-.09,.16],[ww+.45,.14,.37],tint(C.trim,1.08));bx([0,hh/2+.14,.07],[ww+.42,.16,.23],tint(C.trim,1.13));
  for(let s of [-1,1]){let off=s*(ww/2+.27),yaw=s*.12;bx([off,0,.22],[.48,hh+.08,.11],col,yaw);for(let yy=-hh/2+.12;yy<hh/2;yy+=.14)bx([off,yy,.302],[.46,.055,.09],tint(col,range(1.02,1.26)),yaw);bx([off,0,.33],[.035,hh,.035],tint(col,.7),yaw);}
 }
 // Café upper floor, pale turquoise with five shuttered bays and continuous iron rail.
 w.box([-8.52,8.0,-6.6],[6.05,6.6,23.2],'#46788b');w.box([-8.52,11.33,-6.6],[6.38,.22,23.5],'#609493');
 w.box([-8.52,4.78,-6.6],[6.2,.27,23.5],'#9aa875');
 // Patchy pigment marks on façade: geometry, not a photograph pasted onto a wall.
 for(let i=0;i<550;i++){let yy=range(5.02,11.17),zz=range(-18,4.8);w.box([-5.48,yy,zz],[.009,range(.08,.32),range(.025,.075)],pick(['#537e8c','#61858c','#3d6b82','#5c838f','#44758a']));}
 [-15.7,-11.1,-6.5,-1.9,2.9].forEach((z,i)=>{wallWindow(-5.40,z,6.22,1,'#2c5a5b',false);wallWindow(-5.40,z,9.28,1,'#2a5359',i===3);});
 // Upper balconies and curving ironwork.
 for(let z=-17.7;z<4.5;z+=.55){w.cylinder([-4.84,4.95,z],[-4.84,5.60,z],.025,.023,'#294c4d',5);}
 w.cylinder([-4.84,5.62,-18],[-4.84,5.62,4.8],.036,.036,'#244647',6);w.box([-5.02,4.95,-6.6],[1.06,.09,23.3],'#749386');
 // Lower café walls leave an actual open doorway into the invented room.
 w.box([-5.63,2.35,-8.55],[.30,4.70,19.1],C.gold);w.box([-5.63,2.35,3.93],[.30,4.70,1.56],C.gold);w.box([-5.63,4.03,2.06],[.30,1.36,2.14],C.gold);
 w.box([-8.48,2.35,4.88],[6.0,4.70,.28],'#467479');w.box([-11.40,2.35,-6.6],[.24,4.70,23.2],'#365459');w.box([-8.48,2.35,-18.10],[6.,4.70,.27],'#99823e');
 w.box([-8.42,4.67,-6.6],[6.1,.14,23.1],'#8e783d');
 // Ornament, door recesses, green wainscoting and pilasters.
 for(let z of [-16,-11.7,-7.4,-3.1]){
  w.box([-5.445,1.54,z],[.058,2.55,1.58],'#a58736');w.box([-5.403,1.64,z],[.053,2.30,1.32],'#698154');
  w.box([-5.36,1.92,z],[.053,1.32,1.13],'#c6b867',0,.18);w.box([-5.32,1.84,z],[.05,2.23,.065],'#536f4e');w.box([-5.32,1.62,z],[.05,.067,1.24],'#536f4e');
  w.box([-5.34,.71,z],[.10,.36,1.25],'#819154');w.box([-5.36,2.99,z],[.13,.15,1.76],'#e3c759');
 }
 for(let z=-17.8;z<4.9;z+=2.16){if(z>.7&&z<3.1)continue;w.box([-5.36,1.64,z],[.15,3.27,.14],'#d1a440');w.box([-5.29,3.28,z],[.24,.16,.30],'#ead076');}
 for(let i=0;i<420;i++){let zz=range(-18,4.7);if(zz>1&&zz<3.1)continue;w.box([-5.46,range(.25,4.42),zz],[.018,range(.06,.32),range(.020,.036)],pick(['#e6c34e','#c3a147','#ebce64','#a99647']));}
 w.box([-5.495,5.37,-6.6],[.065,1.36,23.2],'#d5b23e',0,.2);
 // The great ochre awning: many slightly sagged strips with real volume, scalloped valance.
 for(let j=0;j<54;j++){let z=-18+j*.424,zz=z+.429,outer=-.79,inner=-5.47;for(let s=0;s<7;s++){let t=s/7,tt=(s+1)/7;let xx=inner+(outer-inner)*t,xxx=inner+(outer-inner)*tt;let yy=6.22-2.17*t-.17*Math.sin(Math.PI*t),yyy=6.22-2.17*tt-.17*Math.sin(Math.PI*tt);let color=tint(j%4===0?'#d9b33f':'#e5bf42',range(.975,1.025));w.solid.quad([xx,yy,z],[xxx,yyy,z],[xxx,yyy,zz],[xx,yy,zz],color,.25);w.solid.quad([xx,yy-.045,zz],[xxx,yyy-.045,zz],[xxx,yyy-.045,z],[xx,yy-.045,z],tint(color,.89),.17);}
  let ybottom=3.78-.055*Math.sin(j*.7);w.solid.quad([outer,4.04,z],[outer,4.04,zz],[outer,ybottom,zz],[outer,ybottom,z],tint('#d5ad37',j%3===0?.94:1),.17);}
 w.cylinder([-.79,4.05,-18],[ -.79,4.05,4.9],.035,.035,'#b18b32',6);
 for(let z of [-17.65,-10.8,-3.8,4.45]){w.cylinder([-5.25,3.20,z],[-.8,4.01,z],.028,.028,'#7e793b',6);w.cylinder([-.89,.24,z],[-.89,4.0,z],.039,.039,'#879248',6);}
 // Curled wall brackets, warm gas lanterns and light pools.
 function lantern(x,y,z,large=false){let s=large?1.25:1;w.box([x,y,z],[.32*s,.50*s,.32*s],'#e6cc78',0,.93);w.box([x,y-.28*s,z],[.4*s,.07*s,.4*s],C.iron);w.box([x,y+.29*s,z],[.46*s,.07*s,.46*s],C.iron);w.cylinder([x,y+.31*s,z],[x,y+.54*s,z],.3*s,.035,C.iron,4);for(let a of [-1,1])for(let b of [-1,1])w.cylinder([x+a*.17*s,y-.25*s,z+b*.17*s],[x+a*.17*s,y+.25*s,z+b*.17*s],.022,.022,C.iron,5);w.sphere([x,y,z],[.10,.19,.1],'#fff1b5',8,6,1);}
 for(let z of [-14.4,-7.0,-.2]){w.cylinder([-5.32,2.82,z],[-4.63,2.82,z],.037,.037,'#778149',6);w.tube([[-5.1,2.7,z],[-4.96,2.43,z],[-4.7,2.45,z],[-4.63,2.8,z]],.025,'#9e9b4d');lantern(-4.61,2.45,z);}
 // A readable (imaginary) painted café sign at the near end.
 labelQuad(w,[-5.29,3.4,4.15],[-5.29,3.4,3.07],[-5.29,4.46,3.07],[-5.29,4.46,4.15],0,.5);
 // Roof has a real ridge and laid tile courses.
 function roof(x,z,dx,dz,y,col){let l=x-dx/2,r=x+dx/2,front=z+dz/2,back=z-dz/2;w.solid.quad([l,y,front],[l,y,back],[x,y+1.42,back],[x,y+1.42,front],col);w.solid.quad([x,y+1.42,front],[x,y+1.42,back],[r,y,back],[r,y,front],tint(col,.76));w.solid.tri([l,y,front],[x,y+1.42,front],[r,y,front],tint(col,.9));
  for(let zz=back;zz<front;zz+=.38){w.cylinder([l,y+.045,zz],[x,y+1.46,zz],.035,.035,tint(col,1.18),5);w.cylinder([x,y+1.46,zz],[r,y+.045,zz],.035,.035,tint(col,.95),5);}for(let xx=l+.5;xx<r;xx+=.62){let yy=y+1.42*(1-Math.abs(xx-x)/(dx/2));w.cylinder([xx,yy+.05,back],[xx,yy+.05,front],.022,.022,tint(col,.77),5);}}
 roof(-8.51,-6.6,6.8,23.6,11.43,'#40656c');
 for(let z of [-15.4,-1]){w.box([-9.2,12.0,z],[.85,2.0,.8],'#497078');w.box([-9.2,13.06,z],[1.06,.14,1.02],'#648784');}
 // Café furniture: bentwood chairs, marble tops, saucers, cups, bread and flowers.
 function chair(x,z,rot=0,occupied=false){const o=[x,.22,z],tr=q=>w.transform(q,o,rot);w.cylinder(tr([0,.47,0]),tr([0,.52,0]),.25,.26,'#aa8546',12);w.cylinder(tr([0,.518,0]),tr([0,.525,0]),.215,.215,'#bbab6b',12);
  for(let a of [-1,1])for(let b of [-1,1])w.cylinder(tr([a*.22,0,b*.24]),tr([a*.17,.51,b*.16]),.025,.028,C.wood,6);
  let curve=[];for(let i=0;i<=18;i++){let a=Math.PI*i/18;curve.push(tr([Math.cos(a)*.28,.71+Math.sin(a)*.46,-.23]));}w.tube(curve,.027,'#ae8a48',6);w.cylinder(tr([-.28,.51,-.23]),tr([-.28,.71,-.23]),.029,.028,C.wood,6);w.cylinder(tr([.28,.51,-.23]),tr([.28,.71,-.23]),.029,.028,C.wood,6);
  let inner=[];for(let i=0;i<=12;i++){let a=Math.PI*i/12;inner.push(tr([Math.cos(a)*.18,.68+Math.sin(a)*.31,-.237]));}w.tube(inner,.017,'#927b40',5);w.ellipse([x,.205,z],.37,.31,'#463e32',.18);}
 function cup(x,y,z){w.cylinder([x,y,z],[x,y+.022,z],.14,.14,'#d5dbb4',12);w.cylinder([x,y+.026,z],[x,y+.15,z],.068,.088,'#e1d9af',12);w.cylinder([x,y+.153,z],[x,y+.155,z],.067,.068,'#513f26',12);let arc=[];for(let i=0;i<12;i++){let a=-Math.PI*.7+i/11*Math.PI*1.4;arc.push([x+.081+Math.cos(a)*.046,y+.09+Math.sin(a)*.048,z]);}w.tube(arc,.012,'#d8d8ac',5);}
 const tables=[];
 function table(x,z,rad=.55,props=true){let y=1.00;w.cylinder([x,.23,z],[x,.96,z],.055,.045,'#4c5440',8);for(let a=0;a<3;a++){let ang=a*Math.PI*2/3;w.tube([[x,.45,z],[x+Math.cos(ang)*.21,.23,z+Math.sin(ang)*.21],[x+Math.cos(ang)*.39,.23,z+Math.sin(ang)*.39]],.025,'#4b5546',6);}
  w.cylinder([x,y-.043,z],[x,y,z],rad,rad,'#77978b',24);w.cylinder([x,y+.003,z],[x,y+.018,z],rad*.963,rad*.963,'#c5d1b4',24);w.ellipse([x,.211,z],rad*.86,rad*.70,'#344d47',.2);tables.push({x,z,rad});
  if(props){cup(x+.13,y+.024,z+.08);w.box([x-.19,y+.025,z-.04],[.16,.009,.25],'#dfd0a5',.32);w.cylinder([x-.21,y+.03,z-.18],[x-.21,y+.20,z-.18],.055,.044,'#779883',9);w.tube([[x-.21,y+.19,z-.18],[x-.20,y+.38,z-.17]],.009,'#718449',5);for(let j=0;j<5;j++){let a=j/5*6.28;w.sphere([x-.2+Math.cos(a)*.028,y+.38,z-.17+Math.sin(a)*.03],[.035,.026,.032],j%2?'#e7bd52':'#eed283',6,4);} }
 }
 const layout=[[-2.53,3.58],[-4.05,1.40],[-2.57,-1.2],[-4.02,-3.85],[-2.65,-6.25],[-4.0,-8.9],[-2.56,-11.2],[-4.02,-13.6],[-2.7,-16.0]];
 layout.forEach(([x,z],i)=>{table(x,z,i===0?.61:.53,i%3!==2);chair(x,z+.89,Math.PI,i>4);chair(x+.76,z-.32,-Math.PI/2,i%3===1);if(i>1)chair(x-.63,z-.48,.45,i%2===0);});
 // One small table at the terrace's edge, with a steaming cup to sit beside.
 table(-.16,4.1,.53,true);chair(.63,4.10,-Math.PI/2);chair(-.2,5.03,Math.PI);
 // Thin animated steam ribbons. Transparency is subtle; never a solid white plume.
 for(let k=0;k<3;k++){let xx=-.03+k*.014,zz=4.18+k*.012;for(let j=0;j<10;j++){let yy=1.18+j*.05,xx0=xx+Math.sin(j*.65+k)*.02,xx1=xx+Math.sin((j+1)*.65+k)*.02;w.alpha.quad([xx0-.012,yy,zz],[xx0+.012,yy,zz],[xx1+.014,yy+.05,zz],[xx1-.014,yy+.05,zz],'#e5dbb7',.7,4,(1-j/10)*.16);}}
 // Modest figure sculpture: painted shapes, not photorealistic faces.
 function person(x,z,rot=0,coat='#354e53',seated=false,apron=false,skirt=false){let base=seated?.28:0;const tr=q=>w.transform(q,[x,base,z],rot);let hip=seated?.62:.87,should=seated?1.09:1.39,head=seated?1.42:1.72;
  const sph=(q,s,c)=>w.sphere(tr(q),s,c,10,6);const limb=(a,b,r1,r2,c)=>w.cylinder(tr(a),tr(b),r1,r2,c,8);
  w.ellipse([x,.214,z],.33,.24,'#233e3f',.2);
  if(skirt&&!seated){w.cylinder(tr([0,.24,0]),tr([0,1.1,0]),.29,.14,coat,10);}
  else for(let s of [-1,1]){let knees=[s*.105,seated?.45:.49,seated?.31:.015],foot=[s*.115,.23,seated?.31:.045];limb([s*.10,hip,0],knees,.083,.07,tint(coat,.70));limb(knees,foot,.072,.043,tint(coat,.75));sph([foot[0],.22,foot[2]+.068],[.067,.056,.135],'#2e3c3d');}
  sph([0,(hip+should)/2,0],[.215,(should-hip)/2+.07,.132],coat);sph([0,should-.03,0],[.247,.102,.134],coat);
  limb([0,should+.09,0],[0,head-.16,0],.054,.060,'#b6a478');sph([0,head,.015],[.114,.162,.104],'#bea878');sph([0,head+.073,-.025],[.119,.108,.106],'#39443c');sph([0,head-.001,.111],[.023,.039,.027],'#c8ae7c');
  let handY=seated?.92:apron?1.14:.93;for(let s of [-1,1]){let elbow=[s*.26,should-.28,.025],hand=[s*(apron?.30:.17),handY,apron?.24:.15];limb([s*.19,should-.06,0],elbow,.065,.052,coat);limb(elbow,hand,.052,.032,coat);sph(hand,[.043,.067,.04],'#b7a475');}
  if(apron){w.box(tr([0,1.10,.131]),[.31,.69,.029],'#d8daba',rot);w.box(tr([0,1.44,.136]),[.105,.19,.028],'#e6dfb9',rot);w.cylinder(tr([.29,1.19,.23]),tr([.29,1.22,.23]),.20,.20,'#85968a',12);}
 }
 person(-2.15,-8.16,.32,'#c2cbb5',false,true);
 person(-2.05,-5.65,Math.PI,'#3f5b58',true);person(-3.90,-3.0,Math.PI,'#6b5c48',true);person(-3.55,-9.52,-.25,'#284651',true);person(-2.75,-12.02,.2,'#314952',true);person(-3.80,-14.50,.25,'#776b41',true);person(-3.42,-15.90,-1.3,'#8f8252',true);
 person(3.35,-11.2,2.3,'#768560',false,false,true);person(4.08,-11.40,2.3,'#324e57');person(1.58,-15.4,-.2,'#9f8b4d');person(5.47,-25.4,.5,'#796c56',false,false,true);person(1.1,-31,-.4,'#465a55');person(6.3,-43,1.1,'#6f6b4f');
 // Interior: clearly an imagined extension, accessible through the actual doorway at z≈2.
 w.box([-8.40,.17,.40],[5.8,.1,8.7],'#746b45');w.box([-8.4,2.3,-4.02],[5.8,4.6,.17],'#8c8148');w.box([-10.43,.77,.02],[1.20,1.12,6.6],'#496450');w.box([-10.43,1.35,.02],[1.45,.11,6.9],'#ada366');
 for(let zz=-2.8;zz<3;zz+=1.1){cup(-10.08,1.41,zz);w.cylinder([-10.73,1.4,zz],[-10.73,1.74,zz],.085,.066,'#517b65',10);}
 for(let yy of [2.0,2.72]){w.box([-11.19,yy,.18],[.41,.13,6.35],'#686b45');for(let zz=-2.7;zz<3.1;zz+=.56)w.cylinder([-11.09,yy+.05,zz],[-11.09,yy+range(.24,.50),zz],.072,.055,pick(['#496d54','#849d6e','#50746c','#8c9665']),8);}
 lantern(-8.37,3.1,.32);w.cylinder([-8.37,3.44,.32],[-8.37,4.6,.32],.023,.023,C.iron,6);
 labelQuad(w,[-9.70,1.62,-3.913],[-8.5,1.62,-3.913],[-8.5,2.82,-3.913],[-9.70,2.82,-3.913],2,.4);
 labelQuad(w,[-7.5,1.64,-3.911],[-6.28,1.64,-3.911],[-6.28,2.86,-3.911],[-7.5,2.86,-3.911],3,.4);
 w.box([-7.38,.69,-2.28],[1.14,.08,.84],'#a59a69');w.cylinder([-7.38,.2,-2.28],[-7.38,.68,-2.28],.065,.055,C.iron,7);chair(-7.36,-1.5,Math.PI);
 // Menu board next to the door, facing the street.
 w.box([-4.70,.80,3.62],[.15,1.08,.77],'#7c673b',.12);labelQuad(w,[-4.60,.34,4.0],[-4.60,.34,3.25],[-4.60,1.3,3.25],[-4.60,1.3,4.0],1,.22);
 // Neighbouring houses, varied heights, shutters, decorative cornices and tiled roofs.
 function house(face,z,len,height,side,color,idx){let dep=range(5.2,7.2),x=face-side*dep/2;w.box([x,height/2,z],[dep,height,len],color);w.box([x,height+.08,z],[dep+.32,.20,len+.34],tint(color,1.16));w.box([face+side*.14,3.17,z],[.28,.16,len+.14],tint(color,1.18));
  let bays=Math.max(1,Math.floor(len/2.15));for(let i=0;i<bays;i++){let zz=z-len/2+(i+.5)*len/bays;for(let yy=4.55;yy<height-1;yy+=2.63)wallWindow(face+side*.045,zz,yy,side,idx%2?'#28514e':'#365864',(idx+i+Math.floor(yy))%7===0,.83);}
  const rr=side*Math.PI/2,origin=[face+side*.07,0,z],tr=q=>w.transform(q,origin,rr);w.box(tr([0,1.3,.01]),[len*.56,2.6,.09],idx%3?'#284d50':'#928d53',rr,idx%3?0:.18);w.box(tr([0,2.6,.12]),[len*.63,.15,.21],tint(color,1.3),rr);
  for(let q=-len*.27;q<len*.28;q+=.6){w.box(tr([q,1.35,.09]),[.045,2.55,.12],'#233e42',rr);}
  w.box(tr([0,.20,.13]),[len*.62,.32,.35],tint(color,.74),rr);roof(x,z,dep+.48,len+.34,height+.18,idx%3===0?'#586856':'#315761');
  if(idx%2===0){w.box([x,height+1.8,z-.7],[.66,1.72,.72],tint(color,.88));w.box([x,height+2.70,z-.7],[.86,.12,.90],tint(color,1.1));}
  w.collider(Math.min(face,face-side*dep)-.2,Math.max(face,face-side*dep)+.2,z-len/2-.16,z+len/2+.16);
  for(let j=0;j<120;j++){let zz=range(z-len/2,z+len/2);w.box([face+side*.031,range(3.4,height-.2),zz],[.008,range(.06,.32),range(.018,.059)],tint(color,range(.85,1.3)));}
 }
 const homes=[ [9.5,1.8,6.7,9.2,-1,'#386c7d'],[10,-5.0,6.65,12.7,-1,'#315e71'],[9.6,-11.1,5.4,10.8,-1,'#2a5161'],[9.75,-17.2,6.75,14.1,-1,'#35586b'],[10,-24.2,6.9,11.6,-1,'#2d5765'],[9.0,-33.8,6.6,14.7,-1,'#30576b'],[8.7,-40.7,6.9,12.5,-1,'#305664'],[8.7,-47.7,6.9,14.4,-1,'#274f60'],[8.7,-55,7.4,12.4,-1,'#2d5160'],[-5.3,-22.3,7.2,9.7,1,'#466d76'],[-4.1,-29.7,7.5,11.4,1,'#426676'],[-3.5,-37.2,7.3,10.1,1,'#335967'],[-2.8,-44.3,6.5,12.5,1,'#2f5666'],[-2.5,-53.3,9.5,9.2,1,'#315765'],[-2.2,-64,10.4,10.6,1,'#345564'] ];homes.forEach((h,i)=>house(...h,i));
 // Street entrance remains an open, navigable plaza. Background buildings fill the horizon.
 [-18,-28,-38].forEach((x,i)=>{house(x,-15-i*10,11,range(8,13),1,'#315966',20+i)});
 // Small bell tower at the vanishing point.
 w.box([2.10,6.3,-63],[2.45,12.6,2.9],'#31576b');w.box([2.1,12.1,-63],[2.86,.22,3.24],'#5c7b82');w.box([2.1,13.54,-63],[2.27,2.7,2.75],'#3e6575');w.box([2.10,13.63,-61.59],[1.3,1.65,.06],'#1e4051');w.cylinder([2.1,13.3,-61.6],[2.1,14.06,-61.6],.32,.18,'#8d9168',10);w.cylinder([2.1,15.02,-63],[2.1,18.16,-63],2.03,.0,'#31546b',4);w.cylinder([2.1,18.13,-63],[2.1,18.8,-63],.036,.028,'#a8b19a',6);w.cylinder([1.87,18.54,-63],[2.34,18.54,-63],.024,.024,'#a8b19a',6);
 // Iron drain, short bollards and a quietly glowing corner shop.
 for(let z=-19;z<8;z+=3.2){w.box([7.8,.029,z],[.41,.014,.20],'#243f44');for(let j=-2;j<=2;j++)w.box([7.8+j*.065,.042,z],[.017,.007,.16],'#5a776d');}
 for(let z of [7.5,-20,-30]){w.cylinder([7.0,.04,z],[7.0,.65,z],.07,.055,'#475f53',8);w.sphere([7,.68,z],[.084,.087,.084],'#6a8065',8,5);}
 labelQuad(w,[9.39,2.94,2.46],[9.39,2.94,4.36],[9.39,3.48,4.36],[9.39,3.48,2.46],0,.17);
 // Organic tree: branching skeleton, thousands of pointed, painted leaflets.
 function tree(x,z,size=1){let yy=.15;w.cylinder([x,yy,z],[x-.15*size,4.1*size,z-.18],.21*size,.095*size,'#34584c',10);let branches=[];
  for(let i=0;i<9;i++){let ang=i/9*6.28+.4,rad=range(1.7,3.3)*size,end=[x+Math.cos(ang)*rad,range(5.3,7.0)*size,z+Math.sin(ang)*rad];w.tube([[x-.12,3.2*size,z],[x+Math.cos(ang)*rad*.5,4.9*size,z+Math.sin(ang)*rad*.5],end],.060*size,'#335a4c',7);branches.push(end);}
  let leafcolors=['#28574a','#3b6851','#426f54','#4b7552','#567853','#325d53','#7f8850','#265044'];
  for(let i=0;i<1850;i++){let ang=range(0,6.28),rr=Math.sqrt(rand())*3.6*size,xx=x+Math.cos(ang)*rr,zz=z+Math.sin(ang)*rr,yy=6.05*size+range(-1,1)*size-rr*.12;let a=range(-.6,.6)+ang*.35,len=range(.13,.48)*size,width=len*range(.22,.42),dy=range(-.06,.09),col=pick(leafcolors),center=[xx,yy,zz];let ux=Math.cos(a),uz=Math.sin(a);let A=[xx-ux*len/2,yy-dy,zz-uz*len/2],B=[xx-uz*width/2,yy+.018,zz+ux*width/2],D=[xx+uz*width/2,yy+.012,zz-ux*width/2],E=[xx+ux*len/2,yy+dy,zz+uz*len/2];w.solid.tri(A,B,E,col,undefined,0,2);w.solid.tri(A,E,D,tint(col,.81),undefined,0,2);}
 }
 tree(8.0,-2.8,1.14);tree(6.8,-28.5,.72);tree(-15,-24,1.2);tree(15,-40,1.1);
 // Pots and olive sprigs near the doorway.
 for(let [x,z,s] of [[-4.84,4.32,.48],[7.98,-20,.70],[8.1,5.5,.60],[-.5,-20,.55]]){w.cylinder([x,.19,z],[x,.64*s+.19,z],.25*s,.39*s,'#9e774b',11);w.cylinder([x,.64*s+.19,z],[x,.68*s+.19,z],.41*s,.41*s,'#b08b56',12);for(let k=0;k<18;k++){let a=k/18*6.28,rr=range(.1,.3)*s,h=range(.35,.85)*s;w.cylinder([x,.6*s+.19,z],[x+Math.cos(a)*rr,.65*s+h,z+Math.sin(a)*rr],.009,.006,'#697b43',5);w.sphere([x+Math.cos(a)*rr,.65*s+h,z+Math.sin(a)*rr],[.09*s,.14*s,.045*s],pick(['#6b864c','#9eab5d','#4e754d']),6,4);}}
 // An unobtrusive bench in the quieter alley.
 for(let z of [-26.4,-27.4]){w.box([6.55,.46,z],[1.23,.10,.20],'#789275');w.box([6.55,.20,z],[.14,.45,.18],'#344f49');}for(let i=0;i<4;i++)w.box([7.15,.77+i*.13,-26.9],[.10,.082,1.48],'#648169');
 // Very sparse motes in gaslight, not a glitter storm.
 for(let i=0;i<44;i++){let x=range(-5.2,.4),y=range(.75,4.2),z=range(-17,5),s=range(.010,.018);w.alpha.quad([x-s,y-s,z],[x+s,y-s,z],[x+s,y+s,z],[x-s,y+s,z],'#eed69a',.9,3,range(.12,.35));}
 // Collision system: café room is walkable, windows/walls are not. Furniture uses circles.
 w.collider(-11.6,-11.15,-18.5,5.1);w.collider(-11.5,-5.45,4.71,5.12);w.collider(-11.5,-5.46,-18.5,-3.91);w.collider(-5.88,-5.36,-18.1,1.02);w.collider(-5.88,-5.36,3.11,4.94);w.collider(-11.4,-9.69,-3.4,3.3);
 w.tables=tables;w.stats={stones,triangles:(w.solid.data.length+w.alpha.data.length+w.labels.data.length+w.sky.data.length)/42,opaqueVertices:w.solid.data.length/14};return w;
}
