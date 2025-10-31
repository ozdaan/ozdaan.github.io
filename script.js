// ====== Kalpler / Işıltılar ======
const heartsContainer = document.getElementById('hearts-container');
const sparklesContainer = document.getElementById('sparkles-container');
const heartEmojis = ['💕','💖','💗','💓','💝','❤️','🌸','🌺'];

function spawnHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
  heart.style.left = Math.random()*100 + '%';
  const dur = (6 + Math.random()*6).toFixed(2);
  heart.style.setProperty('--dur', dur + 's');
  heart.style.setProperty('--sx', (Math.random()*140 - 70).toFixed(1) + 'px');
  heart.style.setProperty('--scale', (0.7 + Math.random()*0.8).toFixed(2));
  heart.style.setProperty('--op', (0.5 + Math.random()*0.45).toFixed(2));
  heartsContainer.appendChild(heart);
  setTimeout(()=> heart.remove(), (parseFloat(dur)+2)*1000);
}
for(let i=0;i<10;i++){ setTimeout(spawnHeart, i*220); }
setInterval(spawnHeart, 900);

function spawnSparkle(){
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = Math.random()*100 + '%';
  s.style.top = Math.random()*100 + '%';
  const dur = (2.2 + Math.random()*2.2).toFixed(2);
  const delay = (Math.random()*1.6).toFixed(2);
  s.style.animation = `sparkle ${dur}s ease-in-out ${delay}s forwards`;
  sparklesContainer.appendChild(s);
  setTimeout(()=> s.remove(), (parseFloat(dur)+parseFloat(delay))*1000 + 120);
}
for(let i=0;i<12;i++){ setTimeout(spawnSparkle, i*140); }
setInterval(spawnSparkle, 1100);

// Parallax background (kalpler/ışıklar)
window.addEventListener('mousemove', (e)=>{
  const w = window.innerWidth, h = window.innerHeight;
  const nx = (e.clientX / w - 0.5);
  const ny = (e.clientY / h - 0.5);
  heartsContainer.style.transform = `translate(${ -nx * 12 }px, ${ -ny * 8 }px)`;
  sparklesContainer.style.transform = `translate(${ -nx * 6 }px, ${ -ny * 4 }px)`;
});

// ====== Konfeti ======
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);

let confettiPieces = [], confettiRAF = null;
function spawnConfettiAt(x,y,count=120){
  const colors = ['#ff69b4','#ffb6d9','#ff1493','#ffc0cb','#ff85c1','#ffe4f3'];
  for(let i=0;i<count;i++){
    const angle = (Math.random()*Math.PI*2);
    const speed = 2 + Math.random()*6;
    confettiPieces.push({
      x: x + (Math.random()-0.5)*40,
      y: y + (Math.random()-0.5)*20,
      vx: Math.cos(angle)*speed + (Math.random()-0.5)*2,
      vy: Math.sin(angle)*speed - (3 + Math.random()*4),
      size: 6 + Math.random()*8,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*12,
      life: 1
    });
  }
  if(!confettiRAF) drawConfetti();
}
function drawConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i = confettiPieces.length-1; i>=0; i--){
    const p = confettiPieces[i];
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*1.4);
    ctx.restore();
    p.vy += 0.12; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.01;
    if(p.y > canvas.height + 50 || p.x < -50 || p.x > canvas.width + 50 || p.life <= 0){ confettiPieces.splice(i,1); }
  }
  if(confettiPieces.length>0){ confettiRAF = requestAnimationFrame(drawConfetti); }
  else { confettiRAF = null; ctx.clearRect(0,0,canvas.width,canvas.height); }
}

// ====== Açılış (çiçek alanı + kapanış) ======
const modal = document.getElementById('modal');
const hero = document.getElementById('hero');
const closeBtn = document.getElementById('closeBtn');

