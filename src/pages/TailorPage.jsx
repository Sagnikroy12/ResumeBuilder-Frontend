import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { resumeApi, aiApi } from '../services/api';
import { parsePdfBasic } from '../utils/pdfParser';
import Navbar from '../components/Navbar';
import { Target, FileText, Wand2, Loader2, AlertCircle, CheckCircle, Upload, FileType } from 'lucide-react';

const TailorPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setSelectedResume('');
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid PDF file');
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeApi.getDashboard();
      setResumes(response.data.resumes);
    } catch (err) {
      setError('Failed to load resumes');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!jd) return;
    if (!selectedResume && !file) {
      setError('Please select an existing resume or upload a new one');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      let resumeIdToTailor = selectedResume;

      if (file) {
        let parsedData;
        try {
          const formData = new FormData();
          formData.append('file', file);
          const uploadResp = await aiApi.upload(formData);
          parsedData = uploadResp.data?.extracted_data || uploadResp.data || {};
        } catch (aiErr) {
          console.warn('AI parse failed, falling back to basic parsing:', aiErr.message);
          parsedData = await parsePdfBasic(file);
        }
        
        if (!parsedData.title) parsedData.title = file.name.replace('.pdf', '');

        // Save parsed data to DB to get a valid resume ID
        const saveResp = await resumeApi.save(parsedData);
        resumeIdToTailor = saveResp.data?.id || saveResp.data?.resume?.id || saveResp.data?.resume_id;

        if (!resumeIdToTailor) {
          throw new Error('Failed to obtain a Resume ID from backend after saving.');
        }
      }

      // Start tailoring process
      const response = await aiApi.tailor(resumeIdToTailor, jd);
      alert('Resume tailored successfully! Redirecting to editor preview...');
      
      const tailoredData = response.data?.tailored_data || response.data?.tailored_resume || response.data?.resume || response.data || {};
      const newResumeId = response.data?.id || response.data?.resume_id || response.data?.resume?.id || tailoredData?.id || tailoredData?._id;

      // Extract actual form fields (might be nested in a 'data' string if it's a DB Resume object)
      let resumeContent = tailoredData;
      if (tailoredData.data) {
        resumeContent = typeof tailoredData.data === 'string' ? JSON.parse(tailoredData.data) : tailoredData.data;
      }

      let targetUrl = '/create?ai=true';
      if (newResumeId) {
         targetUrl = `/create?resume_id=${newResumeId}&ai=true`;
      }
      
      // Always pass the parsed data via state so the Builder can pre-fill
      navigate(targetUrl, { 
        state: { 
          resumeData: resumeContent,
          usedAi: true 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Tailoring failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading-screen">Preparing your tools...</div>;

  return (
    <div className="tailor-page">
      <Navbar />
      <div className="tailor-container">
        <header className="tailor-header">
          <div className="tailor-icon-premium">
            <Target size={32} />
          </div>
          <h1>Tailor to Job Description</h1>
          <p>Optimize your resume with AI to match specific job requirements and beat the ATS.</p>
        </header>

        <div className="tailor-grid">
          <div className="tailor-card glass">
            <h3>1. Provide Base Resume</h3>
            
            <div className="upload-section" style={{ marginBottom: '1.5rem', textAlign: 'center', border: '2px dashed rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
              <input 
                type="file" 
                id="tailor-file-upload" 
                accept=".pdf" 
                hidden
                onChange={handleFileChange}
              />
              <button 
                type="button" 
                className="upload-btn-secondary" 
                onClick={() => document.getElementById('tailor-file-upload').click()}
                style={{ background: 'var(--primary-color, rgba(255, 255, 255, 0.1))', color: 'inherit', padding: '0.6rem 1.2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', fontSize: '1rem' }}
              >
                <Upload size={18} /> Upload New PDF
              </button>
              {file && (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4ade80' }}>
                   <FileType size={16} /> <span>{file.name}</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', opacity: 0.5, marginBottom: '1.5rem', fontSize: '0.9rem' }}>— OR select an existing resume —</div>

            <div className="resume-selector">
              {resumes.length === 0 ? (
                <p className="empty-msg">No existing resumes found.</p>
              ) : (
                resumes.map(r => (
                  <label key={r.id} className={`resume-option ${String(selectedResume) === String(r.id) ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="resume" 
                      value={r.id} 
                      onChange={(e) => {
                        setSelectedResume(e.target.value);
                        setFile(null); // Deselect file if pre-existing is chosen
                      }}
                      hidden
                    />
                    <FileText size={20} />
                    <span>{r.title}</span>
                    {String(selectedResume) === String(r.id) && <CheckCircle size={16} className="check-icon" />}
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="tailor-card glass">
            <h3>2. Paste Job Description</h3>
            <textarea 
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job requirements, responsibilities, and qualifications here..."
              rows={12}
            />
            {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}
            <button 
              onClick={handleTailor} 
              className="tailor-btn"
              disabled={loading || (!selectedResume && !file) || !jd}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Wand2 size={18} /> Tailor Resume with AI</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailorPage;
