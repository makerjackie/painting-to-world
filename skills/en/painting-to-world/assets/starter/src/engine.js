/* Small, dependency-free WebGL2 renderer. All geometry is real 3D, batched by material. */
'use strict';
const V={
 add:(a,b)=>a.map((x,i)=>x+b[i]),sub:(a,b)=>a.map((x,i)=>x-b[i]),mul:(a,s)=>a.map(x=>x*s),
 dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 norm:a=>{let d=Math.hypot(...a)||1;return a.map(x=>x/d)},mix:(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t)
};
const M={
 identity:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
 perspective:(f,a,n,z)=>{let s=1/Math.tan(f/2);return new Float32Array([s/a,0,0,0,0,s,0,0,0,0,(z+n)/(n-z),-1,0,0,2*z*n/(n-z),0])},
 look:(e,t)=>{let z=V.norm(V.sub(e,t)),x=V.norm(V.cross([0,1,0],z)),y=V.cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-V.dot(x,e),-V.dot(y,e),-V.dot(z,e),1])},
 mul:(a,b)=>{let o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
};
function RNG(seed=188809){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
const rand=RNG();const range=(a,b)=>a+(b-a)*rand(),pick=a=>a[Math.floor(rand()*a.length)];
function rgb(hex){if(Array.isArray(hex))return hex;return [(parseInt(hex.slice(1,3),16))/255,(parseInt(hex.slice(3,5),16))/255,(parseInt(hex.slice(5,7),16))/255]}
function tint(c,v){return rgb(c).map(x=>Math.min(1,Math.max(0,x*v)))}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));const ease=t=>t*t*(3-2*t);

