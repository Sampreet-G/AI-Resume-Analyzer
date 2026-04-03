import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, ChevronDown, ChevronUp, CheckCircle, XCircle,
  AlertCircle, Briefcase, FileText, Zap, TrendingUp, Star,
  BookOpen, Award, User, Mail, Phone, Link, Sun, Moon, UploadCloud
} from 'lucide-react'

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, dark }) {
  const r = 56, sw = 9
  const nr = r - sw / 2
  const circ = 2 * Math.PI * nr
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#facc15' : '#f87171'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={r * 2} height={r * 2} style={{ display: 'block' }}>
        <circle cx={r} cy={r} r={nr} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} />
        <circle
          cx={r} cy={r} r={nr} fill="none"
          stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${r} ${r})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
        <text x={r} y={r - 4} textAnchor="middle" fill={color}
          fontSize="28" fontWeight="800" fontFamily="'Sora',sans-serif">{score}</text>
        <text x={r} y={r + 16} textAnchor="middle" fill="rgba(255,255,255,0.35)"
          fontSize="11" fontFamily="'Sora',sans-serif">/ 100</text>
      </svg>
    </div>
  )
}

// ─── Sidebar Status Pill ──────────────────────────────────────────────────────
function StatusPill({ score, max }) {
  const pct = Math.round((score / max) * 100)
  if (pct >= 80) return <span style={pillStyle('#4ade80', 'rgba(74,222,128,0.12)')}>Good</span>
  if (pct >= 40) return <span style={pillStyle('#facc15', 'rgba(250,204,21,0.12)')}>Average</span>
  return <span style={pillStyle('#f87171', 'rgba(248,113,113,0.12)')}>Issue</span>
}
const pillStyle = (color, bg) => ({
  background: bg, color,
  border: `1px solid ${color}33`,
  borderRadius: 99, padding: '2px 10px',
  fontSize: 11, fontWeight: 700, letterSpacing: 0.3
})

