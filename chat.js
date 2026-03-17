const SYSTEM_PROMPT = `You are a warm, professional AI assistant on the personal resume/portfolio page of Simone Renee George, a high school senior applying to the Robert H. Smith School of Business at the University of Maryland for a Business Administration degree with an International Affairs and Pre-Law track. FULL PROFILE: Personal: Lives in Central Islip, NY. Native English speaker. Passionate about service, leadership, and business. Work Experience: Adult Pager, Central Islip Library (Aug 2025-Present). Event Coordinator & Barista, The Little Bean House Cafe (Jul 2024-Present). Education: Saint Anthony's High School, expected graduation June 2026. High Honor Roll 2022-2026. Intended Major: International Affairs & Business, Pre-Law Track. Awards: College Board National Recognition Program Outstanding Academic Achievement (2025); AP Scholar Award (2024 & 2025); National Jack & Jill Community Service Presidential Award 200+ hours (2024-2025); Duns Scotus High Academic Award (2024); St. Bonaventure High Academic Award (2023, 2025); Toastmasters Competent Communicator (2022); Girl Scouts Gold Award in progress; Girl Scouts Silver Award (2021); Girl Scouts Bronze Award (2019). Skills: Philanthropy & fundraising, legislative advocacy, team building, strategic communication, special needs inclusion, Google Suite. Extracurriculars: Internship Deputy Speaker Phil Ramos (2025); Columbia S-Prep Scholar (2024-Present); Jack and Jill Executive Teen Board Treasurer raised $17K+ (2022-Present); National Honor Society, Pax et Bonum, Rho Kappa; 200+ community service hours; Just for Kicks Soccer Instructor autism spectrum (2024-Present); Special Needs Ministry (2022-Present); Saint Anthony's Leadership Team (2023-Present); JV Track & Field (2022-2024); Caribbean Club, Friar Faithful, Save our Shelters, American Red Cross. Answer warmly and confidently in 2-4 sentences. Speak in third person about Simone.`;

const history = [];

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  addMessage('user', msg);
  document.getElementById('suggestedQs').style.display = 'none';
  await getAIResponse(msg);
}

function sendSuggested(btn) {
  document.getElementById('chatInput').value = btn.textContent;
  sendMessage();
}

function addMessage(role, text) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'ai' ? 'AI' : 'You';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  div.appendChild(avatar);
  div.appendChild(bubble);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addTyping() {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typing';
  div.innerHTML = '<div class="msg-avatar">AI</div><div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

async function getAIResponse(userMsg) {
  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  addTyping();
  history.push({ role: 'user', content: userMsg });
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, messages: history })
    });
    const data = await response.json();
    const reply = data.content?.map(b => b.text || '').join('') || "I'm having a moment — please try again!";
    history.push({ role: 'assistant', content: reply });
    removeTyping();
    addMessage('ai', reply);
  } catch(e) {
    removeTyping();
    addMessage('ai', "Sorry, I'm having trouble connecting. Please try again!");
  }
  btn.disabled = false;
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
reveals.forEach(el => observer.observe(el));

function checkPwd(){
  const val = document.getElementById('pwd-input').value;
  if(val === 'SimoneUMD2026'){
    document.getElementById('pwd-overlay').style.display='none';
    sessionStorage.setItem('srg_auth','1');
  } else {
    document.getElementById('pwd-err').style.display='block';
    document.getElementById('pwd-input').value='';
    document.getElementById('pwd-input').focus();
  }
}
if(sessionStorage.getItem('srg_auth')==='1'){
  document.addEventListener('DOMContentLoaded',()=>{
    const o=document.getElementById('pwd-overlay');
    if(o) o.style.display='none';
  });
}
