import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, ChevronDown, ChevronUp, CheckCircle, XCircle,
  AlertCircle, Briefcase, FileText, Zap, TrendingUp, Star,
  BookOpen, Award, User, Mail, Phone, Link
} from 'lucide-react'

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 52, sw = 8
  const nr = r - sw / 2
  const circ = 2 * Math.PI * nr
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#facc15' : '#f87171'
  const bg = score >= 70 ? '#052e16' : score >= 40 ? '#422006' : '#2d0a0a'
  return (
    <div className="flex flex-col items-center">
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
          fontSize="26" fontWeight="800" fontFamily="'Sora',sans-serif">{score}</text>
        <text x={r} y={r + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)"
          fontSize="10" fontFamily="'Sora',sans-serif">/ 100</text>
      </svg>
    </div>
  )
}

// ─── Sidebar Status Pill ───────────────────────────────────────────────────────
function StatusPill({ score, max }) {
  const pct = Math.round((score / max) * 100)
  if (pct >= 80) return <span style={pillStyle('#4ade80', '#052e16')}>Good</span>
  if (pct >= 40) return <span style={pillStyle('#facc15', '#422006')}>Average</span>
  return <span style={pillStyle('#f87171', '#2d0a0a')}>Issue</span>
}
const pillStyle = (color, bg) => ({
  background: bg, color, border: `1px solid ${color}33`,
  borderRadius: 99, padding: '1px 9px', fontSize: 11, fontWeight: 700, letterSpacing: 0.3
})

