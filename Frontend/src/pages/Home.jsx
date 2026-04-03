import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, Brain, ShieldCheck, Zap } from 'lucide-react'

const features = [
  {
    icon: <FileText size={26} />,
    title: 'Resume Parsing',
    desc: 'Extracts skills, education, projects and experience instantly.',
  },
  {
    icon: <Brain size={26} />,
    title: 'Role Prediction',
    desc: 'ML model predicts the most suitable job role for your profile.',
  },
  {
    icon: <ShieldCheck size={26} />,
    title: 'ATS Scoring',
    desc: 'Get an ATS score so recruiters find your resume easily.',
  },
  {
    icon: <Zap size={26} />,
    title: 'Skill Gap Analysis',
    desc: 'Discover missing skills and get personalised suggestions.',
  },
]

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <span className="text-2xl font-black tracking-tight text-[#CCFF00] glow-text">
          ResumeAI
        </span>
        <button
          onClick={() => navigate('/upload')}
          className="btn-primary !py-2.5 !px-5 !text-sm"
        >
          Try Now
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="tag mb-6 mx-auto fade-up">
          <Sparkles size={14} />
          AI Powered Resume Analysis
        </div>

        <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight mb-6 fade-up-2">
          Upload Your Resume.<br />
          <span className="text-[#CCFF00] glow-text">Get Smart Insights.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed fade-up-3">
          Analyze your resume instantly with ATS scoring, role prediction,
          skill extraction, and improvement suggestions — powered by ML.
        </p>

        <div className="fade-up-3">
          <button
            onClick={() => navigate('/upload')}
            className="btn-primary glow"
          >
            Get Started Free
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-28">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass rounded-3xl p-6 hover:border-[#CCFF00]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00] mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-6 text-center text-gray-600 text-sm">
        © 2026 ResumeAI · Built with FastAPI + React
      </footer>

    </div>
  )
}

export default Home