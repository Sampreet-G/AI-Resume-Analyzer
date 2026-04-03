import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, FileText, X, ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react'
import API from '../services/api'

// ── Particle canvas background (same as Home) ─────────────────────────────────
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
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
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
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${PARTICLE_COLOR},0.5)`
        ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const handleResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize) }
  }, [dark])
  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0
    }} />
  )
}

// ── Floating orbs ─────────────────────────────────────────────────────────────
function Orbs({ dark }) {
  return (
    <>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(204,255,0,0.06) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(150,200,0,0.09) 0%, transparent 70%)',
        top: -100, right: -100, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat1 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: 350, height: 350, borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(100,255,150,0.04) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(80,180,100,0.07) 0%, transparent 70%)',
        bottom: 0, left: -80, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat2 10s ease-in-out infinite'
      }} />
    </>
  )
}

export default function UploadResume() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [drag, setDrag] = useState(false)
  const [dark, setDark] = useState(true)
  const navigate = useNavigate()

  const theme = {
    bg:          dark ? '#0A0A0A' : '#F4F7F0',
    bgCard:      dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    border:      dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    borderHover: dark ? 'rgba(204,255,0,0.35)'   : 'rgba(80,120,0,0.35)',
    text:        dark ? '#ffffff'                : '#0f1a00',
    textMuted:   dark ? 'rgba(255,255,255,0.5)'  : 'rgba(0,0,0,0.5)',
    textFaint:   dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
    navBg:       dark ? 'rgba(10,10,10,0.9)'     : 'rgba(244,247,240,0.9)',
    accent:      '#CCFF00',
    accentText:  '#0A1800',
    tagBg:       dark ? 'rgba(204,255,0,0.08)'   : 'rgba(80,120,0,0.08)',
    tagBorder:   dark ? 'rgba(204,255,0,0.2)'    : 'rgba(80,120,0,0.2)',
    tagText:     dark ? '#CCFF00'                : '#3a6000',
    footerBorder: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    dropBg:      dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
    dropBgHover: dark ? 'rgba(204,255,0,0.05)'   : 'rgba(80,120,0,0.05)',
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type === 'application/pdf') setFile(dropped)
    else alert('Please drop a PDF file')
  }

  const handleUpload = async () => {
    if (!file) return alert('Please select a PDF file')
    const formData = new FormData()
    formData.append('file', file)
    try {
      setLoading(true)
      const response = await API.post('/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate('/result', { state: response.data })
    } catch (err) {
      console.error(err)
      alert('Upload failed. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
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
          50%     { transform: translate(-30px, 30px) scale(1.06); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(30px, -40px) scale(1.05); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .upload-hero-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 40px rgba(204,255,0,0.35) !important; }
        .upload-hero-btn:active { transform: scale(0.97) !important; }
        .upload-hero-btn:disabled { opacity: 0.4 !important; transform: none !important; box-shadow: none !important; cursor: not-allowed !important; }
        .fade-u1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-u2 { animation: fadeUp 0.7s ease 0.25s both; }
        .fade-u3 { animation: fadeUp 0.7s ease 0.4s both; }
        .drop-zone { transition: border-color 0.3s ease, background 0.3s ease, transform 0.2s ease; }
        .drop-zone:hover { transform: translateY(-2px); }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky', top: 0, zIndex: 100,
        background: theme.navBg,
        backdropFilter: 'blur(20px)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <span style={{
            fontSize: 22, fontWeight: 900, color: theme.accent,
            letterSpacing: -0.5,
            textShadow: dark ? '0 0 30px rgba(204,255,0,0.3)' : 'none',
          }}>
            ResumeAI
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 99, padding: '7px 14px',
              color: theme.textMuted, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

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
              ? <><Sun size={15} color="#CCFF00" /><span style={{ color: theme.textMuted }}>Light</span></>
              : <><Moon size={15} color="#3a6000" /><span style={{ color: theme.textMuted }}>Dark</span></>
            }
          </button>
        </div>
      </nav>

      {/* ── MAIN SECTION ────────────────────────────────────────────────────── */}
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
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 560,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>

          {/* Badge */}
          <div className="fade-u1" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: theme.tagBg,
            border: `1px solid ${theme.tagBorder}`,
            color: theme.tagText,
            borderRadius: 99, padding: '7px 18px', marginBottom: 28,
            fontSize: 13, fontWeight: 600,
          }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: theme.tagText, opacity: 0.4,
                animation: 'pulseRing 1.5s ease-out infinite',
              }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.tagText, display: 'block' }} />
            </span>
            <Sparkles size={14} />
            Step 1 of 2 — Upload Your Resume
          </div>

          {/* Heading */}
          <h1 className="fade-u2" style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900, letterSpacing: -1.5,
            lineHeight: 1.1, margin: '0 0 16px',
            color: theme.text, textAlign: 'center',
          }}>
            Drop Your Resume.
            <br />
            <span style={{
              color: theme.accent,
              textShadow: dark ? '0 0 60px rgba(204,255,0,0.25)' : 'none',
            }}>
              We'll Do the Rest.
            </span>
          </h1>

          <p className="fade-u2" style={{
            fontSize: 15, color: theme.textMuted,
            lineHeight: 1.7, marginBottom: 40,
            textAlign: 'center', maxWidth: 400,
          }}>
            Upload a PDF resume and get instant ATS scoring, role prediction, and skill gap analysis.
          </p>

          {/* Drop Zone */}
          <div className="fade-u3" style={{ width: '100%' }}>
            <div
              className="drop-zone"
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
              style={{
                background: drag ? theme.dropBgHover : theme.dropBg,
                border: `1.5px dashed ${drag ? theme.accent : (file ? theme.accent : theme.border)}`,
                borderRadius: 24,
                padding: '48px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: 16,
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Scan line when file loaded */}
              {file && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                  animation: 'scanLine 3s linear infinite',
                  opacity: 0.4,
                }} />
              )}

              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: `${theme.accent}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${theme.accent}33`,
                  }}>
                    <FileText size={28} color={theme.accent} />
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: '0 0 4px' }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: 13, color: theme.textMuted, margin: 0 }}>
                      {(file.size / 1024).toFixed(1)} KB · PDF
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                      borderRadius: 99, padding: '5px 14px',
                      color: '#f87171', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <X size={12} /> Remove file
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 22,
                    background: `${theme.accent}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${theme.accent}22`,
                    transition: 'all 0.3s ease',
                  }}>
                    <UploadCloud size={32} color={theme.accent} />
                  </div>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: theme.text, margin: '0 0 6px' }}>
                      {drag ? 'Drop it here!' : 'Drag & drop your resume'}
                    </p>
                    <p style={{ fontSize: 13, color: theme.textMuted, margin: 0 }}>
                      or click to browse · PDF only
                    </p>
                  </div>
                  {/* Format chips */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['PDF'].map(fmt => (
                      <span key={fmt} style={{
                        fontSize: 11, fontWeight: 700,
                        background: theme.tagBg,
                        border: `1px solid ${theme.tagBorder}`,
                        color: theme.tagText,
                        borderRadius: 99, padding: '4px 12px',
                      }}>{fmt} supported</span>
                    ))}
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      background: theme.bgCard,
                      border: `1px solid ${theme.border}`,
                      color: theme.textMuted,
                      borderRadius: 99, padding: '4px 12px',
                    }}>Max 10MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="upload-hero-btn"
              style={{
                width: '100%',
                background: theme.accent, color: theme.accentText,
                border: 'none', borderRadius: 16,
                padding: '17px 36px', fontSize: 16, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.25s ease',
                letterSpacing: 0.3,
                boxShadow: dark ? '0 4px 24px rgba(204,255,0,0.2)' : '0 4px 24px rgba(100,150,0,0.2)',
              }}
            >
              {loading ? (
                <>
                  <svg
                    style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
                    width={20} height={20} viewBox="0 0 24 24" fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Analyzing your resume...
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  Upload &amp; Analyze Resume
                </>
              )}
            </button>

            {/* Trust hints */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 20,
              marginTop: 18, flexWrap: 'wrap',
            }}>
              {['🔒 Private & secure', '⚡ Results in ~30s', '✨ ML-powered'].map((hint, i) => (
                <span key={i} style={{ fontSize: 12, color: theme.textFaint, fontWeight: 500 }}>
                  {hint}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${theme.footerBorder}`,
        padding: '20px 48px',
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