class Batch{
 constructor(kind='paint'){this.kind=kind;this.data=[];this.count=0;}
 vert(p,n,uv,c,em=0,anim=0,alpha=1){this.data.push(...p,...n,...uv,...rgb(c),em,anim,alpha);}
 tri(a,b,c,color,uv=[[0,0],[1,0],[1,1]],em=0,anim=0,alpha=1,normals=null){let n=V.norm(V.cross(V.sub(b,a),V.sub(c,a)));[a,b,c].forEach((p,i)=>this.vert(p,normals?normals[i]:n,uv[i],color,em,anim,alpha));}
 quad(a,b,c,d,color,em=0,anim=0,alpha=1,uv=[[0,0],[1,0],[1,1],[0,1]]){this.tri(a,b,c,color,[uv[0],uv[1],uv[2]],em,anim,alpha);this.tri(a,c,d,color,[uv[0],uv[2],uv[3]],em,anim,alpha)}
 upload(gl){this.count=this.data.length/14;this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);this.vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.data),gl.STATIC_DRAW);let off=0;[3,3,2,3,3].forEach((s,i)=>{gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,s,gl.FLOAT,false,56,off*4);off+=s;});this.data=null;gl.bindVertexArray(null);}
}
class World{
 constructor(){this.solid=new Batch();this.alpha=new Batch();this.sky=new Batch('sky');this.labels=new Batch('labels');this.colliders=[];this.stats={};this.active=this.solid;}
 box(p,size,c,rot=0,em=0){let [x,y,z]=size.map(v=>v/2),vs=[[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z],[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]];
  vs=vs.map(q=>this.transform(q,p,rot));const fs=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]];fs.forEach((f,i)=>this.active.quad(...f.map(v=>vs[v]),tint(c,[.87,1,.93,.96,1.07,.7][i]),em));}
 transform(q,p,rot=0){let s=Math.sin(rot),c=Math.cos(rot);return [q[0]*c+q[2]*s+p[0],q[1]+p[1],q[2]*c-q[0]*s+p[2]];}
 cylinder(a,b,r1,r2,c,sides=9,em=0){let axis=V.norm(V.sub(b,a)),u=V.norm(V.cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])),v=V.cross(axis,u);let ring=(p,r,t)=>V.add(p,V.add(V.mul(u,Math.cos(t)*r),V.mul(v,Math.sin(t)*r)));
  for(let i=0;i<sides;i++){let t=i/sides*Math.PI*2,nt=(i+1)/sides*Math.PI*2,aa=ring(a,r1,t),ab=ring(a,r1,nt),ba=ring(b,r2,t),bb=ring(b,r2,nt);this.active.quad(aa,ab,bb,ba,tint(c,.93+.09*Math.cos(t)),em);this.active.tri(a,ab,aa,c,undefined,em);this.active.tri(b,ba,bb,c,undefined,em);}}
 sphere(p,s,c,seg=10,rings=6,em=0,anim=0){let pt=(a,b)=>[p[0]+s[0]*Math.sin(b)*Math.cos(a),p[1]+s[1]*Math.cos(b),p[2]+s[2]*Math.sin(b)*Math.sin(a)];
  for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){let a=i/seg*Math.PI*2,b=j/rings*Math.PI,aa=(i+1)/seg*Math.PI*2,bb=(j+1)/rings*Math.PI;let A=pt(a,b),B=pt(aa,b),D=pt(a,bb),C=pt(aa,bb),norm=q=>V.norm(q.map((v,k)=>(v-p[k])/(s[k]*s[k]))),col=tint(c,.97+.035*Math.sin(i*9+j*5));this.active.tri(A,B,C,col,[[0,0],[1,0],[1,1]],em,anim,1,[norm(A),norm(B),norm(C)]);this.active.tri(A,C,D,col,[[0,0],[1,1],[0,1]],em,anim,1,[norm(A),norm(C),norm(D)]);}}
 tube(points,r,c,sides=6,em=0){for(let i=0;i<points.length-1;i++)this.cylinder(points[i],points[i+1],r,r,c,sides,em)}
 ellipse(p,rx,rz,c,alpha=1,em=0){let batch=alpha<1?this.alpha:this.active;for(let i=0;i<20;i++){let a=i/20*6.283,b=(i+1)/20*6.283;batch.tri(p,[p[0]+Math.cos(a)*rx,p[1],p[2]+Math.sin(a)*rz],[p[0]+Math.cos(b)*rx,p[1],p[2]+Math.sin(b)*rz],c,undefined,em,0,alpha)}}
 collider(x0,x1,z0,z1){this.colliders.push({x0,x1,z0,z1});}
}