// ─── Sidebar Row ──────────────────────────────────────────────────────────────
function SidebarRow({ label, score, max, active, onClick }) {
  const pct = Math.round((score / max) * 100)
  const ok = pct >= 80
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '7px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
        transition: 'background 0.15s'
      }}>
      {ok
        ? <CheckCircle size={14} color="#4ade80" />
        : <XCircle size={14} color="#f87171" />}
      <span style={{ flex: 1, textAlign: 'left', fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
        {label}
      </span>
      <StatusPill score={score} max={max} />
    </button>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ id, icon, title, score, max, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171'

  return (
    <div id={id} style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 18, overflow: 'hidden', marginBottom: 14,
      transition: 'border-color 0.2s'
    }}>
      {/* Header */}
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left'
        }}>
        <span style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${color}18`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0
        }}>
          {icon}
        </span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 0.2 }}>
          {title}
        </span>
        {/* Mini score bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 60, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: color, transition: 'width 1s ease' }} />
          </div>
          <span style={{ fontSize: 12, color, fontWeight: 700, minWidth: 30 }}>{score}/{max}</span>
        </div>
        {open
          ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" />
          : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
      </button>
      {/* Body */}
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Skill Tag ────────────────────────────────────────────────────────────────
function Tag({ label, variant = 'found' }) {
  const styles = {
    found: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
    missing: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.25)' },
    neutral: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.1)' },
  }
  const s = styles[variant]
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 99, padding: '4px 12px', fontSize: 12, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 5
    }}>
      {variant === 'found' && <CheckCircle size={11} />}
      {variant === 'missing' && <XCircle size={11} />}
      {label}
    </span>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function Bar({ label, value, max }) {
  const pct = Math.round((value / max) * 100)
  const color = pct >= 80 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171'
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 99, background: color,
          transition: 'width 1s ease'
        }} />
      </div>
    </div>
  )
}

// ─── Suggestion Item ──────────────────────────────────────────────────────────
function Suggestion({ text, index }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '12px 14px', borderRadius: 12,
      background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.12)',
      marginBottom: 10
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 99, background: 'rgba(250,204,21,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 11, fontWeight: 800, color: '#facc15'
      }}>{index + 1}</div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{text}</p>
    </div>
  )
}

// ─── Info Box ─────────────────────────────────────────────────────────────────
function InfoBox({ icon, label, value, ok }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
      borderRadius: 10, background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${ok ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
      marginBottom: 8
    }}>
      <span style={{ color: ok ? '#4ade80' : '#f87171' }}>{icon}</span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{value || '—'}</span>
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

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0C0F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No result found.</p>
        <button onClick={() => navigate('/upload')} style={{ background: '#CCFF00', color: '#000', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    )
  }

  const bd = data.breakdown || {}
  const maxMap = { Skills: 40, Experience: 20, Projects: 20, Education: 10, Certifications: 10 }
  const scoreColor = data.ats_score >= 70 ? '#4ade80' : data.ats_score >= 40 ? '#facc15' : '#f87171'
  const scoreLabel = data.ats_score >= 70 ? 'Strong Resume' : data.ats_score >= 40 ? 'Average Resume' : 'Needs Improvement'

  const hasEducation = (bd.Education || 0) > 0
  const hasExperience = (bd.Experience || 0) > 0
  const hasProjects = (bd.Projects || 0) > 0
  const hasCerts = (bd.Certifications || 0) > 0

  // Detect contact info from resume text
  const txt = (data.resume_text || '').toLowerCase()
  const hasEmail = txt.includes('@')
  const hasPhone = /\d{10}|\d{3}[-.\s]\d{3}/.test(data.resume_text || '')
  const hasLinkedIn = txt.includes('linkedin')

  const sidebarSections = [
    { id: 'content', label: 'Content', score: Math.min((data.skills_found?.length || 0) * 4, 40), max: 40 },
    { id: 'sections', label: 'Sections', score: (hasEducation ? 25 : 0) + (hasExperience ? 25 : 0) + (hasProjects ? 25 : 0) + (hasCerts ? 25 : 0), max: 100 },
    { id: 'skills', label: 'Skills', score: bd.Skills || 0, max: 40 },
    { id: 'experience', label: 'Experience', score: bd.Experience || 0, max: 20 },
    { id: 'suggestions', label: 'Improvements', score: Math.max(0, 10 - (data.suggestions?.length || 0) * 2), max: 10 },
  ]

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0C0C0F', fontFamily: "'Sora', 'Inter', sans-serif", color: '#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, background: 'rgba(12,12,15,0.95)',
        backdropFilter: 'blur(16px)', zIndex: 100
      }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 22, fontWeight: 800, color: '#CCFF00', cursor: 'pointer', letterSpacing: -0.5 }}>
          ResumeAI
        </span>
        <button onClick={() => navigate('/upload')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '7px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <ArrowLeft size={14} /> New Analysis
        </button>
      </nav>

      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '32px 20px', gap: 24, alignItems: 'flex-start' }}>

        {/* ── LEFT SIDEBAR ────────────────────────────────────────── */}
        <div style={{
          width: 220, flexShrink: 0, position: 'sticky', top: 80,
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: 18
        }}>
          {/* Score */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, letterSpacing: 0.8, textTransform: 'uppercase' }}>Your Score</p>
            <ScoreRing score={data.ats_score} />
            <p style={{ fontSize: 13, fontWeight: 700, color: scoreColor, marginTop: 8 }}>{scoreLabel}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
              {data.suggestions?.length || 0} issue{data.suggestions?.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />

          {/* Section Nav */}
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 10 }}>Sections</p>
          {sidebarSections.map(s => (
            <SidebarRow key={s.id} label={s.label} score={s.score} max={s.max}
              active={activeSection === s.id} onClick={() => scrollTo(s.id)} />
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />

          <button onClick={() => navigate('/upload')} style={{
            width: '100%', background: '#CCFF00', color: '#000', border: 'none',
            borderRadius: 12, padding: '10px 0', fontWeight: 800, fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.3
          }}>
            Analyze Another ↑
          </button>
        </div>

        {/* ── RIGHT CONTENT ────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(204,255,0,0.06) 0%, rgba(74,222,128,0.04) 100%)',
            border: '1px solid rgba(204,255,0,0.12)', borderRadius: 18,
            padding: '20px 24px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: 'rgba(204,255,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <FileText size={22} color="#CCFF00" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{data.filename}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
                Predicted role: <span style={{ color: '#CCFF00', fontWeight: 600 }}>{data.predicted_role}</span>
              </p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: scoreColor }}>{data.ats_score}</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>/100</span>
              <p style={{ fontSize: 11, color: scoreColor, margin: 0, fontWeight: 600 }}>{scoreLabel}</p>
            </div>
          </div>

          {/* ── CONTENT SECTION ──────────────────────── */}
          <SectionCard id="content" icon={<Star size={16} color="#facc15" />}
            title="Content Quality" score={Math.min((data.skills_found?.length || 0) * 4, 40)} max={40} defaultOpen={true}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.6 }}>
                Content quality measures how well your resume uses keywords, action verbs, and relevant skills that ATS systems and recruiters look for.
              </p>
              <Bar label="Skills Detected" value={bd.Skills || 0} max={40} />
              <Bar label="Experience Keywords" value={bd.Experience || 0} max={20} />
              <Bar label="Project Keywords" value={bd.Projects || 0} max={20} />
            </div>
          </SectionCard>

          {/* ── SKILLS SECTION ───────────────────────── */}
          <SectionCard id="skills" icon={<Zap size={16} color="#818cf8" />}
            title="Skills & Keywords" score={bd.Skills || 0} max={40} defaultOpen={true}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.6 }}>
                Skills found in your resume that ATS systems can detect.
              </p>

              {/* Found skills */}
              {data.skills_found?.length > 0 ? (
                <div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>Detected ({data.skills_found.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
                    {data.skills_found.map((s, i) => <Tag key={i} label={s} variant="found" />)}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>No skills detected. Make sure your PDF is text-based, not a scanned image.</p>
                </div>
              )}

              {/* Missing skills */}
              {data.missing_skills?.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>
                    Missing for {data.predicted_role} ({data.missing_skills.length})
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {data.missing_skills.map((s, i) => <Tag key={i} label={s} variant="missing" />)}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── SECTIONS CHECK ───────────────────────── */}
          <SectionCard id="sections" icon={<BookOpen size={16} color="#34d399" />}
            title="Resume Sections" score={(hasEducation ? 25 : 0) + (hasExperience ? 25 : 0) + (hasProjects ? 25 : 0) + (hasCerts ? 25 : 0)} max={100}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.6 }}>
                Essential sections detected in your resume. Make sure all key sections are clearly labeled.
              </p>
              <InfoBox icon={<BookOpen size={14} />} label="Education" value={hasEducation ? 'Detected' : 'Not found'} ok={hasEducation} />
              <InfoBox icon={<Briefcase size={14} />} label="Experience" value={hasExperience ? 'Detected' : 'Not found'} ok={hasExperience} />
              <InfoBox icon={<Star size={14} />} label="Projects" value={hasProjects ? 'Detected' : 'Not found'} ok={hasProjects} />
              <InfoBox icon={<Award size={14} />} label="Certifications" value={hasCerts ? 'Detected' : 'Not found'} ok={hasCerts} />
            </div>
          </SectionCard>

          {/* ── CONTACT INFO ─────────────────────────── */}
          <SectionCard id="contact" icon={<User size={16} color="#60a5fa" />}
            title="Contact Information" score={(hasEmail ? 40 : 0) + (hasPhone ? 30 : 0) + (hasLinkedIn ? 30 : 0)} max={100}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.6 }}>
                Recruiters need to reach you. Ensure all contact details are present and professional.
              </p>
              <InfoBox icon={<Mail size={14} />} label="Email" value={hasEmail ? 'Found' : 'Not detected'} ok={hasEmail} />
              <InfoBox icon={<Phone size={14} />} label="Phone" value={hasPhone ? 'Found' : 'Not detected'} ok={hasPhone} />
              <InfoBox icon={<Link size={14} />} label="LinkedIn" value={hasLinkedIn ? 'Found' : 'Not detected'} ok={hasLinkedIn} />
            </div>
          </SectionCard>

          {/* ── SCORE BREAKDOWN ──────────────────────── */}
          <SectionCard id="experience" icon={<TrendingUp size={16} color="#f472b6" />}
            title="Score Breakdown" score={data.ats_score} max={100}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
                Here's how each part of your resume contributes to your total ATS score.
              </p>
              {Object.entries(bd).map(([k, v]) => (
                <Bar key={k} label={k} value={v} max={maxMap[k] || 20} />
              ))}
              {/* Total */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', borderRadius: 12, marginTop: 8,
                background: 'rgba(204,255,0,0.06)', border: '1px solid rgba(204,255,0,0.15)'
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Total ATS Score</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#CCFF00' }}>{data.ats_score}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>/100</span></span>
              </div>
            </div>
          </SectionCard>

          {/* ── IMPROVEMENTS ─────────────────────────── */}
          <SectionCard id="suggestions" icon={<AlertCircle size={16} color="#fb923c" />}
            title="Improvement Suggestions" score={Math.max(0, 10 - (data.suggestions?.length || 0) * 2)} max={10}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.6 }}>
                Act on these suggestions to improve your ATS score and visibility.
              </p>
              {data.suggestions?.map((s, i) => <Suggestion key={i} text={s} index={i} />)}
            </div>
          </SectionCard>

          {/* ── EXTRACTED TEXT ───────────────────────── */}
          <SectionCard id="text" icon={<FileText size={16} color="rgba(255,255,255,0.4)" />}
            title="Extracted Text Preview" score={data.resume_text?.length > 200 ? 10 : 0} max={10}>
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                First 1000 characters parsed from your PDF.
              </p>
              <div style={{
                background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <pre style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8,
                  whiteSpace: 'pre-wrap', fontFamily: "'SF Mono', monospace", margin: 0
                }}>
                  {data.resume_text}
                </pre>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  )
}