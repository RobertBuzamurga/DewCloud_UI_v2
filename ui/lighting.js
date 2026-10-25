/* DewCloud Liquid Glass 1.0.1 / etched.1 — decorative only, no idle animation loop. */
export class LiquidLighting {
 constructor(root=document){
  this.root=root;this.html=document.documentElement;this.items=new Map();this.frame=0;this.pointer=null;this.sensor=null;this.calibration=null;this.tiltEnabled=false;this.lastPaint=0;this.geometryDirty=true;
  this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.reducedMotion=this.motion.matches;this.destroyed=false;this.fine=matchMedia('(hover: hover) and (pointer: fine)');
  this.onPointer=e=>{if(e.pointerType==='touch'||!this.fine.matches||!this.allowed())return;this.pointer={x:e.clientX,y:e.clientY};this.sensor=null;this.schedule();};
  this.onLeave=()=>{this.pointer=null;this.schedule();};this.onGeometry=()=>{this.geometryDirty=true;if(this.pointer||this.sensor)this.schedule();};
  // One event-owned preference snapshot for gates, reset and UI; avoid split live-query state.
  this.onMotion=e=>{this.reducedMotion=e.matches;this.onPreference();};
  this.onPreference=()=>{if(!this.allowed()){this.disableTilt(false);this.reset();}else this.schedule();this.report();};
  this.onVisibility=()=>{if(document.hidden){this.reset();}else this.onGeometry();};
  this.onOrientation=e=>{if(!this.tiltEnabled||!this.allowed()||!Number.isFinite(e.beta)||!Number.isFinite(e.gamma))return;if(!this.calibration)this.calibration={beta:e.beta,gamma:e.gamma};const clamp=v=>Math.max(-1,Math.min(1,v/22));let x=clamp(e.gamma-this.calibration.gamma),y=clamp(e.beta-this.calibration.beta);const a=(screen.orientation?.angle||0)*Math.PI/180;this.sensor={x:x*Math.cos(a)+y*Math.sin(a),y:y*Math.cos(a)-x*Math.sin(a)};this.pointer=null;this.html.dataset.lightingInput='tilt';this.schedule();};
  document.addEventListener('pointermove',this.onPointer,{passive:true});document.addEventListener('pointerleave',this.onLeave,{passive:true});window.addEventListener('resize',this.onGeometry,{passive:true});window.addEventListener('scroll',this.onGeometry,{passive:true});document.addEventListener('visibilitychange',this.onVisibility);this.motion.addEventListener('change',this.onMotion);
  this.observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'))this.refresh();if(records.some(r=>r.type==='attributes')){this.refresh();this.onPreference();}});
  this.observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open','disabled','aria-disabled']});this.observer.observe(this.html,{attributes:true,attributeFilter:['data-effects','data-blur']});
  this.refresh();this.report();
 }
 allowed(){return !this.destroyed&&!this.reducedMotion&&this.html.dataset.effects!=='low'&&this.html.dataset.effects!=='static'&&this.html.dataset.blur!=='off'&&!document.hidden;}
 disabled(el){return el.matches(':disabled,[aria-disabled=true]')||!!el.closest('fieldset:disabled');}
 refresh(){
  const selectors='.glass-card,.panel,.nav a,.side-nav a,.segmented button,button:not([data-no-glass]),a.control,.toast,dialog';
  const found=new Set(this.root.querySelectorAll(selectors));
  for(const [el]of this.items)if(!found.has(el)||!el.isConnected)this.items.delete(el);
  for(const el of found){el.classList.add('dc-liquid');if(el.matches('button,a.control,.nav a,.side-nav a'))el.classList.add('dc-etch');if(!this.items.has(el))this.items.set(el,{angle:35,x:38,y:16,strength:.4,rect:null});}
  this.geometryDirty=true;if(this.pointer||this.sensor)this.schedule();
 }
 schedule(){if(!this.frame&&this.allowed())this.frame=requestAnimationFrame(t=>this.tick(t));}
 tick(now){
  this.frame=0;if(!this.allowed())return;
  if(now-this.lastPaint<32){this.schedule();return;}this.lastPaint=now;
  let moving=false;let painted=0;
  for(const [el,s]of this.items){
   if(this.disabled(el))continue;
   if(this.geometryDirty||!s.rect)s.rect=el.getBoundingClientRect();const b=s.rect;
   if(!b.width||!b.height||b.bottom<0||b.top>innerHeight||b.right<0||b.left>innerWidth)continue;
   let tx=38,ty=16,ta=35,ts=.4;
   if(this.sensor){tx=50+this.sensor.x*23;ty=25+this.sensor.y*18;ta=35+this.sensor.x*65+this.sensor.y*30;ts=.65;}
   else if(this.pointer){const dx=this.pointer.x-(b.left+b.width/2),dy=this.pointer.y-(b.top+b.height/2);const distance=Math.hypot(Math.max(0,Math.abs(dx)-b.width/2),Math.max(0,Math.abs(dy)-b.height/2));if(distance<180){const proximity=1-distance/180;tx=Math.max(18,Math.min(82,50+dx/b.width*50));ty=Math.max(0,Math.min(45,20+dy/b.height*25));ta=Math.atan2(dy,dx)*180/Math.PI+90;ts=.4+proximity*.4;}}
   const da=((ta-s.angle+540)%360)-180;const changed=Math.abs(da)>.12||Math.abs(tx-s.x)>.06||Math.abs(ty-s.y)>.06||Math.abs(ts-s.strength)>.004;
   if(!changed)continue;moving=true;s.angle+=da*.23;s.x+=(tx-s.x)*.23;s.y+=(ty-s.y)*.23;s.strength+=(ts-s.strength)*.23;
   el.style.setProperty('--dc-rim-angle',s.angle.toFixed(2)+'deg');el.style.setProperty('--dc-light-x',s.x.toFixed(2)+'%');el.style.setProperty('--dc-light-y',s.y.toFixed(2)+'%');el.style.setProperty('--dc-light-strength',s.strength.toFixed(3));painted++;
  }
  this.geometryDirty=false;this.html.dataset.lightingInput=this.sensor?'tilt':this.pointer?'pointer':'static';this.html.dataset.lightingFrame=String(painted);
  if(moving)this.schedule();
 }
 reset(){cancelAnimationFrame(this.frame);this.frame=0;this.pointer=null;this.sensor=null;for(const [el,s]of this.items){for(const name of ['--dc-rim-angle','--dc-light-x','--dc-light-y','--dc-light-strength'])el.style.removeProperty(name);Object.assign(s,{angle:35,x:38,y:16,strength:.4});}this.html.dataset.lightingInput='static';this.html.dataset.lightingFrame='0';}
 async enableTilt(){
  if(this.tiltEnabled){this.disableTilt();return false;}
  if(!this.allowed()){this.report('Tilt is off while reduced motion or lower effects are enabled.');return false;}
  const api=globalThis.DeviceOrientationEvent;
  if(!globalThis.isSecureContext||!api){this.report('Tilt is unavailable here. Static glass and all controls remain available.');return false;}
  try{if(typeof api.requestPermission==='function'&&await api.requestPermission()!=='granted'){this.report('Tilt permission was not granted. Using the normal glass fallback.');return false;}}
  catch{this.report('Tilt could not be enabled. Using the normal glass fallback.');return false;}
  if(!this.allowed()){this.report('Tilt stays off because motion effects are disabled.');return false;}this.tiltEnabled=true;this.calibration=null;window.addEventListener('deviceorientation',this.onOrientation,{passive:true});this.report('Tilt enabled; waiting for supported sensor input.');return true;
 }
 disableTilt(announce=true){window.removeEventListener('deviceorientation',this.onOrientation);this.tiltEnabled=false;this.calibration=null;this.sensor=null;this.reset();if(announce)this.report('Tilt is off.');}
 report(message){const label=document.querySelector('[data-lighting-status]');if(label)label.textContent=message||(this.reducedMotion?'Reduced motion · static rim lighting':this.html.dataset.effects==='low'?'Low effects · solid surfaces':this.html.dataset.effects==='static'?'Static reflections · no tracking':this.html.dataset.blur==='off'?'No blur · static surfaces':this.fine.matches?'Cursor-responsive rims · tilt off':'Static reflections · optional tilt');const button=document.querySelector('[data-tilt]');if(button){button.textContent=this.tiltEnabled?'Disable tilt':'Enable tilt';button.setAttribute('aria-pressed',String(this.tiltEnabled));const disabled=this.reducedMotion||this.html.dataset.effects==='low'||this.html.dataset.effects==='static'||this.html.dataset.blur==='off';if(button.disabled!==disabled)button.disabled=disabled;}}
 destroy(){if(this.destroyed)return;this.destroyed=true;this.disableTilt(false);this.observer.disconnect();document.removeEventListener('pointermove',this.onPointer);document.removeEventListener('pointerleave',this.onLeave);window.removeEventListener('resize',this.onGeometry);window.removeEventListener('scroll',this.onGeometry);document.removeEventListener('visibilitychange',this.onVisibility);this.motion.removeEventListener('change',this.onMotion);}
}
