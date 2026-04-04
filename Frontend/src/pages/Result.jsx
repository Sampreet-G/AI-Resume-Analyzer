import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, ChevronDown, ChevronUp, CheckCircle, XCircle,
  AlertCircle, Briefcase, FileText, Zap, TrendingUp, Star,
  BookOpen, Award, User, Mail, Phone, Link, Sun, Moon,
  Download, Bot, Wand2, BarChart3
} from 'lucide-react'

// ─── Theme ────────────────────────────────────────────────────────────────────
const makeTheme = (dark) => ({
  bg:           dark ? '#0A0A0A' : '#F4F7F0',
  bgCard:       dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
  bgCard2:      dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
  border:       dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
  text:         dark ? '#ffffff'                : '#0f1a00',
  textMuted:    dark ? 'rgba(255,255,255,0.5)'  : 'rgba(0,0,0,0.5)',
  textFaint:    dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
  navBg:        dark ? 'rgba(10,10,10,0.95)'    : 'rgba(244,247,240,0.95)',
  accent:       '#CCFF00',
  accentText:   '#0A1800',
  tagBg:        dark ? 'rgba(204,255,0,0.08)'   : 'rgba(80,120,0,0.08)',
  tagBorder:    dark ? 'rgba(204,255,0,0.2)'    : 'rgba(80,120,0,0.2)',
  tagText:      dark ? '#CCFF00'                : '#3a6000',
  footerBorder: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
})

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, dark }) {
  const r = 56, sw = 9, nr = r - sw / 2
  const circ = 2 * Math.PI * nr
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#facc15' : '#f87171'
  return (
    <svg width={r * 2} height={r * 2}>
      <circle cx={r} cy={r} r={nr} fill="none" stroke={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} strokeWidth={sw} />
      <circle cx={r} cy={r} r={nr} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${r} ${r})`}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      <text x={r} y={r - 4} textAnchor="middle" fill={color} fontSize="28" fontWeight="800" fontFamily="'Sora',sans-serif">{score}</text>
      <text x={r} y={r + 16} textAnchor="middle" fill={dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'} fontSize="11" fontFamily="'Sora',sans-serif">/ 100</text>
    </svg>
  )
}

// ─── Pill ─────────────────────────────────────────────────────────────────────
const pillStyle = (color, bg) => ({
  background: bg, color, border: `1px solid ${color}33`,
  borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
  whiteSpace: 'nowrap',
})
function StatusPill({ score, max }) {
  const pct = Math.round((score / max) * 100)
  if (pct >= 80) return <span style={pillStyle('#4ade80', 'rgba(74,222,128,0.12)')}>Good</span>
  if (pct >= 40) return <span style={pillStyle('#facc15', 'rgba(250,204,21,0.12)')}>Average</span>
  return <span style={pillStyle('#f87171', 'rgba(248,113,113,0.12)')}>Issue</span>
}

// ─── Sidebar Row ──────────────────────────────────────────────────────────────
function SidebarRow({ label, score, max, active, onClick, theme }) {
  const pct = Math.round((score / max) * 100)
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
      padding: '8px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
      background: active ? 'rgba(204,255,0,0.08)' : 'transparent',
      transition: 'background 0.15s', fontFamily: 'inherit',
    }}>
      {pct >= 80
        ? <CheckCircle size={14} color="#4ade80" style={{ flexShrink: 0 }} />
        : <XCircle    size={14} color="#f87171" style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1, textAlign: 'left', fontSize: 12, color: theme.text, fontWeight: 500, opacity: 0.8 }}>{label}</span>
      <StatusPill score={score} max={max} />
    </button>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ id, icon, title, score, max, children, defaultOpen = false, theme, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171'
  return (
    <div id={id} style={{
      background: theme.bgCard, border: `1px solid ${theme.border}`,
      borderRadius: 20, overflow: 'hidden', marginBottom: 14,
      transition: 'all 0.3s ease',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '18px 22px', background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
      }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: theme.text }}>{title}</span>
        {badge && <span style={pillStyle(badge.color, badge.bg)}>{badge.label}</span>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 64, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: color, transition: 'width 1s ease' }} />
          </div>
          <span style={{ fontSize: 12, color, fontWeight: 700, minWidth: 32 }}>{score}/{max}</span>
        </div>
        {open ? <ChevronUp size={16} color="rgba(255,255,255,0.35)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.35)" />}
      </button>
      {open && (
        <div style={{ padding: '0 22px 22px', borderTop: `1px solid ${theme.border}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
function Tag({ label, variant = 'found' }) {
  const s = {
    found:   { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
    missing: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.25)' },
  }[variant] || { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.1)' }
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 99, padding: '5px 13px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {variant === 'found'   && <CheckCircle size={11} />}
      {variant === 'missing' && <XCircle size={11} />}
      {label}
    </span>
  )
}

