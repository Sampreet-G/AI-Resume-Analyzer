import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles, FileText, Brain, ShieldCheck, Zap, Sun, Moon } from 'lucide-react'

// ── Particle canvas background ────────────────────────────────────────────────
function ParticleCanvas({ dark }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const PARTICLE_COLOR = dark ? '204,255,0' : '80,120,0'
    const LINE_COLOR = dark ? '204,255,0' : '100,140,20'

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${LINE_COLOR},${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.8
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      // Draw particles
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${PARTICLE_COLOR},0.5)`
        ctx.fill()
        // Move
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [dark])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0
      }}
    />
  )
}

// ── Floating orbs ─────────────────────────────────────────────────────────────
function Orbs({ dark }) {
  return (
    <>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(204,255,0,0.07) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(150,200,0,0.1) 0%, transparent 70%)',
        top: -100, left: -100, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat1 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(100,255,150,0.05) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(80,180,100,0.08) 0%, transparent 70%)',
        bottom: 50, right: -80, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat2 10s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: 250, height: 250, borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(204,255,0,0.04) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(180,220,0,0.07) 0%, transparent 70%)',
        top: '40%', right: '20%', pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat3 12s ease-in-out infinite'
      }} />
    </>
  )
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const step = Math.ceil(target / 60)
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setCount(target); clearInterval(timer) }
          else setCount(start)
        }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const features = [
  {
    icon: <FileText size={24} />,
    title: 'Resume Parsing',
    desc: 'Extracts skills, education, projects and experience from your PDF instantly.',
    color: '#CCFF00',
  },
  {
    icon: <Brain size={24} />,
    title: 'Role Prediction',
    desc: 'ML model predicts your most suitable job role based on your full resume.',
    color: '#4ade80',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'ATS Scoring',
    desc: 'Real ML-based ATS score so recruiters can find your resume easily.',
    color: '#60a5fa',
  },
  {
    icon: <Zap size={24} />,
    title: 'Skill Gap Analysis',
    desc: 'Detects missing skills for your role and gives personalised suggestions.',
    color: '#f472b6',
  },
]

const stats = [
  { value: 10000, suffix: '+', label: 'Resumes Analyzed' },
  { value: 95,    suffix: '%', label: 'Accuracy Rate' },
  { value: 30,    suffix: 's', label: 'Avg Analysis Time' },
]

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)

  const theme = {
    bg:         dark ? '#0A0A0A' : '#F4F7F0',
    bgCard:     dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    border:     dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    borderHover:dark ? 'rgba(204,255,0,0.3)'    : 'rgba(80,120,0,0.3)',
    text:       dark ? '#ffffff'                : '#0f1a00',
    textMuted:  dark ? 'rgba(255,255,255,0.5)'  : 'rgba(0,0,0,0.5)',
    textFaint:  dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
    navBg:      dark ? 'rgba(10,10,10,0.9)'     : 'rgba(244,247,240,0.9)',
    accent:     '#CCFF00',
    accentText: '#0A1800',
    statBg:     dark ? 'rgba(204,255,0,0.05)'   : 'rgba(80,120,0,0.06)',
    statBorder: dark ? 'rgba(204,255,0,0.12)'   : 'rgba(80,120,0,0.15)',
    tagBg:      dark ? 'rgba(204,255,0,0.08)'   : 'rgba(80,120,0,0.08)',
    tagBorder:  dark ? 'rgba(204,255,0,0.2)'    : 'rgba(80,120,0,0.2)',
    tagText:    dark ? '#CCFF00'                : '#3a6000',
    footerBorder: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
  }

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg, color: theme.text,
      fontFamily: "'Sora', 'Inter', sans-serif",
      transition: 'background 0.4s ease, color 0.4s ease',
      overflowX: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(40px, 30px) scale(1.08); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-30px, -40px) scale(1.05); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(20px, 25px); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        .hero-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 40px rgba(204,255,0,0.35) !important; }
        .hero-btn:active { transform: scale(0.97) !important; }
        .feature-card:hover { transform: translateY(-4px); border-color: var(--hover-border) !important; }
        .feature-card { transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease; }
        .fade-a1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-a2 { animation: fadeUp 0.7s ease 0.25s both; }
        .fade-a3 { animation: fadeUp 0.7s ease 0.4s both; }
        .fade-a4 { animation: fadeUp 0.7s ease 0.55s both; }
        .fade-a5 { animation: fadeUp 0.7s ease 0.7s both; }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky', top: 0, zIndex: 100,
        background: theme.navBg,
        backdropFilter: 'blur(20px)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>
        {/* Logo */}
        <span style={{
          fontSize: 22, fontWeight: 900, color: theme.accent,
          letterSpacing: -0.5, cursor: 'pointer',
          textShadow: dark ? '0 0 30px rgba(204,255,0,0.3)' : 'none',
        }}>
          ResumeAI
        </span>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Dark/Light toggle */}
          <button
            onClick={() => setDark(d => !d)}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 99, padding: '7px 14px',
              color: theme.text, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            {dark
              ? <><Sun size={15} color="#CCFF00" /> <span style={{ color: theme.textMuted }}>Light</span></>
              : <><Moon size={15} color="#3a6000" /> <span style={{ color: theme.textMuted }}>Dark</span></>
            }
          </button>

          {/* CTA */}
          <button
            onClick={() => navigate('/upload')}
            className="hero-btn"
            style={{
              background: theme.accent, color: theme.accentText,
              border: 'none', borderRadius: 12, padding: '9px 20px',
              fontWeight: 800, fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: 0.3,
              transition: 'all 0.25s ease',
            }}
          >
            Try Free →
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 48px',
      }}>
        <ParticleCanvas dark={dark} />
        <Orbs dark={dark} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: dark
            ? 'linear-gradient(rgba(204,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,80,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,80,0,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{
          position: 'relative', zIndex: 1, maxWidth: 860,
          width: '100%', textAlign: 'center',
        }}>

          {/* Badge */}
          <div className="fade-a1" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: theme.tagBg,
            border: `1px solid ${theme.tagBorder}`,
            color: theme.tagText,
            borderRadius: 99, padding: '7px 18px', marginBottom: 32,
            fontSize: 13, fontWeight: 600,
          }}>
            {/* Pulse dot */}
            <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: theme.tagText, opacity: 0.4,
                animation: 'pulseRing 1.5s ease-out infinite',
              }} />
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: theme.tagText, display: 'block',
              }} />
            </span>
            <Sparkles size={14} />
            AI-Powered Resume Analysis — Free
          </div>

          {/* Headline */}
          <h1 className="fade-a2" style={{
            fontSize: 'clamp(40px, 7vw, 76px)',
            fontWeight: 900, lineHeight: 1.08,
            letterSpacing: -2, margin: '0 0 24px',
            color: theme.text,
          }}>
            Upload Your Resume.
            <br />
            <span style={{
              color: theme.accent,
              textShadow: dark ? '0 0 60px rgba(204,255,0,0.25)' : 'none',
            }}>
              Get Smart Insights.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="fade-a3" style={{
            fontSize: 18, color: theme.textMuted,
            lineHeight: 1.7, maxWidth: 560,
            margin: '0 auto 40px',
          }}>
            Instant ATS scoring, ML-based role prediction, skill gap analysis,
            and improvement suggestions — in under 30 seconds.
          </p>

          {/* CTA buttons */}
          <div className="fade-a4" style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <button
              onClick={() => navigate('/upload')}
              className="hero-btn"
              style={{
                background: theme.accent, color: theme.accentText,
                border: 'none', borderRadius: 16,
                padding: '16px 36px', fontSize: 16, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.25s ease',
                boxShadow: dark ? '0 4px 24px rgba(204,255,0,0.2)' : '0 4px 24px rgba(100,150,0,0.2)',
              }}
            >
              Analyze My Resume
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: 16, padding: '16px 30px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', color: theme.textMuted,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted }}
            >
              See How It Works
            </button>
          </div>

          {/* Floating resume mockup */}
          <div className="fade-a5" style={{
            marginTop: 64, position: 'relative',
            display: 'inline-block', width: '100%', maxWidth: 520,
          }}>
            {/* Glow behind card */}
            <div style={{
              position: 'absolute', inset: -20, borderRadius: 32,
              background: dark
                ? 'radial-gradient(ellipse, rgba(204,255,0,0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse, rgba(100,160,0,0.1) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }} />

            {/* Mock resume card */}
            <div style={{
              position: 'relative',
              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
              border: `1px solid ${theme.border}`,
              borderRadius: 24, padding: '28px 32px',
              backdropFilter: 'blur(20px)',
              textAlign: 'left',
              overflow: 'hidden',
            }}>
              {/* Scan line animation */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                animation: 'scanLine 3s linear infinite',
                opacity: 0.4,
              }} />

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ width: 120, height: 14, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', marginBottom: 6 }} />
                  <div style={{ width: 80, height: 10, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
                </div>
                {/* ATS badge */}
                <div style={{
                  background: theme.tagBg, border: `1px solid ${theme.tagBorder}`,
                  borderRadius: 12, padding: '8px 14px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: theme.accent, lineHeight: 1 }}>78</div>
                  <div style={{ fontSize: 10, color: theme.tagText, fontWeight: 600 }}>ATS Score</div>
                </div>
              </div>

              {/* Skill bars */}
              {[
                { label: 'Skills', pct: 85, color: '#4ade80' },
                { label: 'Experience', pct: 60, color: '#facc15' },
                { label: 'Projects', pct: 75, color: '#60a5fa' },
                { label: 'Education', pct: 100, color: '#4ade80' },
              ].map((b, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>{b.label}</span>
                    <span style={{ fontSize: 12, color: b.color, fontWeight: 700 }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
                    <div style={{
                      width: `${b.pct}%`, height: '100%', borderRadius: 99,
                      background: b.color, transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))}

              {/* Role tag */}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                {['Python Developer', 'Full Stack', 'ML Engineer'].map((t, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 700,
                    background: i === 0 ? theme.tagBg : dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${i === 0 ? theme.tagBorder : theme.border}`,
                    color: i === 0 ? theme.tagText : theme.textMuted,
                    borderRadius: 99, padding: '4px 10px',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <section style={{
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        padding: '40px 48px',
        background: theme.statBg,
        transition: 'background 0.4s ease',
      }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24, textAlign: 'center',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '20px 16px',
              border: `1px solid ${theme.statBorder}`,
              borderRadius: 16,
              background: dark ? 'rgba(204,255,0,0.03)' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.4s ease',
            }}>
              <div style={{
                fontSize: 38, fontWeight: 900, color: theme.accent,
                letterSpacing: -1, lineHeight: 1,
                textShadow: dark ? '0 0 30px rgba(204,255,0,0.2)' : 'none',
              }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', color: theme.tagText,
              display: 'block', marginBottom: 14,
            }}>
              What We Analyze
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900,
              letterSpacing: -1, margin: 0, color: theme.text,
            }}>
              Everything Your Resume Needs
            </h2>
            <p style={{
              fontSize: 16, color: theme.textMuted, marginTop: 14,
              lineHeight: 1.7, maxWidth: 480, margin: '14px auto 0',
            }}>
              Our ML model analyzes every aspect of your resume against thousands of real resumes.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16,
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  '--hover-border': f.color + '44',
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20, padding: '28px 28px',
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: f.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: 18,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 8px', color: theme.text }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.7, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section style={{
        padding: '80px 48px',
        borderTop: `1px solid ${theme.border}`,
        background: dark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)',
        transition: 'background 0.4s ease',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase', color: theme.tagText,
            display: 'block', marginBottom: 14,
          }}>
            How It Works
          </span>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900,
            letterSpacing: -1, margin: '0 0 56px', color: theme.text,
          }}>
            3 Steps to a Better Resume
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { step: '01', title: 'Upload PDF', desc: 'Drag & drop your resume PDF. We support all standard formats.' },
              { step: '02', title: 'AI Analysis', desc: 'Our ML model parses and scores every section of your resume.' },
              { step: '03', title: 'Get Report', desc: 'Instant ATS score, role prediction, skill gaps, and suggestions.' },
            ].map((s, i) => (
              <div key={i} style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 20, padding: '32px 24px',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Big step number background */}
                <div style={{
                  position: 'absolute', top: -10, right: 10,
                  fontSize: 80, fontWeight: 900, color: theme.accent,
                  opacity: 0.05, lineHeight: 1, userSelect: 'none',
                  fontFamily: "'Sora', sans-serif",
                }}>
                  {s.step}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: theme.accent,
                  marginBottom: 12, letterSpacing: 1,
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: theme.text }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.7, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(204,255,0,0.07) 0%, rgba(74,222,128,0.04) 100%)'
              : 'linear-gradient(135deg, rgba(100,160,0,0.08) 0%, rgba(50,180,80,0.05) 100%)',
            border: `1px solid ${theme.tagBorder}`,
            borderRadius: 28, padding: '56px 48px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200,
              borderRadius: '50%',
              background: dark ? 'rgba(204,255,0,0.05)' : 'rgba(120,180,0,0.07)',
              filter: 'blur(40px)',
            }} />
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900,
              margin: '0 0 16px', letterSpacing: -1, color: theme.text,
            }}>
              Ready to Beat the ATS?
            </h2>
            <p style={{
              fontSize: 16, color: theme.textMuted, margin: '0 0 32px',
              lineHeight: 1.7, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Upload your resume now and get a detailed ML-powered analysis in seconds.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="hero-btn"
              style={{
                background: theme.accent, color: theme.accentText,
                border: 'none', borderRadius: 16,
                padding: '16px 40px', fontSize: 16, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 0.25s ease',
              }}
            >
              Analyze My Resume Free
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${theme.footerBorder}`,
        padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        transition: 'border-color 0.4s ease',
      }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: theme.accent }}>ResumeAI</span>
        <span style={{ fontSize: 13, color: theme.textFaint }}>
          © 2026 ResumeAI · Built with FastAPI + React + ML
        </span>
        <button
          onClick={() => setDark(d => !d)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: `1px solid ${theme.border}`,
            borderRadius: 99, padding: '6px 14px',
            color: theme.textMuted, fontSize: 12,
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          {dark ? <><Sun size={13} /> Light mode</> : <><Moon size={13} /> Dark mode</>}
        </button>
      </footer>

    </div>
  )
}