/* — Çiçek alanı (modal açıkken 30 çiçek) — */
(function flowerFieldFactory(){
  const field = document.getElementById('flower-field');

  const f1SVG = `
  <svg viewBox="-60 -60 120 120" class="flower-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="petalA" cx="30%" cy="30%">
        <stop offset="0%" stop-color="#ffe4f1"/>
        <stop offset="60%" stop-color="#ff8bbd"/>
        <stop offset="100%" stop-color="#ff5aa4"/>
      </radialGradient>
      <radialGradient id="centerA">
        <stop offset="0%" stop-color="#fff6c1"/>
        <stop offset="65%" stop-color="#ffd95c"/>
        <stop offset="100%" stop-color="#ffb347"/>
      </radialGradient>
    </defs>
    <g id="petalA-shape">
      <path d="M0,-40 C 9,-32 13,-18 0,12 C -13,-18 -9,-32 0,-40 Z" fill="url(#petalA)"/>
    </g>
    <g opacity="0.95">
      ${Array.from({length:12},(_,i)=>`<use href="#petalA-shape" transform="rotate(${i*30})"/>`).join('')}
    </g>
    <g opacity="0.9" transform="scale(0.72)">
      ${[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(a=>`<use href="#petalA-shape" transform="rotate(${a})"/>`).join('')}
    </g>
    <circle r="12" fill="url(#centerA)" class="center-glow"/>
  </svg>`.trim();

  const f2SVG = `
  <svg viewBox="-60 -60 120 120" class="flower-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="petalB" cx="40%" cy="25%">
        <stop offset="0%" stop-color="#ffd9ec"/>
        <stop offset="55%" stop-color="#ff94c6"/>
        <stop offset="100%" stop-color="#ff6aa8"/>
      </radialGradient>
      <radialGradient id="centerB">
        <stop offset="0%" stop-color="#fff5a6"/>
        <stop offset="60%" stop-color="#ffd24a"/>
        <stop offset="100%" stop-color="#ffa726"/>
      </radialGradient>
    </defs>
    <g id="petalB-shape">
      <path d="M0,-36 C 8,-28 14,-14 0,8 C -12,-10 -8,-26 0,-36 Z" fill="url(#petalB)"/>
    </g>
    <g>
      ${Array.from({length:16},(_,i)=>{
        const rot = i*22.5;
        const scale = (1 - i*0.02).toFixed(2);
        return `<g transform="rotate(${rot}) scale(${scale})"><use href="#petalB-shape"/></g>`;
      }).join('')}
    </g>
    <circle r="10.5" fill="url(#centerB)" class="center-glow"/>
  </svg>`.trim();

  const f3SVG = `
  <svg viewBox="-60 -60 120 120" class="flower-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="petalC" cx="50%" cy="30%">
        <stop offset="0%" stop-color="#ffeaf4"/>
        <stop offset="60%" stop-color="#ffa2cd"/>
        <stop offset="100%" stop-color="#ff74b4"/>
      </radialGradient>
      <radialGradient id="centerC">
        <stop offset="0%" stop-color="#fffad1"/>
        <stop offset="70%" stop-color="#ffe164"/>
        <stop offset="100%" stop-color="#ffc233"/>
      </radialGradient>
    </defs>
    <g id="petalC-shape"><ellipse cx="0" cy="-34" rx="8.5" ry="22" fill="url(#petalC)"/></g>
    <g>
      ${Array.from({length:18},(_,i)=>`<use href="#petalC-shape" transform="rotate(${i*20})"/>`).join('')}
    </g>
    <circle r="9.5" fill="url(#centerC)" class="center-glow"/>
  </svg>`.trim();

  const svgs = [f1SVG, f2SVG, f3SVG];

  const COUNT = 30, COLS = 6, ROWS = 5;
  const cellW = 100 / COLS, cellH = 100 / ROWS;

  let k = 0;
  for(let r=0; r<ROWS; r++){
    for(let c=0; c<COLS; c++){
      const jitterX = (Math.random()*0.5 - 0.25) * cellW;
      const jitterY = (Math.random()*0.5 - 0.25) * cellH;
      const left = (c + 0.5) * cellW + jitterX;
      const top  = (r + 0.5) * cellH + jitterY;
      const base = 9 + Math.random()*5;
      const sizeVmin = base + (Math.sin((c+r)*0.8) * 1.2);
      const depth = (0.06 + (k % 3) * 0.04).toFixed(2);

      const holder = document.createElement('div');
      holder.className = 'flower';
      holder.dataset.depth = depth;
      holder.style.left = `${left}%`;
      holder.style.top  = `${top}%`;
      holder.style.width  = `${sizeVmin}vmin`;
      holder.style.height = `${sizeVmin}vmin`;

      const fwrap = document.createElement('div');
      fwrap.className = 'fwrap';
      const ampX = (3 + Math.random()*7).toFixed(1);
      const ampY = (2 + Math.random()*6).toFixed(1);
      fwrap.style.setProperty('--ax', `${-ampX}px`);
      fwrap.style.setProperty('--ay', `${-ampY}px`);
      fwrap.style.setProperty('--bx', `${ampX}px`);
      fwrap.style.setProperty('--by', `${ampY}px`);
      fwrap.style.setProperty('--rotA', `${(-2 - Math.random()*2).toFixed(1)}deg`);
      fwrap.style.setProperty('--rotB', `${( 2 + Math.random()*2).toFixed(1)}deg`);
      fwrap.style.setProperty('--driftDur', `${(5 + Math.random()*4).toFixed(2)}s`);
      fwrap.style.animationDelay = `${(Math.random()*2).toFixed(2)}s`;

      const img = document.createElement('img');
      img.className = 'flower-svg';
      img.alt = '';
      img.draggable = false;
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgs[k % svgs.length]);

      fwrap.appendChild(img);
      holder.appendChild(fwrap);
      field.appendChild(holder);
      k++;
    }
  }

  window.addEventListener('mousemove', (e)=>{
    const w = window.innerWidth, h = window.innerHeight;
    const nx = (e.clientX / w - 0.5);
    const ny = (e.clientY / h - 0.5);
    document.querySelectorAll('#flower-field .flower').forEach(f=>{
      const depth = parseFloat(f.dataset.depth || 0.08);
      f.style.transform = `translate3d(${nx * 20 * depth}px, ${ny * 14 * depth}px, 0) rotate(${nx * 3 * depth}deg)`;
    });
  });
})();