// ─── Sidebar Row ──────────────────────────────────────────────────────────────
function SidebarRow({ label, score, max, active, onClick, theme }) {
  const pct = Math.round((score / max) * 100)
  const ok = pct >= 80
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '8px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: active ? 'rgba(204,255,0,0.08)' : 'transparent',
        transition: 'background 0.15s', fontFamily: 'inherit',
      }}>
      {ok
        ? <CheckCircle size={14} color="#4ade80" style={{ flexShrink: 0 }} />
        : <XCircle size={14} color="#f87171" style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1, textAlign: 'left', fontSize: 13, color: theme.text, fontWeight: 500, opacity: 0.8 }}>
        {label}
      </span>
      <StatusPill score={score} max={max} />
    </button>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ id, icon, title, score, max, children, defaultOpen = false, theme }) {
  const [open, setOpen] = useState(defaultOpen)
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171'
  return (
    <div id={id} style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 20, overflow: 'hidden', marginBottom: 14,
      transition: 'border-color 0.2s, background 0.4s ease',
    }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '18px 22px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        }}>
        <span style={{
          width: 38, height: 38, borderRadius: 12,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: theme.text, letterSpacing: 0.2 }}>
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 64, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: color, transition: 'width 1s ease' }} />
          </div>
          <span style={{ fontSize: 12, color, fontWeight: 700, minWidth: 32 }}>{score}/{max}</span>
        </div>
        {open
          ? <ChevronUp size={16} color="rgba(255,255,255,0.35)" />
          : <ChevronDown size={16} color="rgba(255,255,255,0.35)" />}
      </button>
      {open && (
        <div style={{ padding: '0 22px 22px', borderTop: `1px solid ${theme.border}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Skill Tag ────────────────────────────────────────────────────────────────
function Tag({ label, variant = 'found' }) {
  const styles = {
    found:   { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
    missing: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.25)' },
    neutral: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.1)' },
  }
  const s = styles[variant]
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 99, padding: '5px 13px',
      fontSize: 12, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      {variant === 'found'   && <CheckCircle size={11} />}
      {variant === 'missing' && <XCircle size={11} />}
      {label}
    </span>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function Bar({ label, value, max, theme }) {
  const pct = Math.round((value / max) * 100)
  const color = pct >= 80 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171'
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: theme.textMuted }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: color, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

// ─── Suggestion Item ──────────────────────────────────────────────────────────
function Suggestion({ text, index }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '13px 16px', borderRadius: 14,
      background: 'rgba(250,204,21,0.04)', border: '1px solid rgba(250,204,21,0.12)',
      marginBottom: 10
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 99, background: 'rgba(250,204,21,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 11, fontWeight: 800, color: '#facc15',
      }}>{index + 1}</div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{text}</p>
    </div>
  )
}

// ─── Info Box ─────────────────────────────────────────────────────────────────
function InfoBox({ icon, label, value, ok, theme }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px',
      borderRadius: 12,
      background: ok ? 'rgba(74,222,128,0.04)' : 'rgba(248,113,113,0.04)',
      border: `1px solid ${ok ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
      marginBottom: 8,
    }}>
      <span style={{ color: ok ? '#4ade80' : '#f87171' }}>{icon}</span>
      <span style={{ fontSize: 13, color: theme.textMuted, minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: 13, color: theme.text, fontWeight: 600, opacity: 0.85 }}>{value || '—'}</span>
      {ok
        ? <CheckCircle size={13} color="#4ade80" style={{ marginLeft: 'auto' }} />
        : <XCircle size={13} color="#f87171" style={{ marginLeft: 'auto' }} />}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state
  const [activeSection, setActiveSection] = useState(null)
  const [dark, setDark] = useState(true)

  const theme = {
    bg:          dark ? '#0A0A0A' : '#F4F7F0',
    bgCard:      dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    border:      dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    text:        dark ? '#ffffff'                : '#0f1a00',
    textMuted:   dark ? 'rgba(255,255,255,0.5)'  : 'rgba(0,0,0,0.5)',
    textFaint:   dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
    navBg:       dark ? 'rgba(10,10,10,0.9)'     : 'rgba(244,247,240,0.9)',
    accent:      '#CCFF00',
    accentText:  '#0A1800',
    tagBg:       dark ? 'rgba(204,255,0,0.08)'   : 'rgba(80,120,0,0.08)',
    tagBorder:   dark ? 'rgba(204,255,0,0.2)'    : 'rgba(80,120,0,0.2)',
    tagText:     dark ? '#CCFF00'                : '#3a6000',
    sidebarBg:   dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    footerBorder: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
  }

  if (!data) {
    return (
      <div style={{
        minHeight: '100vh', background: dark ? '#0A0A0A' : '#F4F7F0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 16,
        fontFamily: "'Sora','Inter',sans-serif"
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No result found.</p>
        <button
          onClick={() => navigate('/upload')}
          style={{
            background: '#CCFF00', color: '#000', border: 'none',
            borderRadius: 14, padding: '12px 28px',
            fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
          }}
        >
          Upload a Resume
        </button>
      </div>
    )
  }

  const bd = data.breakdown || {}
  const maxMap = { Skills: 40, Experience: 20, Projects: 20, Education: 10, Certifications: 10 }
  const scoreColor = data.ats_score >= 70 ? '#4ade80' : data.ats_score >= 40 ? '#facc15' : '#f87171'
  const scoreLabel = data.ats_score >= 70 ? 'Strong Resume' : data.ats_score >= 40 ? 'Average Resume' : 'Needs Improvement'

  const hasEducation   = (bd.Education      || 0) > 0
  const hasExperience  = (bd.Experience     || 0) > 0
  const hasProjects    = (bd.Projects       || 0) > 0
  const hasCerts       = (bd.Certifications || 0) > 0

  const txt       = (data.resume_text || '').toLowerCase()
  const hasEmail  = txt.includes('@')
  const hasPhone  = /\d{10}|\d{3}[-.\s]\d{3}/.test(data.resume_text || '')
  const hasLinkedIn = txt.includes('linkedin')

  const sidebarSections = [
    { id: 'content',     label: 'Content',      score: Math.min((data.skills_found?.length || 0) * 4, 40), max: 40 },
    { id: 'sections',    label: 'Sections',     score: (hasEducation ? 25 : 0) + (hasExperience ? 25 : 0) + (hasProjects ? 25 : 0) + (hasCerts ? 25 : 0), max: 100 },
    { id: 'skills',      label: 'Skills',       score: bd.Skills || 0, max: 40 },
    { id: 'experience',  label: 'Experience',   score: bd.Experience || 0, max: 20 },
    { id: 'suggestions', label: 'Improvements', score: Math.max(0, 10 - (data.suggestions?.length || 0) * 2), max: 10 },
  ]

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg, color: theme.text,
      fontFamily: "'Sora', 'Inter', sans-serif",
      transition: 'background 0.4s ease, color 0.4s ease',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .result-fade { animation: fadeUp 0.5s ease 0.1s both; }
        .result-sidebar-btn:hover { background: rgba(204,255,0,0.06) !important; }
        .result-hero-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(204,255,0,0.3) !important; }
        .result-hero-btn:active { transform: scale(0.97) !important; }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky', top: 0, zIndex: 100,
        background: theme.navBg,
        backdropFilter: 'blur(20px)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>
        <span
          onClick={() => navigate('/')}
          style={{
            fontSize: 22, fontWeight: 900, color: theme.accent,
            letterSpacing: -0.5, cursor: 'pointer',
            textShadow: dark ? '0 0 30px rgba(204,255,0,0.3)' : 'none',
          }}
        >
          ResumeAI
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate('/upload')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 99, padding: '7px 16px',
              color: theme.textMuted, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={14} /> New Analysis
          </button>

          <button
            onClick={() => setDark(d => !d)}
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
              : <><Moon size={15} color="#3a6000" /><span style={{ color: theme.textMuted }}>Dark</span></>}
          </button>
        </div>
      </nav>

      {/* ── LAYOUT ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', maxWidth: 1120, margin: '0 auto',
        padding: '36px 24px', gap: 24, alignItems: 'flex-start',
      }}>

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
        <div className="result-fade" style={{
          width: 230, flexShrink: 0, position: 'sticky', top: 80,
          background: theme.sidebarBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 22, padding: 20,
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}>
          {/* Score */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{
              fontSize: 11, color: theme.textFaint, marginBottom: 12,
              letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
            }}>ATS Score</p>
            <ScoreRing score={data.ats_score} dark={dark} />
            <p style={{
              fontSize: 13, fontWeight: 800, color: scoreColor,
              marginTop: 10, letterSpacing: 0.2,
            }}>{scoreLabel}</p>
            <p style={{ fontSize: 11, color: theme.textFaint, marginTop: 3 }}>
              {data.suggestions?.length || 0} improvement{data.suggestions?.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Predicted role badge */}
          {data.predicted_role && (
            <div style={{
              background: theme.tagBg,
              border: `1px solid ${theme.tagBorder}`,
              borderRadius: 12, padding: '8px 12px',
              marginBottom: 16, textAlign: 'center',
            }}>
              <p style={{ fontSize: 10, color: theme.textFaint, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>Predicted Role</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: theme.tagText, margin: 0 }}>{data.predicted_role}</p>
            </div>
          )}

          <div style={{ height: 1, background: theme.border, marginBottom: 12 }} />

          <p style={{
            fontSize: 10, color: theme.textFaint, letterSpacing: 1.5,
            textTransform: 'uppercase', marginBottom: 8, paddingLeft: 10,
            fontWeight: 700,
          }}>Sections</p>

          {sidebarSections.map(s => (
            <SidebarRow
              key={s.id} label={s.label} score={s.score} max={s.max}
              active={activeSection === s.id} onClick={() => scrollTo(s.id)}
              theme={theme}
            />
          ))}

          <div style={{ height: 1, background: theme.border, margin: '16px 0' }} />

          <button
            onClick={() => navigate('/upload')}
            className="result-hero-btn"
            style={{
              width: '100%', background: theme.accent, color: theme.accentText,
              border: 'none', borderRadius: 14, padding: '11px 0',
              fontWeight: 800, fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: 0.3,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.25s ease',
            }}
          >
            <UploadCloud size={15} /> Analyze Another
          </button>
        </div>

        {/* ── RIGHT CONTENT ─────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header banner */}
          <div className="result-fade" style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(204,255,0,0.06) 0%, rgba(74,222,128,0.04) 100%)'
              : 'linear-gradient(135deg, rgba(100,160,0,0.08) 0%, rgba(50,180,80,0.05) 100%)',
            border: `1px solid ${theme.tagBorder}`,
            borderRadius: 20,
            padding: '22px 26px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 18,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Glow accent */}
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 160, height: 160,
              borderRadius: '50%',
              background: dark ? 'rgba(204,255,0,0.06)' : 'rgba(120,180,0,0.08)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(204,255,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              border: '1px solid rgba(204,255,0,0.2)',
            }}>
              <FileText size={22} color="#CCFF00" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {data.filename}
              </p>
              <p style={{ fontSize: 12, color: theme.textMuted, margin: 0 }}>
                Predicted role:{' '}
                <span style={{ color: theme.accent, fontWeight: 700 }}>{data.predicted_role}</span>
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                {data.ats_score}
              </span>
              <span style={{ fontSize: 14, color: theme.textFaint }}>/100</span>
              <p style={{ fontSize: 11, color: scoreColor, margin: '2px 0 0', fontWeight: 700 }}>{scoreLabel}</p>
            </div>
          </div>

          {/* ── CONTENT QUALITY ─────────────────────────────────── */}
          <SectionCard
            id="content"
            icon={<Star size={17} color="#facc15" />}
            title="Content Quality"
            score={Math.min((data.skills_found?.length || 0) * 4, 40)}
            max={40}
            defaultOpen={true}
            theme={theme}
          >
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>
                Content quality measures how well your resume uses keywords, action verbs, and relevant skills that ATS systems look for.
              </p>
              <Bar label="Skills Detected"      value={bd.Skills     || 0} max={40} theme={theme} />
              <Bar label="Experience Keywords"  value={bd.Experience || 0} max={20} theme={theme} />
              <Bar label="Project Keywords"     value={bd.Projects   || 0} max={20} theme={theme} />
            </div>
          </SectionCard>

          {/* ── SKILLS ──────────────────────────────────────────── */}
          <SectionCard
            id="skills"
            icon={<Zap size={17} color="#818cf8" />}
            title="Skills & Keywords"
            score={bd.Skills || 0}
            max={40}
            defaultOpen={true}
            theme={theme}
          >
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>
                Skills detected in your resume that ATS systems can identify and score.
              </p>

              {data.skills_found?.length > 0 ? (
                <div style={{ marginBottom: 22 }}>
                  <p style={{
                    fontSize: 11, color: theme.textFaint, letterSpacing: 1,
                    textTransform: 'uppercase', marginBottom: 10, fontWeight: 700,
                  }}>Detected ({data.skills_found.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {data.skills_found.map((s, i) => <Tag key={i} label={s} variant="found" />)}
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '14px 16px', borderRadius: 14,
                  background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)',
                  marginBottom: 16,
                }}>
                  <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>
                    No skills detected. Make sure your PDF is text-based, not a scanned image.
                  </p>
                </div>
              )}

              {data.missing_skills?.length > 0 && (
                <div>
                  <p style={{
                    fontSize: 11, color: theme.textFaint, letterSpacing: 1,
                    textTransform: 'uppercase', marginBottom: 10, fontWeight: 700,
                  }}>
                    Missing for {data.predicted_role} ({data.missing_skills.length})
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {data.missing_skills.map((s, i) => <Tag key={i} label={s} variant="missing" />)}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── SECTIONS CHECK ──────────────────────────────────── */}
          <SectionCard
            id="sections"
            icon={<BookOpen size={17} color="#34d399" />}
            title="Resume Sections"
            score={(hasEducation ? 25 : 0) + (hasExperience ? 25 : 0) + (hasProjects ? 25 : 0) + (hasCerts ? 25 : 0)}
            max={100}
            theme={theme}
          >
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>
                Essential sections detected in your resume. Make sure all key sections are clearly labeled.
              </p>
              <InfoBox icon={<BookOpen size={14}  />} label="Education"       value={hasEducation  ? 'Detected' : 'Not found'} ok={hasEducation}  theme={theme} />
              <InfoBox icon={<Briefcase size={14} />} label="Experience"      value={hasExperience ? 'Detected' : 'Not found'} ok={hasExperience} theme={theme} />
              <InfoBox icon={<Star size={14}      />} label="Projects"        value={hasProjects   ? 'Detected' : 'Not found'} ok={hasProjects}   theme={theme} />
              <InfoBox icon={<Award size={14}     />} label="Certifications"  value={hasCerts      ? 'Detected' : 'Not found'} ok={hasCerts}      theme={theme} />
            </div>
          </SectionCard>

          {/* ── CONTACT INFO ────────────────────────────────────── */}
          <SectionCard
            id="contact"
            icon={<User size={17} color="#60a5fa" />}
            title="Contact Information"
            score={(hasEmail ? 40 : 0) + (hasPhone ? 30 : 0) + (hasLinkedIn ? 30 : 0)}
            max={100}
            theme={theme}
          >
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>
                Recruiters need to reach you. Ensure all contact details are present and professional.
              </p>
              <InfoBox icon={<Mail size={14}  />} label="Email"    value={hasEmail    ? 'Found' : 'Not detected'} ok={hasEmail}    theme={theme} />
              <InfoBox icon={<Phone size={14} />} label="Phone"    value={hasPhone    ? 'Found' : 'Not detected'} ok={hasPhone}    theme={theme} />
              <InfoBox icon={<Link size={14}  />} label="LinkedIn" value={hasLinkedIn ? 'Found' : 'Not detected'} ok={hasLinkedIn} theme={theme} />
            </div>
          </SectionCard>

          {/* ── SCORE BREAKDOWN ─────────────────────────────────── */}
          <SectionCard
            id="experience"
            icon={<TrendingUp size={17} color="#f472b6" />}
            title="Score Breakdown"
            score={data.ats_score}
            max={100}
            theme={theme}
          >
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 18, lineHeight: 1.7 }}>
                How each part of your resume contributes to your total ATS score.
              </p>
              {Object.entries(bd).map(([k, v]) => (
                <Bar key={k} label={k} value={v} max={maxMap[k] || 20} theme={theme} />
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 18px', borderRadius: 14, marginTop: 10,
                background: dark ? 'rgba(204,255,0,0.06)' : 'rgba(80,120,0,0.07)',
                border: `1px solid ${theme.tagBorder}`,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Total ATS Score</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: theme.accent }}>
                  {data.ats_score}
                  <span style={{ fontSize: 13, color: theme.textFaint, fontWeight: 500 }}>/100</span>
                </span>
              </div>
            </div>
          </SectionCard>

          {/* ── IMPROVEMENT SUGGESTIONS ──────────────────────────── */}
          <SectionCard
            id="suggestions"
            icon={<AlertCircle size={17} color="#fb923c" />}
            title="Improvement Suggestions"
            score={Math.max(0, 10 - (data.suggestions?.length || 0) * 2)}
            max={10}
            theme={theme}
          >
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>
                Act on these suggestions to boost your ATS score and resume visibility.
              </p>
              {data.suggestions?.map((s, i) => <Suggestion key={i} text={s} index={i} />)}
            </div>
          </SectionCard>

          {/* ── EXTRACTED TEXT PREVIEW ───────────────────────────── */}
          <SectionCard
            id="text"
            icon={<FileText size={17} color={theme.textFaint} />}
            title="Extracted Text Preview"
            score={data.resume_text?.length > 200 ? 10 : 0}
            max={10}
            theme={theme}
          >
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: theme.textFaint, marginBottom: 14 }}>
                First 1000 characters parsed from your PDF.
              </p>
              <div style={{
                background: dark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.04)',
                borderRadius: 14, padding: '16px 18px',
                border: `1px solid ${theme.border}`,
              }}>
                <pre style={{
                  fontSize: 12, color: theme.textMuted, lineHeight: 1.9,
                  whiteSpace: 'pre-wrap', fontFamily: "'SF Mono', 'Fira Code', monospace", margin: 0,
                }}>
                  {data.resume_text}
                </pre>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${theme.footerBorder}`,
        padding: '20px 40px',
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