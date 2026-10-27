from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
 pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
 errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.set_content((R/'index.html').read_text(),wait_until='load');pg.wait_for_function('window.cafeWorld?.ready',timeout=25000);pg.wait_for_timeout(1500)
 pg.screenshot(path=str(R/'qa/04-mobile-landing.png'))
 pg.evaluate('cafeWorld.setLanguage("en")');pg.wait_for_timeout(300);pg.screenshot(path=str(R/'qa/05-mobile-english.png'))
 print('header',pg.evaluate('({vw:innerWidth,b:document.querySelector(".brand").getBoundingClientRect().toJSON(),n:document.querySelector(".top-tools").getBoundingClientRect().toJSON()})'))
 pg.evaluate('cafeWorld.setLanguage("zh");cafeWorld.jump(1)');pg.wait_for_timeout(1500);pg.screenshot(path=str(R/'qa/06-mobile-explore.png'))
 pg.evaluate('cafeWorld.jump(4)');pg.wait_for_timeout(1200);pg.screenshot(path=str(R/'qa/07-mobile-roofs.png'))
 print('errors',errors);print(json.dumps(pg.evaluate('cafeWorld.getState()'),ensure_ascii=False));b.close()