function closeModalWithConfetti(sourceEl){
  let cx = window.innerWidth/2, cy = window.innerHeight/2;
  if(sourceEl){
    const r = sourceEl.getBoundingClientRect();
    cx = r.left + r.width/2; cy = r.top + r.height/2;
  }
  spawnConfettiAt(cx, cy, 140);
  setTimeout(()=> { modal.classList.add('hidden'); }, 150);
}
hero.addEventListener('click', ()=> closeModalWithConfetti(hero));
hero.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); closeModalWithConfetti(hero);} });
closeBtn.addEventListener('click', ()=> closeModalWithConfetti(closeBtn));

// Hero partikülleri
(function particles(){
  const box = document.getElementById('particles');
  const N = 26;
  for(let i=0;i<N;i++){
    const s = document.createElement('span');
    s.className = 'p';
    s.style.left = (Math.random()*100)+'%';
    s.style.top = (Math.random()*100)+'%';
    s.style.animationDelay = (Math.random()*2)+'s';
    s.style.animationDuration = (4 + Math.random()*3)+'s';
    box.appendChild(s);
  }
  const style = document.createElement('style');
  style.textContent = `
    #particles .p{
      position:absolute; width:8px; height:8px; border-radius:50%;
      background: radial-gradient(circle, #fff 40%, rgba(255,255,255,.0) 70%);
      box-shadow: 0 0 12px rgba(255,255,255,.8), 0 0 28px rgba(255,180,210,.45);
      animation: drift linear infinite; opacity:.75; will-change: transform, opacity;
    }
    @keyframes drift{ 0%{ transform: translateY(0) translateX(0); opacity:.85; } 70%{ opacity:.95; } 100%{ transform: translateY(-40px) translateX(12px); opacity:.2; } }
  `;
  document.head.appendChild(style);
})();

// === Infinite Marquees (üst & alt) ===
(function initMarquees(){
  const lanes = document.querySelectorAll('.marquee .lane');
  lanes.forEach(lane=>{
    const track = lane.querySelector('.track');
    if(!track) return;
    const speed = parseFloat(lane.dataset.speed || 28);
    track.style.setProperty('--dur', `${speed}s`);
    track.innerHTML = track.innerHTML + track.innerHTML; // seamless
    lane.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    lane.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
  });
})();

