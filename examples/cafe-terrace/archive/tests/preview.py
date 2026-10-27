from playwright.sync_api import sync_playwright
import json,time
from pathlib import Path
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':960},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m: print(m.type,m.text[:700]) if m.type=='error' else None)
 page.set_content((root/'index.html').read_text(),wait_until='load')
 page.wait_for_function('window.cafeWorld && cafeWorld.ready',timeout=25000)
 page.wait_for_timeout(1200)
 print(json.dumps(page.evaluate('cafeWorld.getState()'),ensure_ascii=False))
 page.screenshot(path=str(root/'qa/01-landing.png'))
 print('errors',errors)
 page.evaluate('cafeWorld.jump(1)')
 page.wait_for_timeout(400)
 page.screenshot(path=str(root/'qa/02-table.png'))
 page.evaluate('cafeWorld.jump(4)')
 page.wait_for_timeout(400)
 page.screenshot(path=str(root/'qa/03-roofs.png'))
 b.close()