const sceneVS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;layout(location=1) in vec3 aNormal;layout(location=2) in vec2 aUV;layout(location=3) in vec3 aColor;layout(location=4) in vec3 aExtra;
uniform mat4 uVP;uniform float uTime;out vec3 vPos;out vec3 vNormal;out vec2 vUV;out vec3 vColor;out vec3 vExtra;
void main(){vec3 p=aPosition;if(aExtra.y>1.5&&aExtra.y<2.5){p.x+=sin(uTime*.75+p.z*.4)*.055;p.y+=sin(uTime*.9+p.x)*.035;}if(aExtra.y>2.5&&aExtra.y<3.5){p.y+=sin(uTime*.6+p.x*8.)*.22;p.x+=sin(uTime*.3+p.z)*.1;}if(aExtra.y>3.5){p.x+=sin(uTime*1.2+p.y*7.)*.05;p.y+=sin(uTime*.7+p.x)*.045;}vPos=p;vNormal=aNormal;vUV=aUV;vColor=aColor;vExtra=aExtra;gl_Position=uVP*vec4(p,1.);}`;
const sceneFS=`#version 300 es
precision highp float;in vec3 vPos;in vec3 vNormal;in vec2 vUV;in vec3 vColor;in vec3 vExtra;
uniform sampler2D uTexture;uniform vec3 uEye;uniform float uTime;uniform int uKind;out vec4 outColor;
void main(){vec4 tex=texture(uTexture,vUV);if(uKind==1){vec3 s=tex.rgb;float star=smoothstep(.67,.93,max(s.r,s.g));s+=star*.025*sin(uTime*.8+vUV.x*128.+vUV.y*99.);outColor=vec4(s,1.);return;}
vec3 col=vColor;if(uKind==2){col*=tex.rgb;}else{col*=.37+tex.rgb*.87;}
vec3 N=normalize(vNormal);float diffuse=max(dot(N,normalize(vec3(-.4,1.,.5))),0.);float fill=.75+.25*diffuse;col*=fill;
float terrace=exp(-pow((vPos.x+3.)*.26,2.))*smoothstep(-21.,-15.,vPos.z)*(1.-smoothstep(4.,10.,vPos.z));float glow=terrace*exp(-max(vPos.y-2.,0.)*.3);col=mix(col,col*vec3(1.22,1.08,.65)+vec3(.018,.01,0.),glow*.65);
col=mix(col,vColor*(uKind==2?tex.rgb:(.53+tex.rgb*.67)),vExtra.x);
float fog=1.-exp(-pow(length(vPos-uEye)*.009,1.6));fog*=1.-vExtra.x*.6;col=mix(col,vec3(.084,.148,.242),fog);
outColor=vec4(clamp(col,0.,1.),vExtra.z*(uKind==2?tex.a:1.));}`;
const postVS=`#version 300 es
precision highp float;out vec2 vUV;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUV=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const postFS=`#version 300 es
precision highp float;in vec2 vUV;uniform sampler2D uScene;uniform vec2 uSize;uniform float uPaint;uniform float uFade;out vec4 outColor;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 px=1./uSize;vec3 c=texture(uScene,vUV).rgb;vec3 sum=c;float w=1.;vec3 halo=vec3(0.);
for(int i=0;i<4;i++){float a=float(i)*1.570796;vec2 d=vec2(cos(a),sin(a));vec3 n=texture(uScene,vUV+d*px*1.1).rgb;float k=.12*exp(-length(n-c)*11.);sum+=n*k;w+=k;vec3 b=texture(uScene,vUV+d*px*6.).rgb;halo+=max(b-vec3(.77,.71,.56),vec3(0.))*.026;}
c=mix(c,sum/w,.75)+halo;vec2 q=vUV*uSize;float grain=hash(floor(q))-.5;float weave=sin(q.x*2.8)*sin(q.y*2.6);c*=1.+grain*.055*uPaint+weave*.014*uPaint;
float edge=smoothstep(.23,.85,length((vUV-.5)*vec2(1.,.85)));c*=1.-edge*.18;c=mix(c,c*vec3(1.026,1.0,.975),.45);outColor=vec4(c*(1.-uFade),1.);}`;
class Renderer{
 constructor(canvas){this.canvas=canvas;const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_UNAVAILABLE');this.gl=gl;this.sceneProgram=this.program(sceneVS,sceneFS);this.postProgram=this.program(postVS,postFS);this.paint=1;this.scale=1;this.fbo=gl.createFramebuffer();this.color=gl.createTexture();this.depth=gl.createRenderbuffer();this.textureCache=[];this.draws=0;this.errors=[];this.resize();}
 program(v,f){const g=this.gl;function compile(type,s){let x=g.createShader(type);g.shaderSource(x,s);g.compileShader(x);if(!g.getShaderParameter(x,g.COMPILE_STATUS))throw new Error(g.getShaderInfoLog(x));return x;}let p=g.createProgram();g.attachShader(p,compile(g.VERTEX_SHADER,v));g.attachShader(p,compile(g.FRAGMENT_SHADER,f));g.linkProgram(p);if(!g.getProgramParameter(p,g.LINK_STATUS))throw new Error(g.getProgramInfoLog(p));return p;}
 texture(canvas,repeat=true){const g=this.gl,t=g.createTexture();g.bindTexture(g.TEXTURE_2D,t);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,canvas);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR_MIPMAP_LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,repeat?g.REPEAT:g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,repeat?g.REPEAT:g.CLAMP_TO_EDGE);g.generateMipmap(g.TEXTURE_2D);return t;}
 resize(){const g=this.gl;let ratio=Math.min(window.devicePixelRatio||1,1.45)*this.scale,w=Math.max(1,Math.floor(innerWidth*ratio)),h=Math.max(1,Math.floor(innerHeight*ratio));this.canvas.width=w;this.canvas.height=h;g.bindTexture(g.TEXTURE_2D,this.color);g.texImage2D(g.TEXTURE_2D,0,g.RGBA8,w,h,0,g.RGBA,g.UNSIGNED_BYTE,null);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);g.bindRenderbuffer(g.RENDERBUFFER,this.depth);g.renderbufferStorage(g.RENDERBUFFER,g.DEPTH_COMPONENT24,w,h);g.bindFramebuffer(g.FRAMEBUFFER,this.fbo);g.framebufferTexture2D(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.TEXTURE_2D,this.color,0);g.framebufferRenderbuffer(g.FRAMEBUFFER,g.DEPTH_ATTACHMENT,g.RENDERBUFFER,this.depth);if(g.checkFramebufferStatus(g.FRAMEBUFFER)!==g.FRAMEBUFFER_COMPLETE)throw new Error('Framebuffer is incomplete');g.bindFramebuffer(g.FRAMEBUFFER,null);}
 init(world,paint,sky,labels){this.world=world;for(let b of [world.solid,world.alpha,world.sky,world.labels])b.upload(this.gl);this.paintTex=this.texture(paint);this.skyTex=this.texture(sky);this.labelTex=this.texture(labels,false);this.uniforms={};for(const n of ['uVP','uTime','uTexture','uEye','uKind'])this.uniforms[n]=this.gl.getUniformLocation(this.sceneProgram,n);this.postUniforms={};for(const n of ['uScene','uSize','uPaint','uFade'])this.postUniforms[n]=this.gl.getUniformLocation(this.postProgram,n);}
 render(eye,target,time,fade=0){const g=this.gl,w=this.canvas.width,h=this.canvas.height;let vp=M.mul(M.perspective((innerWidth<600?66:56)*Math.PI/180,w/h,.08,260),M.look(eye,target));g.bindFramebuffer(g.FRAMEBUFFER,this.fbo);g.viewport(0,0,w,h);g.enable(g.DEPTH_TEST);g.depthMask(true);g.disable(g.CULL_FACE);g.disable(g.BLEND);g.clearColor(.07,.13,.22,1);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);g.useProgram(this.sceneProgram);g.uniformMatrix4fv(this.uniforms.uVP,false,vp);g.uniform1f(this.uniforms.uTime,time);g.uniform3fv(this.uniforms.uEye,eye);g.uniform1i(this.uniforms.uTexture,0);g.activeTexture(g.TEXTURE0);
 const draw=(b,t,k)=>{g.bindTexture(g.TEXTURE_2D,t);g.uniform1i(this.uniforms.uKind,k);g.bindVertexArray(b.vao);g.drawArrays(g.TRIANGLES,0,b.count);};g.depthMask(false);draw(this.world.sky,this.skyTex,1);g.depthMask(true);draw(this.world.solid,this.paintTex,0);g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);draw(this.world.labels,this.labelTex,2);g.depthMask(false);draw(this.world.alpha,this.paintTex,0);g.depthMask(true);g.disable(g.BLEND);
 g.bindFramebuffer(g.FRAMEBUFFER,null);g.disable(g.DEPTH_TEST);g.bindVertexArray(null);g.useProgram(this.postProgram);g.bindTexture(g.TEXTURE_2D,this.color);g.uniform1i(this.postUniforms.uScene,0);g.uniform2f(this.postUniforms.uSize,w,h);g.uniform1f(this.postUniforms.uPaint,this.paint);g.uniform1f(this.postUniforms.uFade,fade);g.drawArrays(g.TRIANGLES,0,3);this.draws=5;this.vp=vp;}
}
