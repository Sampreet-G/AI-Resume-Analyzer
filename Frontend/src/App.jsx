import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UploadResume from './pages/UploadResume'
import Result from './pages/Result'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadResume />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}

export default App