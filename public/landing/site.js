import {resources,scenarios,faq} from './data.js';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const icon=name=>`<svg class="ico" aria-hidden="true"><use href="#${name}"/></svg>`;
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const toggle=$('.mobile-menu-toggle');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');$('#mobile-menu').hidden=true;}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');$('#mobile-menu').hidden=!open;});
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobile-menu').hidden){closeMenu();toggle.focus();}});
window.matchMedia('(min-width: 901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

function keyboardTabs(group,action){
  group.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
    const tabs=[...group.querySelectorAll('[role="tab"]')];
    let i=tabs.indexOf(document.activeElement);if(i<0)return;e.preventDefault();
    if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else i=(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+tabs.length)%tabs.length;
    tabs[i].focus();action(tabs[i]);
  });
}

let scenario='comentario',step=0;
function drawFlow(announce=false){
  const s=scenarios[scenario];
  $('#scenario-label').textContent=s.label;$('#demo-phone-channel').textContent=s.channel;
  $('#flow-steps').innerHTML=s.steps.map(([label,i,title,desc],n)=>`<div class="flow-node ${n===step?'is-current':n<step?'is-complete':'is-upcoming'}" ${n===step?'aria-current="step"':''}><span class="flow-node-icon">${n<step?icon('check'):icon(i)}</span><div><span class="flow-node-label">${escapeHTML(label)}</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(desc)}</p></div></div>`).join('');
  $('#phone-messages').innerHTML=s.messages.slice(0,step+1).map(([dir,message],n)=>`<div class="phone-bubble ${dir==='out'?'out':'in'}"><p>${escapeHTML(message)}</p><span>${dir==='out'?'Sua empresa':'Ana'} · 10:${String(42+n).padStart(2,'0')}</span></div>`).join('')+(step===3?'<div class="phone-done">'+icon('check')+' Pronto para o atendimento</div>':'');
  $('#flow-position').textContent=`${String(step+1).padStart(2,'0')} / 04`;
  $('#flow-next').hidden=step===3;$('#flow-reset').hidden=step!==3;
  if(announce)$('#flow-announcement').textContent=`Passo ${step+1} de 4. ${s.steps[step][2]} ${s.steps[step][3]}`;
}
function selectScenario(tab){scenario=tab.dataset.scenario;step=0;$$('[data-scenario]').forEach(b=>{const selected=b===tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});$('#scenario-panel').setAttribute('aria-labelledby',tab.id);drawFlow(true);}
$$('[data-scenario]').forEach(b=>b.addEventListener('click',()=>selectScenario(b)));
keyboardTabs($('.demo-scenarios'),selectScenario);
$('#flow-next').addEventListener('click',()=>{step=Math.min(3,step+1);drawFlow(true);if(step===3)$('#flow-reset').focus();});
$('#flow-reset').addEventListener('click',()=>{step=0;drawFlow(true);$('#flow-next').focus();});
drawFlow();

