import React, { useEffect, useRef, useState, useMemo } from 'react';

/* ── Tech logo roster ── */
const TECH_LOGOS = [
  { slug: 'javascript',  color: 'F7DF1E' },
  { slug: 'typescript',  color: '3178C6' },
  { slug: 'react',       color: '61DAFB' },
  { slug: 'nodedotjs',   color: '339933' },
  { slug: 'html5',       color: 'E34F26' },
  { slug: 'css3',        color: '1572B6' },
  { slug: 'cplusplus',   color: '00599C' },
  { slug: 'python',      color: '3776AB' },
  { slug: 'openjdk',     color: 'ED8B00' },
  { slug: 'mysql',       color: '4479A1' },
  { slug: 'mongodb',     color: '47A248' },
  { slug: 'git',         color: 'F05032' },
  { slug: 'github',      color: 'FFFFFF' },
  { slug: 'docker',      color: '2496ED' },
  { slug: 'amazonaws',   color: 'FF9900' },
  { slug: 'swift',       color: 'F05138' },
  { slug: 'go',          color: '00ADD8' },
  { slug: 'rust',        color: 'DEA584' },
  { slug: 'flutter',     color: '02569B' },
  { slug: 'kotlin',      color: '7F52FF' },
];

/* ── Word sequence ── */
const WORDS             = ['MASTEROS', 'AIM', 'LEARN', 'ACHIEVE'];
const WORD_TRANSITIONS  = [2800, 4000, 5200]; // ms – fade-out starts here

/* ── Seeded PRNG (Murmur3 finaliser mix) for deterministic layouts ── */
function seededRNG(seed) {
  let s = seed | 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= (s >>> 16);
    return (s >>> 0) / 0xffffffff;
  };
}

