(() => {
'use strict';
const ua=navigator.userAgent||'';
const blocked=!!navigator.userAgentData?.mobile||/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua)||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1);
window.defenseMobileBlocked=blocked;
if(!blocked)return;
document.body.classList.add('mobile-unavailable');
const style=document.createElement('style');
style.textContent=`body.mobile-unavailable{margin:0;background:#14271f;color:#f4e6be;font-family:Arial,"Segoe UI",sans-serif;overflow:auto}body.mobile-unavailable>:not(#mobile-unavailable){display:none!important}#mobile-unavailable{min-height:100svh;box-sizing:border-box;display:flex;align-items:center;justify-content:center;padding:max(24px,env(safe-area-inset-top)) max(24px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(24px,env(safe-area-inset-left));text-align:center}#mobile-unavailable article{max-width:560px;line-height:1.6}#mobile-unavailable svg{width:88px;height:88px;color:#d5bb76}#mobile-unavailable h1{font-size:clamp(26px,6vw,36px);line-height:1.3;margin:20px 0 12px}#mobile-unavailable p{font-size:18px;margin:10px 0}#mobile-unavailable .english{color:#c8cdbb;font-size:16px;margin-top:24px}`;
document.head.append(style);
const screen=document.createElement('main');screen.id='mobile-unavailable';screen.setAttribute('dir','rtl');
screen.innerHTML='<article><svg viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true"><rect x="8" y="12" width="80" height="54" rx="5"/><path d="M48 66v15M29 83h38M9 55h78"/></svg><h1>המשחק אינו זמין במובייל</h1><p>כדי לשחק בקו ההגנה, פתחו את האתר בדפדפן במחשב.</p><p class="english" lang="en" dir="ltr">This game is available on desktop browsers only.<br>Please open this website on a computer to play.</p></article>';
document.body.append(screen);
})();
