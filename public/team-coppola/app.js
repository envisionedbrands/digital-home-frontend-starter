'use strict';
const roles={video:{title:'Hire Coppola',intro:'Your Video Editor starts with your own footage, references and private workspace.',file:'/team-coppola/downloads/coppola.agent.json',downloadName:'coppola.agent.json',message:'Hello Coppola. Guide my setup, help me choose my video style, and test my first clip.',note:'Enter the license key from your Lemon Squeezy receipt, then download.'}};
const dialog=document.getElementById('hire-dialog');let lastTrigger=null;let currentRole=null;
for(const button of document.querySelectorAll('[data-role]'))button.addEventListener('click',()=>{currentRole=roles[button.dataset.role];lastTrigger=button;document.getElementById('hire-title').textContent=currentRole.title;document.getElementById('hire-intro').textContent=currentRole.intro;document.getElementById('license-key').value='';document.getElementById('starter').textContent=currentRole.message;document.getElementById('download-note').textContent=currentRole.note;document.getElementById('notice').textContent='';document.getElementById('copy').textContent='Copy message';dialog.showModal();});
document.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>lastTrigger?.focus());
document.getElementById('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('starter').textContent);document.getElementById('copy').textContent='Copied';}catch{document.getElementById('notice').textContent='Select and copy the message above, then paste it into Buzz.';}});

document.getElementById('download').addEventListener('click',async()=>{
  const notice=document.getElementById('notice');
  const button=document.getElementById('download');
  const key=document.getElementById('license-key').value.trim();
  if(!key){notice.textContent='Enter your license key first — it’s in your Lemon Squeezy receipt email.';return;}
  button.classList.add('checking');
  notice.textContent='Checking your license key…';
  try{
    const res=await fetch(currentRole.file+'?license_key='+encodeURIComponent(key));
    if(!res.ok){
      const body=await res.json().catch(()=>({}));
      notice.textContent=body.error||'That license key did not work. Check it and try again.';
      return;
    }
    const blob=await res.blob();
    const objectUrl=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=objectUrl;link.download=currentRole.downloadName;
    document.body.appendChild(link);link.click();link.remove();
    URL.revokeObjectURL(objectUrl);
    notice.textContent='Your download should start shortly. Then follow the steps below to import your assistant. Downloading does not yet connect it to your accounts.';
  }catch{
    notice.textContent='Could not reach the license check just now. Try again in a moment.';
  }finally{
    button.classList.remove('checking');
  }
});

// Keep the greeting optional without interrupting the hiring flow.
const coppolaMotion=document.getElementById('coppola-motion');
coppolaMotion.addEventListener('click',()=>{
  const paused=coppolaMotion.getAttribute('aria-pressed')!=='true';
  document.getElementById('coppola-wave').src=paused?'/team-coppola/assets/coppola-hello.png':'/team-coppola/assets/coppola-hello.gif';
  coppolaMotion.setAttribute('aria-pressed',String(paused));
  coppolaMotion.setAttribute('aria-label',paused?'Play Coppola’s wave':'Pause Coppola’s wave');
  coppolaMotion.textContent=paused?'Play':'Pause';
});

const stanfordMotion=document.getElementById('stanford-motion');
stanfordMotion.addEventListener('click',()=>{
const paused=stanfordMotion.getAttribute('aria-pressed')!=='true';
document.getElementById('stanford-wave').src=paused?'/team-coppola/assets/stanford-hello.png':'/team-coppola/assets/stanford-hello.gif';
stanfordMotion.setAttribute('aria-pressed',String(paused));
stanfordMotion.setAttribute('aria-label',paused?'Play Stanford’s greeting':'Pause Stanford’s greeting');
stanfordMotion.textContent=paused?'Play':'Pause';
});
