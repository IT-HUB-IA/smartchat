const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const root=document.documentElement;
const toggle=document.querySelector('#motion-toggle');
let paused=false;
let scene=0;
const sequences=[
 {comment:'“QUERO saber mais!”',message:'Oi, Ana! Vi seu comentário.<br>Vamos encontrar o próximo passo?',reply:'Quero conhecer os planos',contact:'O comentário virou conversa.',detail:'Interesse registrado. Contexto preservado.'},
 {comment:'“Olá! Vocês podem me ajudar?”',message:'Claro! Você quer falar sobre<br>vendas ou precisa de suporte?',reply:'Quero falar com vendas',contact:'A conversa encontrou a equipe.',detail:'Atendimento direcionado à pessoa certa.'},
 {comment:'“😍 Adorei esse produto!”',message:'Que bom que gostou!<br>Quer conhecer as opções?',reply:'Quero o modelo azul',contact:'O interesse ganhou um caminho.',detail:'Uma etiqueta conecta os próximos passos.'}
];
function updateScene(){
 if(paused||reduced.matches||document.hidden)return;
 scene=(scene+1)%sequences.length;const s=sequences[scene];
 const pieces=[...document.querySelectorAll('.world-trigger,.world-chat,.world-contact')];pieces.forEach(p=>p.classList.add('is-switching'));
 setTimeout(()=>{if(paused||reduced.matches){pieces.forEach(p=>p.classList.remove('is-switching'));return;}
 document.querySelector('.world-trigger>p').textContent=s.comment;
 document.querySelector('.world-chat .mini-message').innerHTML=s.message;
 document.querySelector('.world-chat .mini-reply').innerHTML=s.reply+' <span>✓✓</span>';
 document.querySelector('.world-contact b').textContent=s.contact;
 document.querySelector('.world-contact p').textContent=s.detail;
 pieces.forEach(p=>p.classList.remove('is-switching'));
 },220);
}
const cycle=setInterval(updateScene,5500);
function setPaused(value){paused=value;root.dataset.motion=value?'paused':'running';toggle.setAttribute('aria-pressed',String(value));toggle.setAttribute('aria-label',value?'Retomar movimento':'Pausar movimento');toggle.textContent=value?'▷':'Ⅱ';}
toggle.addEventListener('click',()=>setPaused(!paused));
reduced.addEventListener('change',()=>{if(reduced.matches)document.querySelectorAll('.is-switching').forEach(e=>e.classList.remove('is-switching'));});
const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType==='touch')return;const b=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',((e.clientX-b.left)/b.width-.5)*2);hero.style.setProperty('--pointer-y',((e.clientY-b.top)/b.height-.5)*2);});
hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--pointer-x',0);hero.style.setProperty('--pointer-y',0);});
const stories=[...document.querySelectorAll('.story-steps article')];
stories[0]?.classList.add('is-active');
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){stories.forEach(s=>s.classList.toggle('is-active',s===e.target));}}},{rootMargin:'-20% 0px -30% 0px',threshold:.55});stories.forEach(s=>observer.observe(s));
const panel=document.querySelector('#resource-panel');
new MutationObserver(()=>{if(reduced.matches)return;panel.classList.remove('is-changing');void panel.offsetWidth;panel.classList.add('is-changing');}).observe(panel,{childList:true});
// A animação comunica o roteamento; a pausa controla todos os movimentos contínuos.
window.addEventListener('pagehide',()=>clearInterval(cycle));