/* === Timeline verisi (spotify alanı eklendi) === */
const timelineData = [
  { ay: 'Ekim',   num: '19', img: 'images/1.jpeg',  title:'İlk Date 🤍', text:'O günden belliydi bu hikaye dadlu fıstıkım', spotify: 'https://open.spotify.com/embed/track/5MAv1RGwsagnfxgzB1nYqz?utm_source=generator' },
  { ay: 'Kasım',  num: '24', img: 'images/2.jpeg',  title:'Kıpır Kıpır 🤗', text:'Bu gün çekildiğimiz fotoğraflara bakınca içim hep kıpır kıpır oluyor sevgilim', spotify: 'https://open.spotify.com/embed/track/0raPeXeRFHkq1vrLPw6Xj8?utm_source=generator' },
  { ay: 'Aralık', num: '22', img: 'images/3.jpeg',  title:'Gözler Yalan Söylemez 🙂‍↔️', text:'Nasıl da aşık aşık bakıyoruz birbirimize sevgilim', spotify: 'https://open.spotify.com/embed/track/6jQHBTdXEUx7LDjrkEiCax?utm_source=generator' },
  { ay: 'Ocak',   num: '25', img: 'images/4.jpeg',  title:'Vibe 😌', text:"Buradaki vibe'ımıza bayılıyorum aşkım, farklı bi aura var sanki", spotify: 'https://open.spotify.com/embed/track/2LBqCSwhJGcFQeTHMVGwy3?utm_source=generator' },
  { ay: 'Şubat',  num: '23', img: 'images/5.jpeg',  title:'Zorlayıcıydım 🙂‍↕️', text:'Gün boyu bütün huysuzluklarıma katlandığın için teşekkür ederim askiiiim, çok güzel bir gündüüüü', spotify: 'https://open.spotify.com/embed/track/6cjIlxXM1ca6nxkJ0p27jU?utm_source=generator' },
  { ay: 'Mart',   num: '4',  img: 'images/6.jpeg',  title:'Sonsuz Artı Sonsuz ♾️', text:'Seninle geçecek her an benim için = sonsuz artı sonsuz mutluluk askitelaam', spotify: 'https://open.spotify.com/embed/track/0AHY9HLMYcbscA2s4KEiJc?utm_source=generator' },
  { ay: 'Nisan',  num: '28', img: 'images/7.jpeg',  title:'Sesli Sesli 👩🏽‍❤️‍💋‍👨🏻', text:'Seni ömrümün sonuna kadar sesli ve hissli öpmeye hep devam edeceğim yavrum', spotify: 'https://open.spotify.com/embed/track/3FuVKtxVDmWFNJClkTyzmX?utm_source=generator' },
  { ay: 'Mayıs',  num: '2',  img: 'images/8.jpeg',  title:'Bakış 😉', text:'Sana hep böyle uzunca ve aşkla bakacağım hayatımın anlamı', spotify: 'https://open.spotify.com/embed/track/4C2BEVMCOoTRYLQdxumczm?utm_source=generator' },
  { ay: 'Haziran',num: '14', img: 'images/9.jpeg',   title:'Çiçeğim 🌸', text:'Seninle yaptığımız her şey o kadar güzel hissettiriyor ki bana, hep daha fazlasını istiyorum hayatımm', spotify: 'https://open.spotify.com/embed/track/0CAfuar3aEp8q9mKu99al9?utm_source=generator' },
  { ay: 'Haziran',num: '24', img: 'images/10.jpeg', title:'İstanbuull ve Şaşooooluğumuz 🤭', text:'Böyle şaşooo olmamızı çok seviyoruum (magnolya harikaydııı)', spotify: 'https://open.spotify.com/embed/track/62QJlc5UNrMSl8sgIr6BYM?utm_source=generator' },
  { ay: 'Eylül',  num: '1',  img: 'images/11.jpeg', title:'10. Ayımız', text:'Seninle geçen 10 ay o kadar güzeldi ki, hep dediğim gibi nice mutlu aylarımızaaa', spotify: 'https://open.spotify.com/embed/track/5OXHB3ukNhqtJNu47jDdGx?utm_source=generator' },
  { ay: 'Ekim',   num: '12', img: 'images/12.jpeg', title:'Çocuklaaar 🧑‍🧑‍🧒‍🧒', text:'İşte çocuklarımıza göstereceğimiz o fotoğrafımız, çocuklar bakın annenize ne kadar güzel değil miii? Çok şanslıyım anneninze sahip olduğum içiinn', spotify: 'https://open.spotify.com/embed/track/6V38G2xp1nWlRH1Nz1ranJ?utm_source=generator' },
  { ay: 'Kasım',  num: '1',  img: 'images/13.jpg',  title:'Bir Yıl 🤍', text:'Her şeyin başladığı ve devam ettiği günün 1. yılı kutlu olsun aşkım! Seni çok seviyorum', spotify: 'https://open.spotify.com/embed/track/2Tv2XmPGs0A8esmc4gBkX4?utm_source=generator' },
  { ay: 'Şubat',  num: '14', img: 'images/14.jpeg', title:'Sevgililer Günü 💌', text:'Bir gün değil her gün, seninle geçen günüm hep sevgililer günü gibi hissediyorum hayatımmm', spotify: 'https://open.spotify.com/embed/track/2RIeJ5AsGAveACtbnxyyAk?utm_source=generator' },
  { ay: 'Mayıs',  num: '1',  img: 'images/15.jpg',  title:'1.5 Yılımız ♾️', text:'Baaak askimm sen defterini yapmıştıııın, bende dijitalini yapayım dedim. Nice 1.5 yıllarımızaaa', spotify: 'https://open.spotify.com/embed/track/633Y6jn9RSYF8ivr9QDIYH?utm_source=generator' },
  { ay: 'Mayıs',  num: '27', img: 'images/16.jpg',  title:'Şımarmak 🥹', text:'Seninle şöyle şımara şımara vakit geçirmeyi o kadar özledimmm kii', spotify: 'https://open.spotify.com/embed/track/7ghVCUCGqdIyRfcTZyyxU8?utm_source=generator' },
  { ay: 'Haziran',num: '11', img: 'images/17.jpg',  title:'Gülmek 😙', text:'Seninle ömrümün sonuna kadar böyle gülmek istiyoruuumm hayatııım, yol arkadaşım', spotify: 'https://open.spotify.com/embed/track/5n1MwdIRqFtsFO4qp86USa?utm_source=generator' },
  { ay: 'Haziran',num: '18', img: 'images/18.jpg',  title:'İzmiiit 😙', text:"İlk İzmit'e geldiğiiin zamaaan buradaki hayatımı sana göstermek çok hoşuma gitmişti kendi şehrimde bile senin sayende yeni yerler öğrenmiştimmm", spotify: 'https://open.spotify.com/embed/track/5Lzm844Yefk0pwqSWS0T1H?utm_source=generator' },
  { ay: 'Haziran',num: '25', img: 'images/19.jpg',  title:'Haziraan ayı buluşma ayımıız olmusss 🤭', text:"Bana falalelciyi denettiğin gündüü hehehe yine çok turlamıstıkkkkk", spotify: 'https://open.spotify.com/embed/track/2GrTekjkIQyE6fDkdpmjxD?utm_source=generator' },
  { ay: 'Temmuz', num: '12', img: 'images/20.jpg',  title:'Büyükadaaaa', text:"Stajdaan kaçıpp yanına gelmiştimm çok yorulmuştuk hatta terden gebermiştim amaaa çok güzel bi gündüü. Hayatım seninle, en tepeye ulaştığımızda hissettiğimiz rüzgar gibi hissteriyor 🙂‍↔️", spotify: 'https://open.spotify.com/embed/track/5kbX6QlSDGgprK3jVuxGt7?utm_source=generator' },
  { ay: 'Temmuz', num: '21', img: 'images/21.jpg',  title:'Galata Kulesi 💍', text:"Geleceği hep belli olan o gün gelmişti. Hayatımız da inanışta olduğu gibi hep mutlu, mesut ve çok güzel geçecek benim biricik sevgiliiimm", spotify: 'https://open.spotify.com/embed/track/2ipNyTcdbr2oJhNtgE91vD?utm_source=generator' },
  { ay: 'Ağustos',num: '13', img: 'images/22.jpg',  title:'Gülmek 🥲', text:"Yine senin yanında yine çok mutluyuuuumm (keşke bir an önce yanında tekrardan gülebilsem)", spotify: 'https://open.spotify.com/embed/track/5T4DlSBcqRhKdUljhPFb5D?utm_source=generator' },
  { ay: 'Ağustos',num: '31', img: 'images/23.jpg',  title:'Öpmeeek 👩🏽‍❤️‍💋‍👨🏻', text:"Bootcamp'ten sonraki buluşmamız. Seni gelip yine böyle öpmeeeek istiyoooooom çok özlemiştim şu an daha da çok özlediiiimmm", spotify: 'https://open.spotify.com/embed/track/45LpIgOnh3OryDAuYXqTkp?utm_source=generator' },
  { ay: 'Ekim',   num: '2',  img: 'images/24.jpg',  title:'Fıstıkımınn doğum günüsüüü', text:"Canımmm fıstıkımınn doğum günüsünü yanında kutlamak istemiştim amaa olsuun elimizdeki fırsatları değerlenirmek lazım değil miii? Nice mutlu yıllaraaa benim biriciikk sevgiliiimm", spotify: 'https://open.spotify.com/embed/track/20bfCJHvuoPdziZacHdvNe?utm_source=generator' },
  { ay: 'Ekim',   num: '4',  img: 'images/25.jpg',  title:'Gitmeden Önce Son Buluşmamız 🙂‍↕️', text:"Uzun bir süre içindeki son buluşmamız ama ne olursa olsun ben bir sonraki buluşmamızı iplee çekiyorumm sevgiliiimm", spotify: 'https://open.spotify.com/embed/track/27t7YHIlw0u1uVO302wpvD?utm_source=generator' },
  { ay: 'Ekim',   num: '4',  img: 'images/26.jpg',  title:'Gitmeden Önce Son Buluşmamız 🙂‍↕', text:"Bu kadar güzel zamanları bana yaşattığın ve yaşatmaya devam ettiğin için sana teşekkür ederim sevgilim.. Bu zaman kolay olmayacak, olmuyor da ama biz her şeyin üstesinden gelebilecek güce sahipiz bunu sakın unutmaaa. Seni çok ama çok seviyoruuum dadluu fıstıkııımmm 🤍", spotify: 'https://open.spotify.com/embed/track/1UfM6M97SVajxbvRkO9K6f?utm_source=generator"' },
];

