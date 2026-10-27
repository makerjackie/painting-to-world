"""Run from any directory. Python + Playwright + Pillow are test-only dependencies.
Use --browser PATH for a system Chromium. On headless Linux, xvfb-run may be needed for WebGL.
This tests HTML via set_content with network requests blocked, NOT file:// navigation.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import argparse,os,json,math,time
p=argparse.ArgumentParser();p.add_argument('--browser',default=os.environ.get('CHROMIUM_PATH'));p.add_argument('--case',choices=['cafe-terrace','the-scream'],required=True);p.add_argument('--suite',choices=['desktop','mobile','tour','fallback'],default='desktop');a=p.parse_args()
root=Path(__file__).resolve().parents[1];folder=root/'examples'/a.case;out=folder/'qa';out.mkdir(exist_ok=True);cafe=a.case=='cafe-terrace';api='cafeWorld' if cafe else 'paintingWorld';suite=a.suite
ids={'free':'freeEnter' if cafe else 'free','sound':'soundButton' if cafe else 'sound','settings':'settingsButton' if cafe else 'settings','about':'aboutButton' if cafe else 'about','mode':'flyButton' if cafe else 'mode','shot':'captureButton' if cafe else 'capture','restore':'restoreButton' if cafe else 'restore','tour':'tourButton' if cafe else 'tour','up':'upButton' if cafe else 'up'}
checks=[];errors=[];requests=[]
def check(n,v,d=None):
 checks.append({'name':n,'pass':bool(v),'detail':d});(out/f'checkpoint-{suite}.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2));print(('PASS ' if v else 'FAIL ')+n,flush=True)
def st():return pg.evaluate(f'{api}.getState()')
def call(expr,arg=None):return pg.evaluate(f'(arg)=>{api}.'+expr,arg)
def frames(n=4):
 f=st()['frame'];pg.wait_for_function(f'(f)=>{api}.getState().frame>=f+{n}',arg=f,timeout=15000)
def click(k):pg.locator('#'+ids.get(k,k)).click()
def shot(n):pg.screenshot(path=str(out/n))
with sync_playwright() as pw:
 args={'headless':True,'args':['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']}
 if a.browser:args['executable_path']=a.browser
 b=pw.chromium.launch(**args);opts={'viewport':{'width':900,'height':600},'device_scale_factor':1,'accept_downloads':True}
 if suite=='mobile':opts.update(viewport={'width':360,'height':800},is_mobile=True,has_touch=True)
 if suite=='tour':opts.update(viewport={'width':640,'height':480})
 pg=b.new_page(**opts);pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('request',lambda r:requests.append(r.url));pg.route('**/*',lambda r:r.abort())
 html=(folder/'index.en.html').read_text()
 if suite=='fallback':html=html.replace('<body>',"<body><script>const oldGet=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){return t==='webgl2'?null:oldGet.call(this,t,...a)};</script>")
 try:
  pg.set_content(html,wait_until='load')
  if suite=='fallback':
   pg.wait_for_selector('#error',state='visible',timeout=15000);check('WebGL unavailable explanation','WEBGL' in pg.locator('#errorDetail').inner_text().upper());check('No fake scene after failure',pg.evaluate('!window.'+api));shot('fallback.png')
  else:
   pg.wait_for_function('window.'+api+'?.ready',timeout=30000);frames();check('Five WebGL render passes',st()['drawCalls']==5,st());check('GL error flag zero',call('glError()')==0);check('English entry opens in English',st()['lang']=='en');check('No autoplay on load',not st()['audioOn'] and st()['audioNotes']==0)
   if suite=='desktop':
    shot('entry-en.png');call("setLanguage('zh')");shot('entry-zh.png');pg.keyboard.press('h');shot('scene-clean.png');pg.keyboard.press('h')
    click('free');frames();check('Free exploration entry',st()['mode']=='free')
    if not st()['audioOn']:click('sound')
    pg.wait_for_function(f'{api}.getState().audioNotes>0',timeout=12000);check('Audio scheduled after interaction',st()['audioOn'] and st()['audioState']=='running',st()['audioNotes']);click('sound');check('Audio mute works',not st()['audioOn'])
    pose=([3,1.72,10],[3,1.72,-10]) if cafe else ([-1,1.72,8],[-1,1.72,-10]);call('setPose(arg[0],arg[1])',pose)
    z=st()['eye'][2];pg.keyboard.down('w');frames(5);pg.keyboard.up('w');check('World-space camera movement',st()['eye'][2]<z-.1)
    yaw=st()['yaw'];pg.mouse.move(700,350);pg.mouse.down();pg.mouse.move(810,375,steps=4);pg.mouse.up();frames();check('Drag changes direction',abs(st()['yaw']-yaw)>.1)
    pg.keyboard.press('f');check('Flight toggle',st()['fly']);y=st()['eye'][1];pg.keyboard.down('e');frames();pg.keyboard.up('e');check('Flight ascends',st()['eye'][1]>y+.1);pg.keyboard.press('f');check('Walk returns to eye level',not st()['fly'] and abs(st()['eye'][1]-1.72)<.02)
    bounds=[(-5.6,-8,False),(-5.6,2.05,True),(-.16,4.1,False),(3,10,True)] if cafe else [(4,0,False),(1.13,1.1,False),(-1,0,True),(0,-100,False)]
    for x,z,v in bounds:check(f'Walking predicate ({x},{z})',call('canWalk(arg[0],arg[1])',[x,z])==v)
    for i in range(6):
     call('jump(arg)',i);frames();check('Destination '+str(i+1),st()['selected']==i and all(math.isfinite(x) for x in st()['eye']))
     if i in [1,2,5]:shot(f'place-{i+1:02d}.png')
    reverse=([4,2,-19],[2,3,12]) if cafe else ([-2,2.3,-2],[1.13,2.2,1.1]);call('setPose(arg[0],arg[1])',reverse);frames();shot('reverse.png')
    pg.keyboard.press('h');check('UI hides',pg.evaluate('document.body.classList.contains("hidden-ui")'));click('restore');check('UI restoration',not pg.evaluate('document.body.classList.contains("hidden-ui")'))
    eye=st()['eye'];call("setLanguage('en')");check('Language retains camera',st()['eye']==eye)
    click('about');check('About dialog opens',pg.evaluate('document.querySelector("#aboutDialog").open'));pg.locator('#aboutDialog [data-close]').click()
    click('settings');click('qualityLow');check('Light quality reduces pixels',st()['canvas']==[630,420],st()['canvas']);click('motionOff');pg.locator('#settingsDialog [data-close]').click();click('tour');check('Motion-off prevents tour',st()['mode']=='free')
    click('settings');click('qualityHigh');click('motionOn');pg.locator('#settingsDialog [data-close]').click();call('jump(0)');frames()
    with pg.expect_download(timeout=15000) as dl:click('shot')
    dl.value.save_as(str(out/'postcard.png'));im=Image.open(out/'postcard.png');check('Postcard is a real framed PNG',im.width>900 and im.height>600,{'size':im.size,'bytes':(out/'postcard.png').stat().st_size})
    call('home()');check('Home returns to landing',st()['mode']=='landing');check('No GL error after interaction',call('glError()')==0)
   elif suite=='mobile':
    check('No horizontal page overflow',pg.evaluate('document.documentElement.scrollWidth==innerWidth'))
    for loc in ['zh','en']:
     call('setLanguage(arg)',loc);r=pg.evaluate('({b:document.querySelector(".brand").getBoundingClientRect().toJSON(),n:document.querySelector("header nav").getBoundingClientRect().toJSON(),w:innerWidth})');check(loc+' header fits without overlap',(r['b']['right']<=r['n']['left'] or r['b']['bottom']<=r['n']['top']) and r['n']['right']<=r['w'],r);shot('mobile-'+loc+'.png')
    click('free');frames();check('Mobile joystick visible',pg.locator('#joystick').is_visible())
    if st()['audioOn']:click('sound')
    pose=([3,1.72,10],[3,1.72,-10]) if cafe else ([-1,1.72,8],[-1,1.72,-10]);call('setPose(arg[0],arg[1])',pose);z=st()['eye'][2];bb=pg.locator('#joystick').bounding_box();x=bb['x']+bb['width']/2;y=bb['y']+bb['height']/2;pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(x,y-27);frames(5);pg.mouse.up();check('Joystick moves camera',st()['eye'][2]<z-.05)
    click('mode');check('Mobile flight toggle',st()['fly']);check('Mobile altitude buttons visible',pg.locator('#'+ids['up']).is_visible());bb=pg.locator('#'+ids['up']).bounding_box();y0=st()['eye'][1];pg.mouse.move(bb['x']+15,bb['y']+15);pg.mouse.down();frames(5);pg.mouse.up();check('Mobile ascend works',st()['eye'][1]>y0+.05)
    pg.locator('[data-spot="5"]').scroll_into_view_if_needed();pg.locator('[data-spot="5"]').tap();pg.wait_for_function(f'{api}.getState().selected===5',timeout=15000);check('Dock reaches final destination',st()['selected']==5);shot('mobile-free.png');pg.keyboard.press('h');click('restore');check('Mobile restores UI',not pg.evaluate('document.body.classList.contains("hidden-ui")'));pg.set_viewport_size({'width':800,'height':360});frames();check('Landscape resize',st()['canvas']==[800,360]);shot('mobile-landscape.png')
   elif suite=='tour':
    click('enter');start=time.monotonic();check('Tour starts',st()['mode']=='tour');pg.wait_for_function(f'{api}.getState().mode==="free" && {api}.getState().selected===5',timeout=48000);check('Full tour completes and hands over',st()['fly'],{'wallSeconds':round(time.monotonic()-start,2)});shot('tour-complete.png');click('tour');pg.keyboard.press('Escape');check('Esc interrupts',st()['mode']=='free');click('tour');pg.mouse.move(370,200);pg.mouse.down();pg.mouse.move(408,223);pg.mouse.up();check('Pointer interrupts',st()['mode']=='free');click('tour');pg.keyboard.down('w');frames();pg.keyboard.up('w');check('Movement interrupts',st()['mode']=='free')
  check('Zero runtime network requests',not requests,requests);check('No uncaught script errors',not errors,errors)
 except Exception as e:
  check('Suite completed',False,str(e))
  try:shot('failure-'+suite+'.png')
  except Exception:pass
 (out/f'test-{suite}.json').write_text(json.dumps({'case':a.case,'suite':suite,'browser':b.version,'loading':'set_content, network requests blocked','checks':checks,'errors':errors,'requests':requests,'physicalPhone':False,'listeningTest':False},ensure_ascii=False,indent=2));b.close()
print('RESULT',sum(x['pass'] for x in checks),'/',len(checks),flush=True)
raise SystemExit(0 if all(x['pass'] for x in checks) else 1)
