import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, FileText, X } from 'lucide-react'
import API from '../services/api'

function UploadResume() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [drag, setDrag] = useState(false)
  const navigate = useNavigate()

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center px-8 py-5 border-b border-white/5">
        <span
          onClick={() => navigate('/')}
          className="text-2xl font-black tracking-tight text-[#CCFF00] cursor-pointer"
        >
          ResumeAI
        </span>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl fade-up">

          <div className="text-center mb-10">
            <h1 className="text-5xl font-black mb-3">Upload Resume</h1>
            <p className="text-gray-400">Drop your PDF resume and get instant AI analysis</p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            className={`glass rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer mb-6
              ${drag ? 'border-[#CCFF00]/60 bg-[#CCFF00]/5' : 'hover:border-white/20'}`}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#CCFF00]/10 flex items-center justify-center">
                  <FileText size={32} className="text-[#CCFF00]" />
                </div>
                <p className="font-semibold text-lg">{file.name}</p>
                <p className="text-gray-500 text-sm">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="text-gray-500 hover:text-red-400 transition flex items-center gap-1 text-sm mt-1"
                >
                  <X size={14} /> Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#CCFF00]/10 flex items-center justify-center">
                  <UploadCloud size={32} className="text-[#CCFF00]" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">
                    Drag & drop your resume here
                  </p>
                  <p className="text-gray-500 text-sm">or click to browse · PDF only</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing Resume...
              </>
            ) : (
              <>
                <UploadCloud size={18} />
                Upload & Analyze
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}

export default UploadResume