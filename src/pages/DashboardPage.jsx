import React, { useState, useEffect } from 'react';
import api, { resumeApi } from '../services/api';
import Navbar from '../components/Navbar';
import { FileText, Download, Trash2, Plus, Sparkles, Wand2, Upload, Target, Loader2, MoreVertical, Copy, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResumeMiniPreview = ({ resumeData }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMini = async () => {
      try {
        const response = await resumeApi.preview(resumeData);
        setHtml(response.data.html);
      } catch (err) {
        setHtml('<p>Preview failed</p>');
      } finally {
        setLoading(false);
      }
    };
    fetchMini();
  }, [resumeData]);

  if (loading) return <div className="mini-preview-loading"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="mini-preview-scaler">
       <iframe title="mini-preview" srcDoc={html} className="mini-preview-iframe" />
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await resumeApi.getDashboard();
      // Ensure resume.data is parsed if it's a string
      const processedResumes = response.data.resumes.map(r => ({
        ...r,
        data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data
      }));
      setResumes(processedResumes);
      setTemplates(response.data.templates);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeApi.delete(id);
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete resume');
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const response = await resumeApi.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const errorData = JSON.parse(text);
          alert(errorData.message);
          if (err.response.status === 402 && errorData.redirect) {
            navigate(errorData.redirect);
          }
        } catch (parseErr) {
          alert('Download failed');
        }
      } else {
        alert(err.response?.data?.message || 'Download failed');
      }
    }
  };

  if (loading) return <div className="loading-screen">Loading your workspace...</div>;

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="dashboard-hero">
          <div className="hero-text">
            <h1>Welcome back, {user?.username}!</h1>
            <p>Your career journey continues here. What are we building today?</p>
            <div className="hero-stats">
              <span className="stat-pill"><b>{resumes.length}</b> Resumes Created</span>
            </div>
          </div>
          <div className="hero-cta">
            <Link to="/create" className="primary-create-btn">
              <Plus size={24} />
              <span>Create New Resume</span>
            </Link>
          </div>
        </header>

        <section className="quick-actions">
          <h3>Tools & Extensions</h3>
          <div className="actions-grid">
            <Link to="/create?ai=true" className="action-card glass">
              <div className="action-icon ai"><Wand2 /></div>
              <h4>AI Assisted</h4>
              <p>Build with smart AI suggestions</p>
            </Link>
            <Link to="/upload" className="action-card glass">
              <div className="action-icon upload"><Upload /></div>
              <h4>Magic Import</h4>
              <p>Parse existing PDF or Docx</p>
            </Link>
            <Link to="/tailor" className="action-card glass">
              <div className="action-icon tailor"><Target /></div>
              <h4>Tailor to JD</h4>
              <p>Optimize for specific job roles</p>
            </Link>
          </div>
        </section>

        <section className="templates-section">
          <h3>📋 Choose a Template</h3>
          <div className="templates-scroll">
            {Object.entries(templates).map(([id, template]) => (
              <div key={id} className="template-card glass">
                <div className="template-preview">
                  <div className="template-placeholder">
                    <FileText size={48} />
                  </div>
                  <div className="template-overlay">
                    <Link to={`/create?template=${id}`} className="use-template-btn">Use This</Link>
                  </div>
                </div>
                <div className="template-info">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="resumes-section">
          <h3>📂 My Saved Resumes</h3>
          {resumes.length === 0 ? (
            <div className="empty-state glass">
              <FileText size={48} className="empty-icon" />
              <p>You haven't created any resumes yet.</p>
              <Link to="/create" className="btn-primary">Create Your First Resume</Link>
            </div>
          ) : (
            <div className="resumes-grid">
              {resumes.map(resume => (
                <div key={resume.id} className="resume-card glass">
                  <div className="resume-visual-preview">
                    <ResumeMiniPreview resumeData={resume.data} />
                    <div className="preview-overlay">
                      <Link to={`/create?resume_id=${resume.id}`} className="edit-overlay-btn">
                        <FileText size={16} /> Edit
                      </Link>
                    </div>
                  </div>
                  <div className="resume-card-details">
                    <div className="resume-card-header">
                      <h3>{resume.title}</h3>
                      <div className="resume-card-actions">
                        <button onClick={() => handleDelete(resume.id)} className="delete-btn" title="Delete Resume">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="resume-card-body">
                      <p className="created-date">Edited {new Date(resume.created_at).toLocaleDateString()}</p>
                      <div className="resume-meta">
                        <span className={`status-indicator ${resume.used_ai ? 'pro' : ''}`}>
                          {resume.used_ai ? 'AI Enhanced' : 'Standard'}
                        </span>
                        <div className="card-primary-actions">
                          <button 
                            onClick={() => handleDownload(resume.id, resume.title)}
                            className="download-btn-compact"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                          <Link to={`/create?resume_id=${resume.id}`} className="edit-btn-circle" title="Edit Resume">
                            <Eye size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
