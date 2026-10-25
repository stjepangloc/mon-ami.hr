document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu');
menu.addEventListener('click',()=>{const isOpen=document.getElementById('nav-links').classList.toggle('open');menu.setAttribute('aria-expanded',String(isOpen));});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{document.getElementById('nav-links').classList.remove('open');menu.setAttribute('aria-expanded','false');}));
const editor=document.getElementById('media-editor');
document.getElementById('edit-media').addEventListener('click',()=>editor.showModal());
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
const selectedSlot=document.getElementById('slot-select'), fileInput=document.getElementById('media-file'),status=document.getElementById('media-status');
selectedSlot.addEventListener('change',()=>{fileInput.accept=selectedSlot.value.startsWith('foto-')?'image/*':'video/*,image/*';status.textContent='';});
const urls=new Map();
document.getElementById('apply-media').addEventListener('click',()=>{
 const file=fileInput.files[0],name=selectedSlot.value;
 if(!file){status.textContent='Prvo odaberite datoteku.';return;}
 const video=file.type.startsWith('video/'),photo=file.type.startsWith('image/');
 if((!photo&&!video)||(name.startsWith('foto-')&&!photo)){status.textContent='Za ovo mjesto odaberite '+(name.startsWith('foto-')?'fotografiju.':'fotografiju ili videozapis.');return;}
 const target=document.querySelector('[data-slot="'+name+'"]');
 if(urls.has(name))URL.revokeObjectURL(urls.get(name));
 const url=URL.createObjectURL(file);urls.set(name,url);
 const old=target.querySelector('img,video');const media=document.createElement(video?'video':'img');
 media.src=url;if(video){media.controls=true;media.playsInline=true;media.preload='metadata';media.setAttribute('aria-label','Vaš video: '+file.name);media.addEventListener('play',()=>document.querySelectorAll('video').forEach(v=>{if(v!==media)v.pause();}));}else{media.alt='Vaša fotografija: '+file.name;}
 media.addEventListener('error',()=>{status.textContent='Preglednik ne može prikazati ovu datoteku. Pokušajte s MP4 (H.264) videom ili JPG/PNG fotografijom.';if(!editor.open)editor.showModal();});
 old.replaceWith(media);target.classList.toggle('has-video',video);const label=target.querySelector('.slot-label');if(label)label.textContent=video?'':'Vaša fotografija';
 fileInput.value='';status.textContent='';editor.close();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
});
const lightbox=document.getElementById('lightbox');
document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{const img=b.querySelector('img');const full=lightbox.querySelector('img');full.src=img.src;full.alt=img.alt;lightbox.showModal();}));