(function buildTimeline(){
  const rows = document.getElementById('timelineRows');
  const axis = document.querySelector('.timeline-axis');

  timelineData.forEach((item, idx)=>{
    const isEven = idx % 2 === 0;

    const row = document.createElement('div');
    row.className = 'tl-row';

    // Node (numara + ay)
    const node = document.createElement('div');
    node.className = 'tl-node';
    node.style.top = `calc(${(idx+1) * (100/(timelineData.length+1))}% + 0px)`;
    node.innerHTML = `<span>${item.num}</span><small>${item.ay}</small>`;
    axis.appendChild(node);

    const left = document.createElement('div');
    const right = document.createElement('div');
    left.className = 'tl-left';
    right.className = 'tl-right';

    const media = document.createElement('div');
    media.className = 'tl-media';
    media.innerHTML = `<img src="${item.img}" alt="${item.ay} - ${item.title}">`;

    const card = document.createElement('div');
    card.className = 'tl-card';
    card.innerHTML = `
      <h3>${item.ay} — ${item.title}</h3>
      <p>${item.text}</p>
      <div class="tl-song">
        ${item.spotify ? `
          <iframe
            data-testid="embed-iframe"
            style="border-radius:12px"
            src="${item.spotify}"
            width="100%" height="152" frameBorder="0" allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>` : `<p class="no-song">🎵 Şarkı eklenecek 🎵</p>`}
      </div>
    `;

    if(isEven){ left.appendChild(media); right.appendChild(card); }
    else{ left.appendChild(card); right.appendChild(media); }

    row.appendChild(left);
    row.appendChild(right);
    rows.appendChild(row);
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.tl-row').forEach(r=>observer.observe(r));
})();

// Timeline eksen ilerleme (scroll progress)
(function axisProgress(){
  const sec = document.getElementById('timeline');
  const progress = document.getElementById('axisProgress');
  function onScroll(){
    const rect = sec.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = Math.max(0, vh - rect.top);
    const total = rect.height + vh;
    const pct = Math.min(100, Math.max(0, (start / total) * 100));
    progress.style.height = pct + '%';
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