function visual(kind){
  if(kind==='canais')return `<div class="resource-network"><span class="network-channel net-wa"><img src="/landing/assets/channels/whatsapp.svg" alt="WhatsApp" width="31" height="31"></span><span class="network-channel net-ig"><img src="/landing/assets/channels/instagram.svg" alt="Instagram" width="31" height="31"></span><span class="network-channel net-fb"><img src="/landing/assets/channels/facebook.svg" alt="Messenger" width="31" height="31"></span><span class="network-channel net-mail" aria-label="E-mail">${icon('mail')}</span><span class="network-channel net-sms" aria-label="SMS">${icon('phone')}</span><span class="network-channel net-tg" aria-label="Telegram">${icon('send')}</span><div class="network-ring ring-a"></div><div class="network-ring ring-b"></div><img class="network-brand" src="/landing/assets/brand/v3/smartchat-symbol.svg" alt="SmartChat conecta seus canais" width="90" height="90"><p>Todos os caminhos levam a uma boa conversa.</p></div>`;
  if(kind==='captura')return `<div class="feature-capture"><span class="selo">Instagram / Exemplo</span><div class="capture-post"><div class="capture-post-art">Uma ideia.<br>Uma conversa.<span>Uma oportunidade.</span></div><div class="capture-comment"><span class="mini-avatar">AC</span><p><b>Ana Costa</b><br>QUERO saber mais!</p>${icon('message-circle')}</div></div><div class="capture-result">${icon('arrow-right')} Comentário identificado <span class="selo">Direct</span></div></div>`;
  if(kind==='fluxos')return `<div class="feature-flow"><div class="mini-flow-node">${icon('message-circle')} Nova mensagem</div><span class="vertical-connector"></span><div class="mini-flow-node filled">${icon('send')} Enviar boas-vindas</div><span class="vertical-connector"></span><div class="mini-flow-node">${icon('funnel')} Qual é o interesse?</div><div class="flow-branches"><span>Conhecer produtos</span><span>Falar com a equipe</span></div></div>`;
  if(kind==='logica')return `<div class="feature-logic"><div class="logic-rule"><span class="flow-node-label">SE O CONTATO TEM A ETIQUETA</span><p>${icon('tag')} Interesse em planos</p></div><span class="vertical-connector"></span><div class="logic-split"><div><span class="selo selo-sucesso">Sim</span><p>${icon('users')} Equipe comercial</p></div><div><span class="selo">Ainda não</span><p>${icon('send')} Entender o interesse</p></div></div><p class="logic-caption">Cada resposta abre um caminho.</p></div>`;
  if(kind==='contatos')return `<div class="feature-contact"><div class="profile-header"><img src="/landing/assets/brand/avatar.svg" alt="" width="56" height="56"><div><h3>Ana Costa</h3><p>Contato de demonstração</p></div>${icon('users')}</div><div class="profile-tags"><span class="selo">Interesse em planos</span><span class="selo selo-sucesso">Novo contato</span></div><dl><div><dt>Canal</dt><dd>Instagram</dd></div><div><dt>Equipe</dt><dd>5 pessoas</dd></div><div><dt>Próximo passo</dt><dd>Atendimento comercial</dd></div></dl><div class="profile-history">${icon('clock')} O histórico continua com a conversa.</div></div>`;
  return `<div class="feature-human"><span class="selo">Atendimento / Exemplo</span><div class="human-routing">${icon('pause')} Automação pausada <span>✓</span></div><div class="human-routing">${icon('user-plus')} Atribuído para Julia <span>✓</span></div><div class="mini-message">Oi, Ana! Vi que sua equipe tem 5 pessoas. Vou te ajudar a encontrar o melhor caminho.</div><p>${icon('lock')} Notas internas só para sua equipe.</p></div>`;
}
$('#resource-tabs').innerHTML=resources.map((r,i)=>`<button type="button" role="tab" id="tab-${r.id}" aria-controls="resource-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-resource="${r.id}">${icon(r.icon)}<span>${r.name}</span></button>`).join('');
function selectResource(button){
  const r=resources.find(r=>r.id===button.dataset.resource);
  $$('#resource-tabs button').forEach(b=>{const selected=b===button;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
  $('#resource-panel').setAttribute('aria-labelledby',button.id);
  $('#resource-panel').innerHTML=`<div class="resource-text"><p class="eyebrow">${r.label}</p><h3>${r.title.replace('\n','<br>')}</h3><p>${r.description}</p><a class="text-link" href="#detail-${r.id}" data-open-detail="${r.id}">Explorar ${r.items.length} recursos ${icon('arrow-right')}</a></div><div class="resource-visual">${visual(r.visual)}</div>`;
}
$$('#resource-tabs button').forEach(b=>b.addEventListener('click',()=>selectResource(b)));
keyboardTabs($('#resource-tabs'),selectResource);
$('#feature-details').innerHTML=resources.map((r,i)=>`<details id="detail-${r.id}" class="feature-detail"><summary><span class="detail-number">0${i+1}</span><span>${r.name}</span><span class="detail-count">${r.items.length} recursos</span><span class="detail-toggle">${icon('plus')}</span></summary><div class="feature-detail-body">${r.items.map(([name,desc])=>`<article><h4>${name}</h4><p>${desc}</p></article>`).join('')}</div></details>`).join('');
$('#recursos').addEventListener('click',e=>{const a=e.target.closest('[data-open-detail]');if(a){const target=$('#detail-'+a.dataset.openDetail);target.open=true;}});
selectResource($('#resource-tabs button'));
$('#faq-list').innerHTML=faq.map(([question,answer])=>`<details class="faq-item"><summary>${question}<span>${icon('plus')}</span></summary><p>${answer}</p></details>`).join('');

// Sem rastreamento, cookies ou captura de contatos. O CTA abre o WhatsApp informado.
document.documentElement.classList.add('site-ready');
