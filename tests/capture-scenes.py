"""Capture only the actual WebGL framebuffer, not an AI image or the HTML UI.
Python + Playwright; --browser PATH selects a system Chromium. Xvfb may be needed on Linux.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,base64,os
p=argparse.ArgumentParser();p.add_argument('--browser',default=os.environ.get('CHROMIUM_PATH'));a=p.parse_args();root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 options={'headless':True,'args':['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']}
 if a.browser:options['executable_path']=a.browser
 b=p.chromium.launch(**options)
 for case,api in [('cafe-terrace','cafeWorld'),('the-scream','paintingWorld')]:
  pg=b.new_page(viewport={'width':1200,'height':800},device_scale_factor=1);pg.set_content((root/'examples'/case/'index.en.html').read_text());pg.wait_for_function(f'window.{api}?.ready',timeout=30000)
  data=pg.evaluate(f'()=>{{{api}.home();{api}.render();return document.getElementById("world").toDataURL("image/png");}}')
  target=root/'examples'/case/'qa/scene-clean.png';target.write_bytes(base64.b64decode(data.split(',',1)[1]));print(case,target.stat().st_size,flush=True);pg.close()
 b.close()
