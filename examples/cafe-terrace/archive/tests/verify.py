"""Real Chromium/WebGL2 smoke tests. No application packages required.
Test dependency only: Python Playwright + Chromium; on this Linux runner use xvfb-run.
Usage: xvfb-run -a python tests/verify.py desktop|mobile|tour|fallback
The runner embeds index.html with set_content because URL navigation is blocked here.
"""
from pathlib import Path
import sys,json,time,math,base64
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];CASE=sys.argv[1] if len(sys.argv)>1 else 'desktop'
results=[];errors=[];requests=[]
def check(name, condition, detail=None):
 results.append({'name':name,'pass':bool(condition),'detail':detail})
 print(('PASS ' if condition else 'FAIL ')+name, flush=True)
 if not condition: print(detail,flush=True)
def state(pg): return pg.evaluate('cafeWorld.getState()')
def frames(pg,n=3):
 f=state(pg)['frame'];pg.wait_for_function('(f)=>cafeWorld.getState().frame>=f+3',arg=f,timeout=12000)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
 opts={'viewport':{'width':1100,'height':760},'device_scale_factor':1,'accept_downloads':True}
 if CASE=='mobile': opts.update(viewport={'width':360,'height':800},is_mobile=True,has_touch=True)
 if CASE=='tour': opts.update(viewport={'width':640,'height':480})
 if CASE=='fallback':opts.update(viewport={'width':900,'height':700})
 pg=b.new_page(**opts);pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('request',lambda r:requests.append(r.url))
 pg.route('**/*',lambda r:r.abort())
 html=(ROOT/'index.html').read_text()
 if CASE=='fallback':
  stub="<script>const __getContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){return t==='webgl2'?null:__getContext.call(this,t,...a)};</script>"
  html=html.replace('<body>','<body>'+stub)
 pg.set_content(html,wait_until='load')
 if CASE=='fallback':
  pg.wait_for_selector('#error',state='visible');check('WebGL unavailable produces a visible explanation',pg.locator('#errorDetail').inner_text()=='WEBGL2_UNAVAILABLE')
  check('No fake scene after renderer failure',pg.evaluate('!window.cafeWorld'))
  pg.screenshot(path=str(ROOT/'qa/15-webgl-fallback.png'))
 else:
  pg.wait_for_function('window.cafeWorld?.ready',timeout=25000);pg.wait_for_timeout(1100)
  check('WebGL2 boot and all shaders compile',state(pg)['drawCalls']==5,state(pg))
  check('WebGL error flag is zero',pg.evaluate('cafeWorld.glError()')==0)
  check('No audio autoplay before interaction',not state(pg)['audioOn'] and state(pg)['audioNotes']==0)
  if CASE=='desktop':
   pg.screenshot(path=str(ROOT/'qa/08-desktop-final.png'))
   check('Real 3D geometry is populated',state(pg)['stats']['triangles']>100000,state(pg)['stats'])
   check('Hero shown and hidden exploration controls inert',pg.evaluate('!document.querySelector(".hero").inert && document.querySelector(".explore-ui").inert'))
   pg.locator('#freeEnter').click();pg.wait_for_timeout(900);frames(pg)
   check('Free entry does not force a tour',state(pg)['mode']=='free')
   check('Hero no longer takes keyboard focus',pg.evaluate('document.querySelector(".hero").inert'))
   check('Audio starts only after entry click',state(pg)['audioOn'] and state(pg)['audioState']=='running',state(pg))
   check('Score schedules actual notes',state(pg)['audioNotes']>=2,state(pg)['audioNotes'])
   pg.locator('#soundButton').click();check('Music mute works',not state(pg)['audioOn'])
   pg.evaluate('cafeWorld.setPose([3,1.72,10],[3,1.72,-10])');before=state(pg)['eye'];pg.keyboard.down('w');frames(pg);pg.keyboard.up('w');after=state(pg)['eye'];check('WASD moves camera in world space',after[2]<before[2]-.1,{'before':before,'after':after})
   before=state(pg)['yaw'];pg.mouse.move(650,300);pg.mouse.down();pg.mouse.move(750,330,steps=4);pg.mouse.up();frames(pg);check('Dragging changes view direction',abs(state(pg)['yaw']-before)>.1)
   pg.keyboard.press('f');check('F toggles flight',state(pg)['fly']);before=state(pg)['eye'][1];pg.keyboard.down('e');frames(pg);pg.keyboard.up('e');check('E raises flight height',state(pg)['eye'][1]>before+.1)
   pg.keyboard.press('f');check('Walking returns to eye level',not state(pg)['fly'] and abs(state(pg)['eye'][1]-1.72)<.01)
   check('Wall is not walkable',not pg.evaluate('cafeWorld.canWalk(-5.6,-8)'))
   check('Actual café doorway is walkable',pg.evaluate('cafeWorld.canWalk(-5.6,2.05)'))
   check('Table collision is active',not pg.evaluate('cafeWorld.canWalk(-.16,4.1)'))
   check('Empty street is walkable',pg.evaluate('cafeWorld.canWalk(3,10)'))
   for i in range(6):
    pg.evaluate('(id)=>cafeWorld.jump(id)',i);frames(pg)
    check('Destination '+str(i+1),state(pg)['selected']==i and all(math.isfinite(x) for x in state(pg)['eye']))
    if i in (1,2,4,5):
     pg.wait_for_timeout(800);pg.screenshot(path=str(ROOT/f'qa/place-{i+1:02d}.png'))
   check('All six destinations tracked',len(state(pg)['visits'])==6)
   pg.keyboard.press('h');check('Hide interface works',pg.evaluate('document.body.classList.contains("hidden-ui")'))
   pg.keyboard.press('h');check('Restore interface works',not pg.evaluate('document.body.classList.contains("hidden-ui")'))
   pg.locator('#languageButton').click();check('Language switches to English',state(pg)['lang']=='en' and pg.locator('#aboutButton').inner_text()=='The painting')
   pg.locator('#aboutButton').click();check('Painting provenance dialog opens',pg.evaluate('document.querySelector("#aboutDialog").open'))
   check('Imaginative extension is disclosed','not a historical survey' in pg.locator('#aboutDialog').inner_text())
   pg.locator('#aboutDialog [data-close]').click()
   pg.locator('#settingsButton').click();pg.locator('#qualityLow').click();check('Light render reduces resolution',state(pg)['canvas']==[770,532],state(pg)['canvas'])
   pg.locator('#motionOff').click();check('Reduced motion can be enabled',state(pg)['reduced']);pg.locator('#settingsDialog [data-close]').click()
   pg.locator('#tourButton').click();check('Reduced-motion mode does not start automatic tour',state(pg)['mode']=='free')
   pg.locator('#settingsButton').click();pg.locator('#qualityHigh').click();pg.locator('#motionOn').click();pg.locator('#settingsDialog [data-close]').click();pg.evaluate('cafeWorld.jump(0)');frames(pg)
   # The download is generated on user click, not substituted with a static screenshot.
   with pg.expect_download(timeout=15000) as download:
    pg.locator('#captureButton').click()
   dl=download.value;dl.save_as(str(ROOT/'qa/09-exported-postcard.png'))
   from PIL import Image
   im=Image.open(ROOT/'qa/09-exported-postcard.png');check('Postcard exports a real PNG with border',im.width>1100 and im.height>760,{'size':im.size,'bytes':(ROOT/'qa/09-exported-postcard.png').stat().st_size})
   pg.evaluate('cafeWorld.home()');check('Home returns to landing',state(pg)['mode']=='landing');check('No GL error after interaction',pg.evaluate('cafeWorld.glError()')==0)
  elif CASE=='mobile':
   pg.screenshot(path=str(ROOT/'qa/10-mobile-360.png'))
   check('Mobile page does not overflow horizontally',pg.evaluate('document.documentElement.scrollWidth===innerWidth'))
   for language in ('zh','en'):
    pg.evaluate('(l)=>cafeWorld.setLanguage(l)',language)
    rect=pg.evaluate('({b:document.querySelector(".brand").getBoundingClientRect().toJSON(),n:document.querySelector(".top-tools").getBoundingClientRect().toJSON(),w:innerWidth})')
    check(language+' header fits 360px without overlap',rect['b']['right']<=rect['n']['left'] and rect['n']['right']<=rect['w'],rect)
   pg.screenshot(path=str(ROOT/'qa/11-mobile-360-en.png'))
   pg.evaluate('cafeWorld.setLanguage("zh")');pg.locator('#freeEnter').tap();pg.wait_for_timeout(900)
   check('Touch joystick visible after entry',pg.locator('#joystick').is_visible())
   pg.locator('#soundButton').tap();pg.evaluate('cafeWorld.setPose([3,1.72,10],[3,1.72,-10])');before=state(pg)['eye'];bb=pg.locator('#joystick').bounding_box();x=bb['x']+48;y=bb['y']+48
   # Browser-dispatched pointer path, then enough actual animation frames for movement.
   pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(x,y-28);frames(pg);pg.mouse.up();after=state(pg)['eye'];check('Touch joystick movement path works',after[2]<before[2]-.08,{'before':before,'after':after})
   pg.locator('#flyButton').tap();check('Touch flight toggle works',state(pg)['fly']);check('Vertical flight controls visible',pg.locator('#upButton').is_visible())
   bb=pg.locator('#upButton').bounding_box();pg.mouse.move(bb['x']+15,bb['y']+15);before=state(pg)['eye'][1];pg.mouse.down();frames(pg);pg.mouse.up();check('Mobile rise button changes altitude',state(pg)['eye'][1]>before+.08)
   pg.locator('[data-spot="5"]').scroll_into_view_if_needed();pg.locator('[data-spot="5"]').tap();pg.wait_for_function('cafeWorld.getState().selected===5',timeout=10000);frames(pg);check('Scrollable destination bar reaches stars',state(pg)['selected']==5)
   pg.screenshot(path=str(ROOT/'qa/12-mobile-flight.png'))
   pg.set_viewport_size({'width':800,'height':360});frames(pg);check('Landscape resize rebuilds render target',state(pg)['canvas']==[800,360]);pg.screenshot(path=str(ROOT/'qa/13-mobile-landscape.png'))
  elif CASE=='tour':
   pg.locator('#enter').click();start=time.monotonic();check('Entry starts the cinematic tour',state(pg)['mode']=='tour')
   pg.wait_for_function('cafeWorld.getState().mode==="free" && cafeWorld.getState().selected===5',timeout=42000);duration=time.monotonic()-start
   check('Full guided tour completes and hands over control',state(pg)['fly'] and 26<duration<36,{'wall_clock_seconds':round(duration,2),'state':state(pg)})
   pg.locator('#tourButton').click();check('Tour can be replayed',state(pg)['mode']=='tour');pg.keyboard.press('Escape');check('Escape interrupts tour',state(pg)['mode']=='free')
   pg.locator('#tourButton').click();pg.mouse.move(350,230);pg.mouse.down();pg.mouse.move(385,238);pg.mouse.up();check('Dragging interrupts tour',state(pg)['mode']=='free')
   pg.locator('#tourButton').click();pg.keyboard.down('w');frames(pg);pg.keyboard.up('w');check('Movement interrupts tour',state(pg)['mode']=='free')
 check('No runtime HTTP/network requests',not requests,requests)
 check('No uncaught JavaScript errors',not errors,errors)
 (ROOT/f'qa/test-{CASE}.json').write_text(json.dumps({'case':CASE,'checks':results,'errors':errors,'requests':requests},ensure_ascii=False,indent=2))
 b.close()
print('RESULT',sum(r['pass'] for r in results),'/',len(results),flush=True)
if not all(r['pass'] for r in results):sys.exit(1)