/* ══════════════════════════════════════════════════════════ */
const PandaLoader = ({ appReady = false, onComplete }) => {
  const [isExiting,          setIsExiting]          = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [isMobile,           setIsMobile]           = useState(window.innerWidth < 768);
  const [currentWord,        setCurrentWord]        = useState(null);
  const [wordVisible,        setWordVisible]        = useState(false);

  const logoRefs  = useRef([]);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);

  /* ── responsive ── */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── minimum animation gate: 4.0 s (full sequence + hold) ── */
  useEffect(() => {
    const t = setTimeout(() => setAnimationCompleted(true), 4000);
    return () => clearTimeout(t);
  }, []);

  /* ── word cycling ── */
  useEffect(() => {
    const timers = [];

    // 1. MASTEROS (0.5s - 1.2s)
    timers.push(setTimeout(() => {
      setCurrentWord(WORDS[0]);
      setWordVisible(true);
    }, 500));

    // 2. AIM (1.5s - 2.0s)
    timers.push(setTimeout(() => {
      setWordVisible(false);
      timers.push(setTimeout(() => {
        setCurrentWord(WORDS[1]);
        setWordVisible(true);
      }, 300));
    }, 1200));

    // 3. LEARN (2.3s - 2.8s)
    timers.push(setTimeout(() => {
      setWordVisible(false);
      timers.push(setTimeout(() => {
        setCurrentWord(WORDS[2]);
        setWordVisible(true);
      }, 300));
    }, 2000));

    // 4. ACHIEVE (3.1s - 3.7s)
    timers.push(setTimeout(() => {
      setWordVisible(false);
      timers.push(setTimeout(() => {
        setCurrentWord(WORDS[3]);
        setWordVisible(true);
      }, 300));
    }, 2800));

    return () => timers.forEach(clearTimeout);
  }, []);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /* ── exit gate: both gates must clear ── */
  useEffect(() => {
    if (animationCompleted && appReady) {
      setIsExiting(true);
      const t = setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [animationCompleted, appReady]);

  /* ── layout constants ── */
  const logoCount   = isMobile ? 14 : 20;
  const logoSize    = isMobile ? 14 : 19;
  const SAFE_RADIUS = isMobile ? 52 : 70;   // px – logo invisible inside this

  /* ── per-logo spiral configs (seeded → deterministic but varied) ── */
  const logoConfigs = useMemo(() => {
    const rng = seededRNG(1337 + logoCount);
    const vw  = window.innerWidth;
    const vh  = window.innerHeight;
    const maxRadius = Math.max(vw, vh) * 0.85;

    // Group logos into 3 major spiral arms
    const ARM_COUNT = 3;
    const lifetime  = 4.2; // seconds for a complete outward journey

    return Array.from({ length: logoCount }, (_, i) => {
      const armIndex = i % ARM_COUNT;
      // Arm base angles: 0, 120, and 240 degrees
      const armBaseAngle = (armIndex * 2 * Math.PI) / ARM_COUNT;
      // Organic jitter around the arm line to make it feel natural
      const armAngle = armBaseAngle + (rng() * 0.22 - 0.11);

      // Stagger the logos along each arm (step * 0.65 seconds)
      const step  = Math.floor(i / ARM_COUNT);
      const delay = step * 0.65 + rng() * 0.05;

      return {
        armAngle,
        targetRadius: maxRadius * (0.88 + rng() * 0.12),
        // Spiral twist along the arm (all twist in the same direction)
        spiralTwist:  2.4, 
        // Arm rotation speed (all rotate together CCW)
        spinSpeed:    0.48, // rad/sec (~13s full revolution)
        lifetime,
        delay,
        maxOpacity:   0.62 + rng() * 0.25,
      };
    });
  }, [logoCount, isMobile, SAFE_RADIUS]);

  /* ── requestAnimationFrame loop ── */
  useEffect(() => {
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = (timestamp - startRef.current) / 1000;

      logoConfigs.forEach((cfg, i) => {
        const el = logoRefs.current[i];
        if (!el) return;

        const t = elapsed - cfg.delay;
        if (t < 0) {
          el.style.opacity = '0';
          return;
        }

        // Loop the travel progress repeatedly
        const progress = (t / cfg.lifetime) % 1.0;

        // Radius expands from center outward (using slight power curve for speed variation)
        const easedR = Math.pow(progress, 1.25);
        const r = SAFE_RADIUS + (cfg.targetRadius - SAFE_RADIUS) * easedR;

        // Spiral theta: arm starting angle + spiral twist along path + continuous galaxy rotation
        const theta = cfg.armAngle + cfg.spiralTwist * progress + cfg.spinSpeed * elapsed;

        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);

        // Fade in as it leaves the center safe zone
        let opacity = 0;
        if (r > SAFE_RADIUS) {
          const fadeIn = Math.min(1, (r - SAFE_RADIUS) / 45);
          opacity = fadeIn * cfg.maxOpacity;
        }

        // Fade out near the viewport edges (progress 0.82 -> 1.0)
        if (progress > 0.82) {
          const fadeOut = Math.max(0, (1 - progress) / 0.18);
          opacity *= fadeOut;
        }

        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        el.style.opacity   = opacity.toFixed(3);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [logoConfigs, SAFE_RADIUS]);

  /* ── typography adjustments per word ── */
  const isBrandWord    = currentWord === 'MASTEROS';
  const wordFontSize   = isMobile ? (isBrandWord ? '13px' : '12px') : (isBrandWord ? '16px' : '14px');
  const wordTracking   = isBrandWord ? '0.32em' : '0.48em';

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        background:     '#050507',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         200,
        overflow:       'hidden',
        userSelect:     'none',
        opacity:        isExiting ? 0 : 1,
        transition:     'opacity 0.8s ease-out',
        pointerEvents:  isExiting ? 'none' : 'auto',
      }}
    >
      {/* ── Logo origin point: zero-size div anchored at screen centre ──
           Each logo is positioned at (−logoSize/2, −logoSize/2) then
           translate3d(x, y, 0) moves it to its spiral destination.       */}
      <div
        style={{
          position: 'absolute',
          top:      '50%',
          left:     '50%',
          width:    0,
          height:   0,
        }}
      >
        {TECH_LOGOS.slice(0, logoCount).map((logo, i) => (
          <div
            key={logo.slug}
            ref={el => { logoRefs.current[i] = el; }}
            style={{
              position:   'absolute',
              left:       -logoSize / 2,
              top:        -logoSize / 2,
              width:      logoSize,
              height:     logoSize,
              opacity:    0,
              willChange: 'transform, opacity',
            }}
          >
            <img
              src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color}`}
              alt=""
              aria-hidden="true"
              style={{
                width:     logoSize,
                height:    logoSize,
                objectFit: 'contain',
                filter:    'saturate(0.72) brightness(0.72)',
                display:   'block',
              }}
              draggable={false}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>

      {/* ── Centre word — layered above every logo ── */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        <span
          style={{
            display:              'block',
            fontFamily:           '"Inter","Outfit",system-ui,-apple-system,sans-serif',
            fontSize:             wordFontSize,
            fontWeight:           700,
            letterSpacing:        wordTracking,
            textTransform:        'uppercase',
            background:           'linear-gradient(180deg,#e4e4e7 0%,#71717a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            filter:               'drop-shadow(0 1px 3px rgba(255,255,255,0.05))',
            opacity:              wordVisible ? 1 : 0,
            transform:            wordVisible ? 'translateY(0px)' : 'translateY(6px)',
            transition:           'opacity 0.32s ease-out, transform 0.32s ease-out, letter-spacing 0.3s ease-out',
            minWidth:             '3ch',
            textAlign:            'center',
            whiteSpace:           'nowrap',
          }}
        >
          {currentWord ?? '\u00A0'}
        </span>
      </div>
    </div>
  );
};

export default PandaLoader;
