import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

export const parsePdfBasic = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  const parsed = parseResumeText(fullText);
  return {
    title: file.name.replace('.pdf', ''),
    ...parsed
  };
};

const parseResumeText = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const result = {
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: []
  };
  
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/);
  
  if (emailMatch) result.personalInfo.email = emailMatch[0];
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0];
  if (linkedinMatch) result.personalInfo.linkedin = 'https://' + linkedinMatch[0];
  
  const nameCandidate = lines[0];
  if (nameCandidate && nameCandidate.length < 50 && !nameCandidate.includes('@')) {
    result.personalInfo.name = nameCandidate;
  }
  
  const sections = {
    experience: [],
    education: [],
    skills: []
  };
  
  const expKeywords = ['experience', 'employment', 'work history', 'professional'];
  const eduKeywords = ['education', 'academic', 'degree'];
  const skillKeywords = ['skills', 'competencies', 'technical'];
  
  let currentSection = null;
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    
    if (expKeywords.some(k => lower.includes(k))) {
      currentSection = 'experience';
      continue;
    } else if (eduKeywords.some(k => lower.includes(k))) {
      currentSection = 'education';
      continue;
    } else if (skillKeywords.some(k => lower.includes(k))) {
      currentSection = 'skills';
      continue;
    }
    
    if (currentSection === 'experience' && line.match(/^\d{4}/)) {
      sections.experience.push(line);
    } else if (currentSection === 'education' && line.match(/^\d{4}| bachelor's| master's| ph\.d| degree/i)) {
      sections.education.push(line);
    } else if (currentSection === 'skills' && line.match(/^[a-z]+[,;]/i)) {
      sections.skills.push(line);
    }
  }
  
  result.experience = sections.experience.slice(0, 5);
  result.education = sections.education.slice(0, 3);
  result.skills = sections.skills.join(', ').split(',').filter(Boolean).slice(0, 20);
  
  return result;
};