// ─── Bar ─────────────────────────────────────────────────────────────────────
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

// ─── Suggestion ───────────────────────────────────────────────────────────────
function Suggestion({ text, index, priority = 'medium' }) {
  const c = {
    high:   { bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)',  dot: '#f87171', label: 'High Priority' },
    medium: { bg: 'rgba(250,204,21,0.05)',  border: 'rgba(250,204,21,0.15)', dot: '#facc15', label: 'Medium' },
    low:    { bg: 'rgba(74,222,128,0.05)',  border: 'rgba(74,222,128,0.15)', dot: '#4ade80', label: 'Low' },
  }[priority]
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 14, background: c.bg, border: `1px solid ${c.border}`, marginBottom: 10 }}>
      <div style={{ width: 26, height: 26, borderRadius: 99, background: c.dot + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 800, color: c.dot }}>{index + 1}</div>
      <div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: '0 0 4px' }}>{text}</p>
        <span style={{ fontSize: 10, color: c.dot, fontWeight: 700, letterSpacing: 0.5 }}>{c.label}</span>
      </div>
    </div>
  )
}

// ─── InfoBox ─────────────────────────────────────────────────────────────────
function InfoBox({ icon, label, value, ok, theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: theme.bgCard2, border: `1px solid ${ok ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`, marginBottom: 8 }}>
      <span style={{ color: ok ? '#4ade80' : '#f87171' }}>{icon}</span>
      <span style={{ fontSize: 13, color: theme.textMuted, minWidth: 110 }}>{label}</span>
      <span style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{value}</span>
      {ok ? <CheckCircle size={13} color="#4ade80" style={{ marginLeft: 'auto' }} />
          : <XCircle    size={13} color="#f87171" style={{ marginLeft: 'auto' }} />}
    </div>
  )
}

// ─── AI Detection Bar ─────────────────────────────────────────────────────────
function AIDetectionBar({ label, level, theme }) {
  const c = {
    critical: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', pct: 85, pill: 'CRITICAL' },
    high:     { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.25)',  pct: 65, pill: 'HIGH' },
    moderate: { color: '#facc15', bg: 'rgba(250,204,21,0.1)',  border: 'rgba(250,204,21,0.25)',  pct: 45, pill: 'MODERATE' },
    low:      { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)',  pct: 15, pill: 'LOW' },
  }[level] || { color: '#facc15', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.25)', pct: 45, pill: 'MODERATE' }
  return (
    <div style={{ padding: '12px 16px', borderRadius: 12, background: c.bg, border: `1px solid ${c.border}`, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 99, padding: '2px 8px' }}>{c.pill}</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ width: `${c.pct}%`, height: '100%', borderRadius: 99, background: c.color }} />
      </div>
    </div>
  )
}

