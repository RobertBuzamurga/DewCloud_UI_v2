import {LiquidLighting} from './lighting.js';
const iconData=await fetch(new URL('./icons.json',import.meta.url)).then(r=>r.json());
export function icon(name){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconData[name]||iconData.info}</svg>`;}
export function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
export function notify(text){const n=document.querySelector('#toast');n.textContent=text;n.hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>n.hidden=true,6000);}
let appearance,auto;
export function setTheme(mode){appearance=mode;const theme=mode==='auto'?(auto.matches?'dark':'light'):mode;document.documentElement.dataset.theme=theme;document.documentElement.dataset.themeMode=mode;document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===mode)));const url=new URL(location);url.searchParams.set('theme',mode);history.replaceState(null,'',url);}
export function setup(){
 auto=matchMedia('(prefers-color-scheme: dark)');auto.addEventListener('change',()=>{if(appearance==='auto')setTheme('auto');});
 const choice=new URL(location).searchParams.get('theme');setTheme(['light','dark','auto'].includes(choice)?choice:'dark');
 document.querySelectorAll('[data-theme-choice]').forEach(b=>b.onclick=()=>setTheme(b.dataset.themeChoice));
 document.querySelectorAll('[role=switch]').forEach(b=>b.onclick=()=>{if(b.disabled)return;const checked=b.getAttribute('aria-checked')!=='true';b.setAttribute('aria-checked',String(checked));});hydrate();
 document.querySelectorAll('dialog').forEach(d=>{d.querySelector('[data-close]')?.addEventListener('click',()=>d.close());d.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const list=[...d.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&!el.hidden);const first=list[0],last=list.at(-1);if(!first){e.preventDefault();return;}if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});});
 const lighting=new LiquidLighting();document.querySelector('[data-tilt]')?.addEventListener('click',()=>lighting.enableTilt());document.querySelector('[data-effects-control] select')?.addEventListener('change',e=>{document.documentElement.dataset.effects=e.target.value;});
 return lighting;
}
