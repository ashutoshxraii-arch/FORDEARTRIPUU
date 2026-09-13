document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const audio = $('audioPlayer');
  const play = $('playPauseBtn');
  const prev = $('prevSongBtn');
  const next = $('nextSongBtn');
  const sel = $('playlistSelect');
  const title = $('currentTrackTitle');
  const status = $('playerStatus');

  const songs = [
    { title: 'Song 01', file: 'music/song01.mp3' },
    { title: 'Song 02', file: 'music/song02.mp3' },
    { title: 'Song 03', file: 'music/song03.mp3' },
    { title: 'Song 04', file: 'music/song04.mp3' },
    { title: 'Song 05', file: 'music/song05.mp3' },
    { title: 'Song 06', file: 'music/song06.mp3' }
  ];

  let cur = 0;
  let trans = false;
  let fadeInterval = null;

  function loadSong(index) {
    cur = (index + songs.length) % songs.length;
    audio.src = songs[cur].file;
    audio.currentTime = 0;
    audio.load();
    title.textContent = songs[cur].title;
    sel.value = songs[cur].file;
    status.textContent = 'Ready';
  }

  function playCurrentSong() {
    audio.play().then(() => {
      status.textContent = 'Playing';
      play.textContent = 'PAUSE';
    }).catch(() => {
      status.textContent = 'Tap PLAY';
      play.textContent = 'PLAY';
    });
  }

  function transitionToSong(index) {
    if (trans) return;
    trans = true;
    
    clearInterval(fadeInterval);
    let v = audio.volume;

    fadeInterval = setInterval(() => {
      v -= 0.1;
      if (v <= 0.05) {
        clearInterval(fadeInterval);
        audio.volume = 0;
        audio.pause();
        
        loadSong(index);
        
        audio.addEventListener('loadeddata', function onLoaded() {
          audio.removeEventListener('loadeddata', onLoaded);
          audio.currentTime = 0;
          playCurrentSong();
          
          let fadeInV = 0;
          fadeInterval = setInterval(() => {
            fadeInV += 0.1;
            if (fadeInV >= 1) {
              audio.volume = 1;
              clearInterval(fadeInterval);
              trans = false;
            } else {
              audio.volume = fadeInV;
            }
          }, 40);
        }, { once: true });
      } else {
        audio.volume = v;
      }
    }, 40);
  }

  play.onclick = () => {
    if (audio.paused) {
      playCurrentSong();
    } else {
      audio.pause();
      status.textContent = 'Paused';
      play.textContent = 'PLAY';
    }
  };

  next.onclick = () => transitionToSong(cur + 1);
  prev.onclick = () => transitionToSong(cur - 1);
  
  sel.onchange = () => {
    let idx = songs.findIndex(s => s.file === sel.value);
    if (idx > -1) transitionToSong(idx);
  };

  audio.addEventListener('ended', () => {
    transitionToSong(cur + 1);
  });

  audio.volume = 1;
  loadSong(0);

  $('startButton').onclick = () => {
    $('memoryIntro').scrollIntoView({ behavior: 'smooth' });
    if (audio.paused) {
      playCurrentSong();
    }
  };

  document.querySelectorAll('.next-button').forEach(b => {
    b.onclick = () => $(b.dataset.target).scrollIntoView({ behavior: 'smooth' });
  });

  // Unique Emoji Captions Array for photo items
  const emojiCaptions = [
    "❤️✨", "🥰", "🥺🤍", "🙈💖", "🤍", 
    "🏍️💨", "🚂✨", "⏱️🤍", "💌", "🫶✨", 
    "👑💖", "🧸", "🌷", "✨💖", "🤍🌸", 
    "😂❤️", "👀✨", "🥹🫶", "🍫✨", "🌙🤍", 
    "🌻", "📸✨", "🥂🤍", "🪐✨", "🍀", 
    "🐣💖", "💫", "💭🤍", "🦋✨", "🎂💖", 
    "💖", "✨", "🤍✨", "🥰✨", "🙈❤️", 
    "🕊️🤍", "🧁✨", "🌸", "🫧✨", "🎀💖", 
    "☕🤍", "🎈✨", "🧸❤️", "⭐✨", "🫰💖", 
    "🌆🤍", "💎✨", "🍓💖", "🪄✨", "🫠🤍", 
    "🫶", "💫💖", "🎶🤍", "❄️✨", "🍁🤍", 
    "🍦💖", "🏖️✨", "🍿❤️", "🎡✨", "💌💖", 
    "💖✨", "🤍👑", "🥹❤️", "✨🧸", "🌸🤍", 
    "😂🤍", "🙈✨", "🫰❤️", "🧋✨", "🕯️🤍", 
    "🌻✨", "🌙💖", "✨🕊️", "🌷🤍", "🎂✨", 
    "💫🤍", "🫧💖", "💖🥹", "📸🤍", "🍰✨", 
    "✨❤️", "🤍🧸", "🥰🤍", "⭐💖", "🍫🤍", 
    "🐣✨", "✨🌷", "🥂💖", "☕✨", "🍀🤍", 
    "🎀✨", "💭💖", "🫠✨", "🫰🤍", "💌✨", 
    "✨👑", "🤍🌻", "🦋🤍", "🪄💖", "🎈🤍", 
    "🧁🤍", "🕊️✨", "✨🍓", "🌸💖", "⭐🤍", 
    "🌊✨", "🧸✨", "✨🫰", "💫✨", "❤️🔥"
  ];

  const photoGrid = $('photoGrid');
  for (let n = 1; n <= 120; n++) {
    let p = `images/${String(n).padStart(3, '0')}.jpg`;
    let c = document.createElement('div');
    c.className = 'polaroid-card';
    c.style.setProperty('--r', `${Math.random() * 4 - 2}deg`);

    let im = new Image();
    im.src = p;
    im.loading = 'lazy';

    let tx = document.createElement('p');
    tx.textContent = emojiCaptions[(n - 1) % emojiCaptions.length];
    tx.style.fontSize = '1.3rem';

    im.onerror = () => c.remove();
    im.onload = () => {
      c.onclick = () => {
        $('lightboxImage').src = p;
        $('lightboxCaption').textContent = tx.textContent;
        $('lightbox').classList.add('active');
      };
    };

    c.append(im, tx);
    photoGrid.append(c);
  }

  $('closeLightbox').onclick = () => $('lightbox').classList.remove('active');
  $('lightbox').onclick = e => {
    if (e.target === $('lightbox')) $('lightbox').classList.remove('active');
  };

  // Who Said It Game
  const who = [
    ['“Main kyun hoon na?”', 'Ashu'],
    ['“Main hi hoon, aap kahan?”', 'Ashu'],
    ['“Main nahi, AAP.”', 'Ashu'],
    ['Sneak-out mein pakde jaana kiski legendary memory hai?', 'Chaos']
  ];
  let wi = 0, score = 0;

  function renderWho() {
    if (wi >= who.length) {
      $('whoQuestion').textContent = `Score: ${score}/${who.length} — Certified Tripu™`;
      $('whoAnswers').innerHTML = '';
      return;
    }
    $('whoQuestion').textContent = who[wi][0];
    $('whoAnswers').innerHTML = '';
    ['Ashu', 'Tripu'].forEach(x => {
      let b = document.createElement('button');
      b.textContent = x;
      b.onclick = () => {
        if (who[wi][1] === 'Chaos') {
          $('whoFeedback').textContent = '😂 Trick question. The real answer: chaos.';
        } else if (x === who[wi][1]) {
          score++;
          $('whoFeedback').textContent = '✓ Correct.';
        } else {
          $('whoFeedback').textContent = '❌ Close enough.';
        }
        setTimeout(() => { wi++; renderWho(); }, 650);
      };
      $('whoAnswers').append(b);
    });
  }
  renderWho();

  // Ashu.exe Diagnostic Game
  const diag = [
    'Scanning personality…',
    'Overthinking: 99%',
    '“Main kyun hoon na?” module: CRITICAL',
    'Sneak-out survival: FAILED',
    'Common sense: NOT FOUND',
    'Tripu irritation level: EXPERT',
    'Conclusion: Ashu.exe has stopped working.'
  ];
  $('diagnoseBtn').onclick = () => {
    let box = $('terminalText');
    box.textContent = '';
    diag.forEach((x, i) => setTimeout(() => box.innerHTML += x + '<br>', i * 430));
  };

  // Random Memory Generator
  const mem = [
    '🚂 Railway Museum — one frame, a quiet moment.',
    '🏍️ That bike incident that did not go according to plan.',
    '😂 “Bulāte bulāte” — a tiny phrase that stuck.',
    '🎵 Valam — filed under the memory soundtrack.',
    '🤍 Simple everyday conversations.',
    '🫶 Being treated like a little kid — funny and comforting.',
    '⏱️ The 5-minute rule: making time even on busy days.',
    '🕵️ Sneak-out chaos — one for the archives.'
  ];
  $('memoryBtn').onclick = () => $('randomMemory').textContent = mem[Math.floor(Math.random() * mem.length)];

  // Roast Ashu
  const roasts = [
    'Overthinking level: somehow even the calculator needs a break.',
    'You can turn a 2-minute situation into a full documentary.',
    'Common sense tried to connect… connection timed out.',
    'Breaking news: Ashu has once again made things unnecessarily complicated.',
    'You are the director, editor and unnecessary plot twist. 😂'
  ];
  $('roastBtn').onclick = () => $('roastText').textContent = roasts[Math.floor(Math.random() * roasts.length)];

  // Hidden 3 Game
  let found = 0;
  for (let i = 0; i < 3; i++) {
    let s = document.createElement('span');
    s.className = 'hidden-secret';
    s.textContent = '3';
    s.style.left = 10 + Math.random() * 80 + '%';
    s.style.top = 18 + Math.random() * 65 + 'vh';
    document.body.append(s);
    s.onclick = () => {
      s.remove();
      found++;
      $('foundCount').textContent = found;
      $('hiddenHint').textContent = found < 3 ? `FOUND ${found}/3 ✦` : '🔓 Secret unlocked!';
    };
  }

  $('finalButton').onclick = () => {
    $('birthday').scrollIntoView({ behavior: 'smooth' });
  };

  // Birthday Cake Game
  let candles = 3;
  document.querySelectorAll('.candle').forEach(c => c.onclick = () => {
    if (c.classList.contains('off')) return;
    c.classList.add('off');
    candles--;
    $('cakeStatus').textContent = candles ? `${candles} candle${candles === 1 ? '' : 's'} remaining.` : '🎉 Birthday mission complete!';
    if (!candles) {
      $('toast').textContent = 'Birthday unlocked 🎂';
      $('toast').classList.add('show');
    }
  });

  // Scroll Reveal Animations
  const obs = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(x => obs.observe(x));
});