(() => {
'use strict';
if(window.DefenseAnalytics)return;
const config=window.DEFENSE_ANALYTICS_CONFIG||{},id=config.measurementId||'',params=new URLSearchParams(location.search);
const excluded=['qa','probe'].some(k=>params.has(k));
const configured=config.enabled===true&&/^G-[A-Z0-9]{6,20}$/.test(id)&&!excluded;
const optOut=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1';
const KEY='defense-analytics-consent-v1',TTL=180*24*60*60*1000;
const allowed=new Set(['game_launch','game_start','game_session_end','level_start','level_end','level_up','unlock_achievement','tutorial_begin','tutorial_complete','tutorial_skip','wave_start','ability_use','spend_virtual_currency','earn_virtual_currency']);
const fields=new Set(['level_name','level_number','sector_id','difficulty','character','success','value','virtual_currency_name','item_name','level','achievement_id','wave_number','early','ability','active_time_sec','levels_started','levels_completed','levels_failed','tutorial_step']);
let consent=null,loaded=false,loading=false,engineReady=false,launched=false,started=false,ended=false,activeLevel=null,activeAt=0,activeMs=0,playing=false,levelStarts=0,levelWins=0,levelLosses=0;
const seen=new Set(),pending=[];const debug=config.debug===true||params.get("analytics_debug")==="1";
function read(){try{const v=JSON.parse(localStorage.getItem(KEY));if(v&&Date.now()-v.at<TTL&&['granted','denied'].includes(v.choice))return v.choice}catch{}return null}
consent=read();
function granted(){return configured&&!optOut&&consent==='granted'}
function clock(){if(activeAt){activeMs+=Math.max(0,performance.now()-activeAt);activeAt=0}}
function setPlaying(value){clock();playing=!!value;if(playing&&granted()&&!document.hidden)activeAt=performance.now()}
function gtag(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments)}
function cleanURL(raw,utm=false){try{const u=new URL(raw);u.username='';u.password='';u.hash='';const old=new URLSearchParams(u.search);u.search='';if(utm)for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id']){const v=old.get(key);if(v&&/^[a-zA-Z0-9 _.\-]{1,100}$/.test(v))u.searchParams.set(key,v)}return u.href}catch{return ''}}
function referrerOrigin(){try{return new URL(document.referrer).origin+"/"}catch{return ""}}
function send(name,values={}){if(!loaded||!granted())return false;const clean={};for(const [key,value] of Object.entries(values)){if(!fields.has(key))continue;if(typeof value==='number'&&Number.isFinite(value)||typeof value==='boolean')clean[key]=value;else if(typeof value==='string'&&!/@|https?:\/\//i.test(value))clean[key]=value.slice(0,100)}gtag('event',name,{...clean,...(debug?{debug_mode:true}:{})});return true}
function launch(){engineReady=true;if(!launched&&granted()&&loaded){launched=true;send('game_launch')}}
function load(){if(!granted()||loaded||loading)return;loading=true;window['ga-disable-'+id]=false;
 gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
 script.onload=()=>{loading=false;if(!granted())return;loaded=true;gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_prefix:'defense',cookie_expires:15552000,cookie_path:new URL('.',location.href).pathname,cookie_flags:'SameSite=Lax;Secure',page_location:cleanURL(location.href,true),page_referrer:referrerOrigin(),...(debug?{debug_mode:true}:{})});gtag('event','page_view',{page_location:cleanURL(location.href,true),page_referrer:referrerOrigin(),page_title:'Defense Line'});if(engineReady)launch();for(const args of pending.splice(0))event(...args)};
 script.onerror=()=>{loading=false;pending.length=0};document.head.append(script);
}
function clearCookies(){const path=new URL('.',location.href).pathname;for(const part of document.cookie.split(';')){const name=part.split('=')[0].trim();if(!name.startsWith('defense_ga'))continue;for(const p of [path,'/'])for(const domain of ['',`; Domain=${location.hostname}`,`; Domain=.${location.hostname}`])document.cookie=`${name}=; Max-Age=0; Path=${p}${domain}; SameSite=Lax; Secure`}}
function choose(choice){consent=choice;try{localStorage.setItem(KEY,JSON.stringify({choice,at:Date.now()}))}catch{}
 if(choice==='granted'){window['ga-disable-'+id]=false;if(loaded)gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});else load();}else{window['ga-disable-'+id]=true;clock();playing=false;activeLevel=null;pending.length=0;seen.clear();clearCookies();if(loaded)gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})}
 document.getElementById('analytics-consent')?.remove();
}
function openConsent(){document.getElementById('analytics-consent')?.remove();if(excluded)return;const box=document.createElement('section');box.id='analytics-consent';box.setAttribute('role','dialog');box.setAttribute('aria-labelledby','analytics-title');box.dir='rtl';box.innerHTML='<strong id="analytics-title">פרטיות · Privacy</strong><p></p><div></div>';
 const p=box.querySelector('p'),buttons=box.querySelector('div');p.textContent=!configured?'מדידת שימוש אינה מוגדרת כרגע. Analytics is currently disabled.':optOut?'המעקב כבוי בהתאם להגדרת הפרטיות בדפדפן. Tracking is disabled by your browser privacy setting.':'מדידת שימוש אופציונלית באמצעות Google Analytics: ביקורים, מכשירים והתקדמות במשחק. ללא פרטי התחברות או פרסום מותאם. אפשר לסרב ולשנות בחירה בכל עת. Optional usage analytics: visits, devices and gameplay progress. No login details or personalized ads. You can decline or withdraw at any time.';
 const add=(caption,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=caption;b.onclick=fn;buttons.append(b)};
 if(configured&&!optOut){add('אישור · Accept',()=>choose('granted'));add('ללא מעקב · Decline',()=>choose('denied'))}add('סגירה · Close',()=>box.remove());document.body.append(box);
}
function event(name,values={},key=''){if(!granted()||!allowed.has(name))return false;if(!loaded){if(loading&&pending.length<32)pending.push([name,values,key]);return false;}if(key&&seen.has(name+':'+key))return false;
 if(name==='level_start'){if(activeLevel===key&&key)return false;activeLevel=key||values.level_name;if(!started){started=true;send('game_start')}levelStarts++;setPlaying(true)}
 if(name==='level_end'){if(activeLevel===null)return false;activeLevel=null;values.success===true?levelWins++:levelLosses++;setPlaying(false)}
 const sent=send(name,values);if(sent&&key){if(seen.size>=512)seen.delete(seen.values().next().value);seen.add(name+':'+key)}return sent;
}
window.DefenseAnalytics=Object.freeze({launch,event,setPlaying,openConsent,status:()=>({configured,consent,optOut,loaded})});
function mount(){if(excluded)return;const b=document.createElement('button');b.id='analytics-privacy';b.type='button';b.textContent='פרטיות · Privacy';b.onclick=openConsent;document.body.append(b);if(configured&&!optOut&&consent===null)openConsent();load()}
if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount,{once:true});
document.addEventListener('visibilitychange',()=>{clock();if(!document.hidden&&playing&&granted())activeAt=performance.now()});
addEventListener('pagehide',()=>{clock();if(started&&!ended&&granted()){ended=true;send('game_session_end',{active_time_sec:Math.round(activeMs/1000),levels_started:levelStarts,levels_completed:levelWins,levels_failed:levelLosses})}});
})();
