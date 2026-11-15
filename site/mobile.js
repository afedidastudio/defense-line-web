(() => {
const enabled=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
const mobile=window.defenseMobile={enabled,canvasScale:()=>document.getElementById('canvas').getBoundingClientRect().width/1280};
if(!enabled)return;
const canvas=document.getElementById('canvas');canvas.width=1280;canvas.height=720;const field=document.createElement('div');field.id='touch-field';canvas.before(field);field.append(canvas);
const ui=document.createElement('section');ui.id='touch-ui';ui.innerHTML=`<div id="touch-hint" role="status"></div><nav id="touch-dock" aria-label="Game controls"></nav><section id="touch-drawer" aria-label="Game actions" hidden><header><strong id="touch-title"></strong><button id="touch-close" aria-label="Close">×</button></header><div id="touch-actions"></div><details id="touch-info"><summary></summary><div></div></details><div id="touch-tools"></div></section>`;document.body.append(ui);
let latest=null,lastContext='',opened=false,signature='',dockSignature='',actionSignature='',toolsSignature='';const dock=ui.querySelector('#touch-dock'),drawer=ui.querySelector('#touch-drawer'),hint=ui.querySelector('#touch-hint');
const text=(he,en)=>latest?.language==='en'?en:he;
function resize(){const r=field.getBoundingClientRect(),scale=Math.min(r.width/1280,r.height/720);canvas.style.width=(1280*scale)+'px';canvas.style.height=(720*scale)+'px';canvas.style.position='absolute';canvas.style.left=((r.width-1280*scale)/2)+'px';canvas.style.top=(r.height>r.width?32:(r.height-720*scale)/2)+'px'}
addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);resize();
function show(value){opened=value;drawer.hidden=!value;document.getElementById('touch-more')?.setAttribute('aria-expanded',String(value));if(value)drawer.scrollTop=0}
function invoke(id){if(typeof window.defenseMobileInput==='function')window.defenseMobileInput(id)}
function button(label,action,disabled=false,id=''){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;if(id)b.id=id;b.addEventListener('click',action);return b}
ui.querySelector('#touch-close').onclick=()=>show(false);
mobile.update=state=>{
 latest=state;mobile.state=state;ui.dir=state.language==='en'?'ltr':'rtl';const next=JSON.stringify(state);if(next===signature)return;signature=next;
 const contextChanged=state.context!==lastContext;if(contextChanged){lastContext=state.context;if(state.context)show(true);else if(state.game)show(false)}
 const modes={hero:text('געו במפה כדי להזיז את הגיבור','Tap the map to move the hero'),air:text('געו במטרה לתקיפה אווירית','Tap a target for the air strike'),reinforce:text('געו בשביל להצבת תגבורת','Tap the route to place reinforcements'),rally:text('געו בשביל לקביעת נקודת כינוס','Tap the route to set a rally point')};
 hint.textContent=state.panning?text('גררו את המפה · כבו הזזה כדי לבחור מטרה','Drag the map · turn off Pan to select targets'):modes[state.mode]||(state.game?`${text('חיים','Lives')} ${state.lives} · ${text('זהב','Gold')} ${state.gold} · ${text('גל','Wave')} ${state.wave}`:text('קו ההגנה · מומלץ לשחק לרוחב','Defense Line · landscape recommended'));
 const dockKey=JSON.stringify([state.quick.map(q=>[q.id,q.disabled,q.remaining]),state.mode,state.panning,state.paused,state.language]);if(dockKey!==dockSignature){dockSignature=dockKey;dock.replaceChildren();
 const names={hero:text('גיבור','Hero'),rally:text('יכולת','Ability'),air:text('אוויר','Air'),reinforce:text('תגבורת','Troops'),wave:text('גל','Wave'),pause:state.paused?text('המשך','Resume'):text('השהיה','Pause')};
 for(const item of state.quick){const b=button(names[item.key]+(item.remaining>0?" "+item.remaining+"s":""),()=>{invoke(item.id);show(false)},item.disabled,'touch-'+item.key);b.title=item.label;dock.append(b)}
 if(state.mode!=='build'||state.panning)dock.append(button(text('ביטול','Cancel'),()=>{invoke('cancel');show(false)},false,'touch-cancel'));
 const more=button(text('פעולות','Actions'),()=>show(!opened),false,'touch-more');more.setAttribute('aria-expanded',String(opened));dock.append(more);}
 ui.querySelector('#touch-title').textContent=state.context.startsWith('pad:')?text('בנייה ושדרוג','Build and upgrade'):state.game?text('פקודות ומידע','Commands and information'):text('קו ההגנה','Defense Line');
 const list=ui.querySelector('#touch-actions');const oldScroll=drawer.scrollTop;const quickIds=new Set(state.quick.map(q=>q.id));const visibleActions=state.actions.filter(a=>!state.game||!quickIds.has(a.id));const actionKey=JSON.stringify(visibleActions);if(actionKey!==actionSignature){actionSignature=actionKey;list.replaceChildren();
 for(const a of visibleActions){const b=button(a.label.split('\n')[0],()=>{invoke(a.id);show(false)},a.disabled);b.dataset.nativeId=a.id;b.title=a.label;if(a.detail){let small=document.createElement('small');small.textContent=a.detail;b.append(small)}list.append(b)}}
 const info=ui.querySelector('#touch-info');info.querySelector('summary').textContent=text('תדריך ופרטים','Briefing and details');let body=info.querySelector('div');body.replaceChildren();for(const value of [...new Set(state.info)]){let p=document.createElement('p');p.textContent=value;body.append(p)}
 const tools=ui.querySelector('#touch-tools');const toolKey=JSON.stringify([state.game,state.panning,state.language]);if(toolKey!==toolsSignature){toolsSignature=toolKey;tools.replaceChildren();if(state.game){tools.append(button(text('הגדלה / מפה מלאה','Zoom / full map'),()=>{invoke('zoom');show(false)},false,'touch-zoom'));tools.append(button(state.panning?text('סיום הזזה','Stop panning'):text('הזזת מפה','Pan map'),()=>{invoke('pan');show(false)},false,'touch-pan'))}
 tools.append(button(text('פרטיות','Privacy'),()=>window.DefenseAnalytics?.openConsent()));tools.append(button('עברית',()=>invoke('he')),button('English',()=>invoke('en')),button(text('מסך מלא','Fullscreen'),async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();try{await screen.orientation.lock('landscape')}catch{}resize()}catch{hint.textContent=text('אפשר לשחק גם ללא מסך מלא; מומלץ לסובב לרוחב','Fullscreen unavailable; rotate to landscape for a larger view')}},false,'touch-fullscreen'));}
 if(!contextChanged)drawer.scrollTop=oldScroll;
};
document.addEventListener('visibilitychange',()=>{if(document.hidden)invoke('suspend')});
})();