// ─── Download Report ──────────────────────────────────────────────────────────
function downloadReport(data) {
  const bd = data.breakdown || {}
  const content = `RESUMEAI ANALYSIS REPORT
========================
Generated: ${new Date().toLocaleString()}

FILE: ${data.filename}
PREDICTED ROLE: ${data.predicted_role}
ATS SCORE: ${data.ats_score}/100

SCORE BREAKDOWN
---------------
${Object.entries(bd).map(([k, v]) => `${k.padEnd(20)} ${v}`).join('\n')}

SKILLS DETECTED (${data.skills_found?.length || 0})
${data.skills_found?.join(', ') || 'None detected'}

MISSING SKILLS FOR ${data.predicted_role}
${data.missing_skills?.join(', ') || 'None'}

IMPROVEMENT SUGGESTIONS
-----------------------
${data.suggestions?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'None'}

---
Report by ResumeAI · FastAPI + React + ML`.trim()
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ResumeAI_Report_${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Resume Builder Modal ─────────────────────────────────────────────────────
function ResumeBuilderModal({ data, onClose, theme, dark }) {
  const [copied, setCopied] = useState(false)
  const role   = data.predicted_role || 'Software Developer'
  const skills = data.skills_found   || []
  const langs  = skills.filter(s => ['python','java','javascript','c++','typescript','golang','rust'].includes(s)).join(', ') || 'Python, Java, JavaScript'
  const frames = skills.filter(s => ['react','flask','django','fastapi','node.js','spring'].includes(s)).join(', ')         || 'React, Flask, FastAPI'
  const dbs    = skills.filter(s => ['sql','mongodb'].includes(s)).join(', ')                                                || 'SQL, MongoDB'
  const tools  = skills.filter(s => ['git','docker','aws','kubernetes','linux'].includes(s)).join(', ')                     || 'Git, Docker, AWS'
  const ml     = skills.filter(s => ['machine learning','deep learning','tensorflow','pytorch','pandas','numpy'].includes(s)).join(', ') || 'Machine Learning, TensorFlow, Pandas'

  const resumeText = `YOUR NAME
${role}
your@email.com  |  +91-XXXXXXXXXX  |  linkedin.com/in/yourprofile  |  github.com/yourprofile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL SUMMARY
A detail-oriented ${role} with experience building scalable, production-ready systems.
Skilled in ${skills.slice(0, 4).join(', ')}. Passionate about clean code and impactful products.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TECHNICAL SKILLS
  Languages:     ${langs}
  Frameworks:    ${frames}
  Databases:     ${dbs}
  Tools/Cloud:   ${tools}
  ML / AI:       ${ml}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WORK EXPERIENCE

[Company Name]  —  ${role} Intern                              [Month Year – Month Year]
  • Developed [feature] that improved [metric] by X%
  • Deployed [system] using ${skills.slice(0,3).join(', ')} — reduced processing time by X%
  • Collaborated with [team] to deliver [project] ahead of deadline
  • Automated [process] saving X hours/week of manual effort

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECTS

Project Name  |  github.com/yourprofile/project-name
  • Built [what] using ${skills.slice(0,3).join(', ')} — [outcome: 95% accuracy / 500 users]
  • Implemented [key feature] to solve [specific problem]
  • Tech stack: ${skills.slice(0,5).join(', ')}

Project Name 2  |  github.com/yourprofile/project-name-2
  • Designed and deployed [system] handling [scale] requests/day
  • Reduced [metric] by X% through [optimization approach]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EDUCATION

B.Tech in Computer Science Engineering
[University Name], [City]                                       [Year – Year]
CGPA: X.X / 10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATIONS
  • [Certification Name]  —  Coursera / NPTEL / AWS            [Year]
  • [Certification Name]  —  [Platform]                        [Year]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACHIEVEMENTS
  • [Hackathon / competition win]
  • [Open source / GitHub contribution]
  • [Award or recognition]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ Fill all [brackets] with your actual details ]
[ This template is optimized for 85–95 ATS score ]`

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#141414' : '#fff', border: `1px solid ${theme.border}`, borderRadius: 24, width: '100%', maxWidth: 740, maxHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wand2 size={18} color="#60a5fa" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: theme.text, margin: 0 }}>AI Resume Builder</p>
              <p style={{ fontSize: 12, color: theme.textMuted, margin: 0 }}>ATS-optimized template · Tailored for {role}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.tagBg, border: `1px solid ${theme.tagBorder}`, borderRadius: 10, padding: '7px 14px', color: theme.tagText, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {copied ? '✓ Copied!' : '⎘ Copy All'}
            </button>
            <button onClick={onClose} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '7px 14px', color: '#f87171', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Close
            </button>
          </div>
        </div>

        {/* ATS badge */}
        <div style={{ padding: '10px 24px', background: 'rgba(74,222,128,0.05)', borderBottom: '1px solid rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <CheckCircle size={15} color="#4ade80" />
          <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 700 }}>Optimized for 85–95 ATS score</span>
          <span style={{ fontSize: 12, color: theme.textMuted }}>· Replace all [brackets] with your real details</span>
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: 24, flex: 1 }}>
          <pre style={{ fontSize: 12.5, lineHeight: 1.9, color: theme.textMuted, whiteSpace: 'pre-wrap', fontFamily: "'SF Mono','Fira Code',monospace", margin: 0, background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)', padding: 20, borderRadius: 12, border: `1px solid ${theme.border}` }}>
            {resumeText}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const data     = location.state
  const [dark, setDark]               = useState(true)
  const [activeSection, setActive]    = useState(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const theme = makeTheme(dark)

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No result found.</p>
      <button onClick={() => navigate('/upload')} style={{ background: '#CCFF00', color: '#000', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>Go Back</button>
    </div>
  )

  const bd       = data.breakdown || {}
  const maxMap   = { Skills: 40, Experience: 20, Projects: 20, Education: 10, Certifications: 10 }
  const scoreColor = data.ats_score >= 70 ? '#4ade80' : data.ats_score >= 40 ? '#facc15' : '#f87171'
  const scoreLabel = data.ats_score >= 70 ? 'Strong Resume' : data.ats_score >= 40 ? 'Average Resume' : 'Needs Improvement'

  const txt    = data.resume_text || ''
  const txtLow = txt.toLowerCase()
  const hasEmail    = txt.includes('@')
  const hasPhone    = /\d{10}|\d{3}[-.\s]\d{3}/.test(txt)
  const hasLinkedIn = txtLow.includes('linkedin')
  const hasEducation  = (bd.Education      || 0) > 0
  const hasExperience = (bd.Experience     || 0) > 0
  const hasProjects   = (bd.Projects       || 0) > 0
  const hasCerts      = (bd.Certifications || 0) > 0

  // AI detection
  const aiPhrases = ['leverage','spearheaded','synergy','utilize','results-driven','passionate','dynamic','innovative','cutting-edge','robust solution','orchestrated','proactive']
  const aiHits  = aiPhrases.filter(p => txtLow.includes(p)).length
  const aiLevel = aiHits >= 4 ? 'critical' : aiHits >= 2 ? 'high' : aiHits >= 1 ? 'moderate' : 'low'

  // Extended suggestions
  const baseSuggestions = data.suggestions || []
  const extraSuggestions = [
    !hasLinkedIn && 'Add your full LinkedIn URL so recruiters can verify your profile.',
    !hasPhone    && 'Add a phone number — many recruiters prefer calling over email.',
    !hasCerts    && 'Add at least one certification (Coursera, NPTEL, AWS) to boost credibility.',
    (data.skills_found?.length || 0) < 5 && 'List specific tool names — "TensorFlow" beats "Machine Learning" in ATS.',
    !hasExperience && 'Add internship, freelance, or part-time work. Personal projects count too.',
    data.ats_score < 60 && 'Match your resume language directly to the job description for better ATS hits.',
    data.ats_score < 80 && 'Quantify achievements — "improved performance by 30%" beats "improved performance".',
    aiLevel === 'critical' && 'Remove AI-buzzwords like "spearheaded" and "leverage" — ATS systems flag them.',
    !hasProjects && 'Add 2–3 projects with GitHub links, tech stack, and measurable outcomes.',
    (data.missing_skills?.length || 0) > 2 && `Learn top missing skills: ${data.missing_skills?.slice(0,3).join(', ')}.`,
    'Use consistent date formatting (e.g., "Jan 2024 – May 2024") throughout.',
    'Keep your resume to 1 page if under 2 years of experience.',
    'Use bullet points starting with strong action verbs: Built, Deployed, Designed, Reduced, Automated.',
  ].filter(Boolean)

  const allSuggestions = [...new Set([...baseSuggestions, ...extraSuggestions])]
  const priorities     = allSuggestions.map((_, i) => i < 3 ? 'high' : i < 7 ? 'medium' : 'low')

  // Improve score tips
  const improveTips = [
    { icon: '🎯', title: 'Add Missing Skills',       desc: `Add ${data.missing_skills?.slice(0,3).join(', ') || 'role-specific tools'} to directly target ${data.predicted_role} roles.`, gain: '+8–12' },
    { icon: '📊', title: 'Quantify Everything',      desc: 'Replace vague lines with numbers. "40% faster" beats "improved speed" every time.',                                          gain: '+5–8'  },
    { icon: '🔑', title: 'Mirror Job Descriptions',  desc: 'Copy keywords directly from job postings — ATS scores go up when language matches.',                                          gain: '+6–10' },
    { icon: '📜', title: 'Get a Certification',      desc: 'One AWS/Google/Coursera cert adds strong keywords and boosts recruiter trust.',                                              gain: '+4–7'  },
    { icon: '💼', title: 'Use Action Verbs',         desc: '"Engineered", "Deployed", "Automated" — strong verbs make bullets more impactful.',                                          gain: '+3–5'  },
    { icon: '🔗', title: 'Add All Profile Links',    desc: 'GitHub + LinkedIn + Portfolio links give 60% more recruiter engagement. Use full URLs.',                                      gain: '+3–5'  },
  ]

  const sidebarSections = [
    { id: 'content',     label: 'Content Quality', score: Math.min((data.skills_found?.length || 0) * 4, 40), max: 40 },
    { id: 'skills',      label: 'Skills',           score: bd.Skills || 0, max: 40 },
    { id: 'sections',    label: 'Sections',          score: (hasEducation?25:0)+(hasExperience?25:0)+(hasProjects?25:0)+(hasCerts?25:0), max: 100 },
    { id: 'contact',     label: 'Contact Info',      score: (hasEmail?40:0)+(hasPhone?30:0)+(hasLinkedIn?30:0), max: 100 },
    { id: 'ai-detect',   label: 'AI Detection',      score: aiLevel==='low'?10:aiLevel==='moderate'?6:aiLevel==='high'?3:0, max: 10 },
    { id: 'improve',     label: 'Improve Score',     score: data.ats_score, max: 100 },
    { id: 'breakdown',   label: 'Score Breakdown',   score: data.ats_score, max: 100 },
    { id: 'suggestions', label: 'Suggestions',       score: Math.max(0, 10 - allSuggestions.length), max: 10 },
  ]

  const scrollTo = (id) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: "'Sora','Inter',sans-serif", transition: 'background 0.4s ease, color 0.4s ease' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fr { animation: fadeUp 0.5s ease both; }
        .improve-card:hover { transform:translateY(-2px); border-color:rgba(204,255,0,0.25)!important; }
        .improve-card { transition: all 0.2s ease; }
        .dl-btn:hover  { transform:translateY(-2px)!important; box-shadow:0 8px 28px rgba(204,255,0,0.2)!important; }
        .bld-btn:hover { transform:translateY(-2px)!important; box-shadow:0 8px 28px rgba(96,165,250,0.2)!important; }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 60, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, background: theme.navBg, backdropFilter: 'blur(20px)', zIndex: 100, transition: 'all 0.4s ease' }}>
        <span onClick={() => navigate('/')} style={{ fontSize: 20, fontWeight: 900, color: theme.accent, cursor: 'pointer', letterSpacing: -0.5 }}>ResumeAI</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => downloadReport(data)} className="dl-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.tagBg, border: `1px solid ${theme.tagBorder}`, borderRadius: 10, padding: '7px 13px', color: theme.tagText, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
            <Download size={13} /> Download Report
          </button>
          <button onClick={() => setShowBuilder(true)} className="bld-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 10, padding: '7px 13px', color: '#60a5fa', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
            <Wand2 size={13} /> Build Resume
          </button>
          <button onClick={() => setDark(d => !d)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 99, padding: '7px 13px', color: theme.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            {dark ? <><Sun size={12} color="#CCFF00" /> Light</> : <><Moon size={12} /> Dark</>}
          </button>
          <button onClick={() => navigate('/upload')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 10, padding: '7px 13px', color: theme.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            <ArrowLeft size={13} /> New
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', maxWidth: 1120, margin: '0 auto', padding: '24px 18px', gap: 20, alignItems: 'flex-start' }}>

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <div style={{ width: 215, flexShrink: 0, position: 'sticky', top: 72, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 14, transition: 'all 0.4s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 10, color: theme.textFaint, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Your Score</p>
            <ScoreRing score={data.ats_score} dark={dark} />
            <p style={{ fontSize: 12, fontWeight: 700, color: scoreColor, marginTop: 6 }}>{scoreLabel}</p>
            <p style={{ fontSize: 11, color: theme.textFaint, marginTop: 2 }}>{allSuggestions.length} improvements found</p>
          </div>
          <div style={{ height: 1, background: theme.border, marginBottom: 8 }} />
          <p style={{ fontSize: 10, color: theme.textFaint, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, paddingLeft: 10 }}>Jump To</p>
          {sidebarSections.map(s => <SidebarRow key={s.id} {...s} active={activeSection === s.id} onClick={() => scrollTo(s.id)} theme={theme} />)}
          <div style={{ height: 1, background: theme.border, margin: '10px 0' }} />
          <button onClick={() => setShowBuilder(true)} style={{ width: '100%', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 12, padding: '9px 0', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#60a5fa', marginBottom: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Wand2 size={12} /> Build New Resume
          </button>
          <button onClick={() => downloadReport(data)} style={{ width: '100%', background: theme.tagBg, border: `1px solid ${theme.tagBorder}`, borderRadius: 12, padding: '9px 0', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: theme.tagText, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Download size={12} /> Download Report
          </button>
        </div>

        {/* ── CONTENT ─────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }} className="fr">

          {/* Banner */}
          <div style={{ background: dark ? 'linear-gradient(135deg,rgba(204,255,0,0.06),rgba(74,222,128,0.03))' : 'linear-gradient(135deg,rgba(100,160,0,0.07),rgba(50,180,80,0.04))', border: `1px solid ${theme.tagBorder}`, borderRadius: 20, padding: '16px 20px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(204,255,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={19} color="#CCFF00" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: theme.text, margin: 0 }}>{data.filename}</p>
              <p style={{ fontSize: 12, color: theme.textMuted, margin: '2px 0 0' }}>Predicted: <span style={{ color: theme.accent, fontWeight: 700 }}>{data.predicted_role}</span></p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: scoreColor }}>{data.ats_score}</span>
              <span style={{ fontSize: 12, color: theme.textFaint }}>/100</span>
              <p style={{ fontSize: 11, color: scoreColor, margin: 0, fontWeight: 700 }}>{scoreLabel}</p>
            </div>
          </div>

          {/* Content Quality */}
          <SectionCard id="content" theme={theme} defaultOpen icon={<Star size={17} color="#facc15" />} title="Content Quality" score={Math.min((data.skills_found?.length||0)*4,40)} max={40}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>How well your resume uses keywords, action verbs, and role-relevant content that ATS systems detect.</p>
              <Bar label="Skills Detected"     value={bd.Skills||0}          max={40} theme={theme} />
              <Bar label="Experience Keywords" value={bd.Experience||0}      max={20} theme={theme} />
              <Bar label="Project Keywords"    value={bd.Projects||0}        max={20} theme={theme} />
              <Bar label="Education"           value={bd.Education||0}       max={10} theme={theme} />
              <Bar label="Certifications"      value={bd.Certifications||0}  max={10} theme={theme} />
            </div>
          </SectionCard>

          {/* Skills */}
          <SectionCard id="skills" theme={theme} defaultOpen icon={<Zap size={17} color="#818cf8" />} title="Skills & Keywords" score={bd.Skills||0} max={40}>
            <div style={{ marginTop: 16 }}>
              {data.skills_found?.length > 0 ? (
                <>
                  <p style={{ fontSize: 11, color: theme.textFaint, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>Detected ({data.skills_found.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>{data.skills_found.map((s,i) => <Tag key={i} label={s} variant="found" />)}</div>
                </>
              ) : (
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>No skills detected. Make sure your PDF is text-based, not a scanned image.</p>
                </div>
              )}
              {data.missing_skills?.length > 0 && (
                <>
                  <p style={{ fontSize: 11, color: theme.textFaint, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>Missing for {data.predicted_role} ({data.missing_skills.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{data.missing_skills.map((s,i) => <Tag key={i} label={s} variant="missing" />)}</div>
                </>
              )}
            </div>
          </SectionCard>

          {/* Sections */}
          <SectionCard id="sections" theme={theme} icon={<BookOpen size={17} color="#34d399" />} title="Resume Sections" score={(hasEducation?25:0)+(hasExperience?25:0)+(hasProjects?25:0)+(hasCerts?25:0)} max={100}>
            <div style={{ marginTop: 16 }}>
              <InfoBox icon={<BookOpen size={14}  />} label="Education"      value={hasEducation  ?'Detected':'Not found'} ok={hasEducation}  theme={theme} />
              <InfoBox icon={<Briefcase size={14} />} label="Experience"     value={hasExperience ?'Detected':'Not found'} ok={hasExperience} theme={theme} />
              <InfoBox icon={<Star size={14}      />} label="Projects"       value={hasProjects   ?'Detected':'Not found'} ok={hasProjects}   theme={theme} />
              <InfoBox icon={<Award size={14}     />} label="Certifications" value={hasCerts      ?'Detected':'Not found'} ok={hasCerts}      theme={theme} />
            </div>
          </SectionCard>

          {/* Contact */}
          <SectionCard id="contact" theme={theme} icon={<User size={17} color="#60a5fa" />} title="Contact Information" score={(hasEmail?40:0)+(hasPhone?30:0)+(hasLinkedIn?30:0)} max={100}>
            <div style={{ marginTop: 16 }}>
              <InfoBox icon={<Mail size={14}  />} label="Email"    value={hasEmail    ?'Found':'Not detected'} ok={hasEmail}    theme={theme} />
              <InfoBox icon={<Phone size={14} />} label="Phone"    value={hasPhone    ?'Found':'Not detected'} ok={hasPhone}    theme={theme} />
              <InfoBox icon={<Link size={14}  />} label="LinkedIn" value={hasLinkedIn ?'Found':'Not detected'} ok={hasLinkedIn} theme={theme} />
            </div>
          </SectionCard>

          {/* AI Detection */}
          <SectionCard id="ai-detect" theme={theme}
            icon={<Bot size={17} color="#f472b6" />} title="AI Language Detection"
            score={aiLevel==='low'?10:aiLevel==='moderate'?6:aiLevel==='high'?3:0} max={10}
            badge={
              aiLevel==='critical'?{label:'CRITICAL',color:'#f87171',bg:'rgba(248,113,113,0.12)'}:
              aiLevel==='high'    ?{label:'HIGH',    color:'#fb923c',bg:'rgba(251,146,60,0.12)' }:
              aiLevel==='moderate'?{label:'DETECTED',color:'#facc15',bg:'rgba(250,204,21,0.12)' }:
                                   {label:'CLEAN',   color:'#4ade80',bg:'rgba(74,222,128,0.12)' }}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>Recruiters and ATS systems increasingly flag AI-generated language. Overused buzzwords hurt your authenticity score.</p>
              <AIDetectionBar label="AI Language Patterns"  level={aiLevel} theme={theme} />
              <AIDetectionBar label="Generic Buzzwords"      level={aiHits>=3?'high':aiHits>=1?'moderate':'low'} theme={theme} />
              <AIDetectionBar label="Passive Voice Overuse"  level={aiLevel==='critical'?'high':'low'} theme={theme} />
              {aiLevel !== 'low' ? (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)', marginTop: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#f87171', margin: '0 0 8px' }}>⚠ Flagged Phrases</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {aiPhrases.filter(p => txtLow.includes(p)).map((p, i) => (
                      <span key={i} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', borderRadius: 99, padding: '3px 10px' }}>{p}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: theme.textMuted, margin: 0, lineHeight: 1.6 }}>Replace with concrete, specific language. Instead of "spearheaded innovation", write "built X that reduced Y by Z%".</p>
                </div>
              ) : (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.18)', marginTop: 14 }}>
                  <p style={{ fontSize: 13, color: '#4ade80', margin: 0 }}>✓ No significant AI language detected. Your resume reads naturally and authentically.</p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Improve My Score */}
          <SectionCard id="improve" theme={theme} icon={<TrendingUp size={17} color="#CCFF00" />} title="Improve My Score" score={data.ats_score} max={100}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 18, lineHeight: 1.7 }}>Specific actions to push your ATS score higher. Each card shows the estimated score gain.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {improveTips.map((tip, i) => (
                  <div key={i} className="improve-card" style={{ padding: '14px 15px', borderRadius: 14, background: theme.bgCard2, border: `1px solid ${theme.border}`, cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{tip.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 99, padding: '2px 8px' }}>+{tip.gain} pts</span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, margin: '0 0 5px' }}>{tip.title}</p>
                    <p style={{ fontSize: 12, color: theme.textMuted, margin: 0, lineHeight: 1.6 }}>{tip.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 18px', borderRadius: 14, background: dark?'rgba(204,255,0,0.05)':'rgba(80,120,0,0.06)', border: `1px solid ${theme.tagBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, margin: '0 0 2px' }}>Potential Score After Fixes</p>
                  <p style={{ fontSize: 12, color: theme.textMuted, margin: 0 }}>Estimated if all suggestions applied</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#4ade80' }}>{Math.min(100, data.ats_score + 25)}</span>
                  <span style={{ fontSize: 12, color: theme.textFaint }}>/100</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Score Breakdown */}
          <SectionCard id="breakdown" theme={theme} icon={<BarChart3 size={17} color="#f472b6" />} title="Score Breakdown" score={data.ats_score} max={100}>
            <div style={{ marginTop: 16 }}>
              {Object.entries(bd).map(([k, v]) => <Bar key={k} label={k} value={v} max={maxMap[k]||20} theme={theme} />)}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: 14, marginTop: 10, background: dark?'rgba(204,255,0,0.06)':'rgba(80,120,0,0.07)', border: `1px solid ${theme.tagBorder}` }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Total ATS Score</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: scoreColor }}>{data.ats_score}<span style={{ fontSize: 13, color: theme.textFaint }}>/100</span></span>
              </div>
            </div>
          </SectionCard>

          {/* Suggestions */}
          <SectionCard id="suggestions" theme={theme} icon={<AlertCircle size={17} color="#fb923c" />} title={`Improvement Suggestions (${allSuggestions.length})`} score={Math.max(0,10-allSuggestions.length)} max={10}>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.7 }}>{allSuggestions.length} specific improvements to boost your resume's ATS performance and recruiter visibility.</p>
              {allSuggestions.map((s, i) => <Suggestion key={i} text={s} index={i} priority={priorities[i]} />)}
            </div>
          </SectionCard>

          {/* Build Resume CTA */}
          <div style={{ background: dark?'linear-gradient(135deg,rgba(96,165,250,0.07),rgba(139,92,246,0.05))':'linear-gradient(135deg,rgba(96,165,250,0.08),rgba(139,92,246,0.05))', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Wand2 size={21} color="#60a5fa" />
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: theme.text, margin: '0 0 8px' }}>Build a Better Resume from Scratch</h3>
            <p style={{ fontSize: 13, color: theme.textMuted, margin: '0 0 20px', lineHeight: 1.7, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
              Get a high ATS-score template pre-filled with your role and skills. Just replace the placeholders.
            </p>
            <button onClick={() => setShowBuilder(true)} style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.35)', borderRadius: 14, padding: '12px 30px', color: '#60a5fa', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease' }}>
              <Wand2 size={15} /> Generate My Resume Template
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${theme.footerBorder}`, padding: '18px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 20 }}>
        
        {/* Row 2: social links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="https://www.linkedin.com/in/sampreetghosh/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 99, padding: '5px 12px', color: theme.textMuted, fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0A66C2'; e.currentTarget.style.color = '#0A66C2'; e.currentTarget.style.background = '#0A66C212' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = theme.bgCard }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a href="https://www.instagram.com/saaamyyyyyyyy/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 99, padding: '5px 12px', color: theme.textMuted, fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#E1306C'; e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.background = '#E1306C12' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = theme.bgCard }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Instagram
          </a>
          <a href="mailto:ghosh.sampreet@gmail.com"
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 99, padding: '5px 12px', color: theme.textMuted, fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#CCFF00'; e.currentTarget.style.color = '#CCFF00'; e.currentTarget.style.background = '#CCFF0012' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = theme.bgCard }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email
          </a>
        </div>
        {/* Row 1 */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: theme.accent }}>ResumeAI</span>
          <span style={{ fontSize: 12, color: theme.textFaint }}>© 2026 · Developed with ❤️ by Sampreet Ghosh</span>
          <button onClick={() => setDark(d => !d)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 99, padding: '5px 12px', color: theme.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            {dark ? <><Sun size={12}/> Light</> : <><Moon size={12}/> Dark</>}
          </button>
        </div>
      </footer>

      {showBuilder && <ResumeBuilderModal data={data} onClose={() => setShowBuilder(false)} theme={theme} dark={dark} />}
    </div>
  )
}