'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';
import { Plus, Trash2, Eye, AlertCircle, Bookmark, BookmarkCheck, Filter, ChevronsUpDown, Copy, CheckCircle, Edit3, Save, X, Camera } from 'lucide-react';
import { doc, deleteDoc, updateDoc, Timestamp, addDoc, serverTimestamp, collection, deleteField } from 'firebase/firestore';
import { db } from '../../../src/firebase/firebase';
import { uploadFile } from '../../../src/services/storageService';
import { allPrograms as staticPrograms } from '../../../src/data/optimus-data';
import programService, { Program as ServiceProgram, ProgramPhoto } from '../../../src/services/programService';
import ProgramPhotoManager from '../../components/ProgramPhotoManager';

// Define the Program type
interface Program {
  id: string;
  title: string;
  title_ar?: string;
  category?: string;
  speciality?: string;
  shortDescription?: string;
  description?: string;
  description_ar?: string;
  thumbnail?: string;
  photos?: ProgramPhoto[];
  duration?: string;
  duration_ar?: string;
  studyTime?: string;
  price?: number | string;
  status: 'published' | 'draft';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  courses?: string[];
  enrollments?: number;
  isStatic?: boolean;
  level?: string;
  programType?: string;
  programType_ar?: string;
  specialization?: string;
  type?: string;
  // Additional fields for editing
  tagline?: string;
  tagline_ar?: string;
  modules?: any[];
  modules_ar?: any[];
  careerOpportunities?: string[];
  careerOpportunities_ar?: string[];
  keyFeatures?: { title: string; description: string }[];
  keyFeatures_ar?: { title: string; description: string }[];
  accreditation?: string;
  specialty?: string;
  specialty_ar?: string;
  exclusive?: boolean;
  brochure_en?: string;
  brochure_ar?: string;
}

export default function AdminProgramsPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [staticPrograms, setStaticPrograms] = useState<Program[]>([]);
  const [adminPrograms, setAdminPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'static'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [statusToggleLoading, setStatusToggleLoading] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  
  // Edit mode state
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Program>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [activeEditLanguage, setActiveEditLanguage] = useState<'en' | 'ar'>('en');
  const [includeArabicEdit, setIncludeArabicEdit] = useState(false);
  
  // Photo management state
  const [showPhotoManager, setShowPhotoManager] = useState(false);
  const [currentProgramPhotos, setCurrentProgramPhotos] = useState<ProgramPhoto[]>([]);
  
  // Input states for adding items during edit
    const [newModule, setNewModule] = useState('');
  const [newCareer, setNewCareer] = useState('');
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  
  // Auto-fill states for edit mode
  const [autoFillText, setAutoFillText] = useState('');
  const [autoFilling, setAutoFilling] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState('');
  
  // Brochure upload states for edit mode
  const [editBrochureEnFile, setEditBrochureEnFile] = useState<File | null>(null);
  const [editBrochureArFile, setEditBrochureArFile] = useState<File | null>(null);
 
  // Specialty options for editing
  const specialtyOptions = [
    { en: 'Digital Transformation', ar: 'التحول الرقمي' },
    { en: 'Strategic Management', ar: 'الإدارة الاستراتيجية' },
    { en: 'Healthcare Management', ar: 'إدارة الرعاية الصحية' },
    { en: 'Project Management', ar: 'إدارة المشاريع' },
    { en: 'Accounting & Finance Management', ar: 'إدارة المحاسبة والمالية' },
    { en: 'Marketing Management', ar: 'إدارة التسويق' },
    { en: 'Logistics & Supply Chain Management', ar: 'إدارة اللوجستيات وسلسلة التوريد' },
    { en: 'Human Resources Management', ar: 'إدارة الموارد البشرية' },
    { en: 'Quality Management', ar: 'إدارة الجودة' },
    { en: 'Accounting & Finance', ar: 'المحاسبة والمالية' },
    { en: 'Entrepreneurship & Innovation', ar: 'ريادة الأعمال والابتكار' },
    { en: 'International Business Management', ar: 'إدارة الأعمال الدولية' },
    { en: 'Sports Management', ar: 'إدارة الرياضة' },
    { en: 'Hospitality & Events Management', ar: 'إدارة الضيافة والفعاليات' }
  ];

  useEffect(() => {
    // Only fetch programs if the user is authenticated and has programs permission
    if (!isLoading && currentUser && (userRole === 'admin' || hasPermission('programs'))) {
      // Set up real-time listener for admin programs
      setLoading(true);
      
      // Transform static programs from the imported data
      const staticProgramsList: Program[] = staticPrograms.map(program => ({
        id: program.id,
        title: program.title,
        description: program.description || '',
        shortDescription: program.description ? program.description.substring(0, 150) + '...' : '',
        price: program.price,
        category: program.specialization || '',
        speciality: program.specialization || '',
        duration: program.duration || '',
        studyTime: program.duration || '',
        status: 'published' as const,
        programType: program.level === 'Level 7' ? 'MBA' : program.level === 'Level 8' ? 'PHD' : 'Certificate',
        type: program.type || 'Professional Certificate',
        isStatic: true,
        level: program.level,
        specialization: program.specialization
      }));
      
      setStaticPrograms(staticProgramsList);
      
      const unsubscribe = programService.listenToAdminProgramChanges((adminProgramsList: ServiceProgram[]) => {
        // Set the admin programs
        const transformedAdminPrograms = adminProgramsList.map((p: ServiceProgram) => ({
          ...p,
          isStatic: false
        }));
        
        setAdminPrograms(transformedAdminPrograms);
        
        // Combine both lists - the admin programs and the static templates
        setPrograms([...transformedAdminPrograms, ...staticProgramsList]);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, [currentUser, userRole, hasPermission, isLoading, router]);

  // Clear success messages after a delay
  useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => setImportSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

  useEffect(() => {
    if (statusSuccess) {
      const timer = setTimeout(() => setStatusSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusSuccess]);

  useEffect(() => {
    if (editSuccess) {
      const timer = setTimeout(() => setEditSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [editSuccess]);

  // Start editing a program
  const startEditing = (program: Program) => {
    setEditingProgram(program.id);
    
    // Check if program has Arabic content
    const hasArabicContent = !!(program.title_ar || program.description_ar || program.tagline_ar || (program as any).hasArabicContent);
    setIncludeArabicEdit(hasArabicContent);
    
    setEditFormData({
      title: program.title || '',
      title_ar: program.title_ar || '',
      tagline: program.tagline || '',
      tagline_ar: program.tagline_ar || '',
      description: program.description || '',
      description_ar: program.description_ar || '',
      duration: program.duration || '',
      duration_ar: program.duration_ar || '',
      programType: program.programType || 'MBA',
      programType_ar: program.programType_ar || 'ماجستير إدارة الأعمال',
      specialty: program.specialty || program.speciality || '',
      specialty_ar: program.specialty_ar || '',
      accreditation: program.accreditation || 'none',
      status: program.status || 'draft',
      exclusive: program.exclusive || false,
      modules: program.modules || [],
      modules_ar: program.modules_ar || [],
      careerOpportunities: program.careerOpportunities || [],
      careerOpportunities_ar: program.careerOpportunities_ar || [],
      keyFeatures: program.keyFeatures || [],
      keyFeatures_ar: program.keyFeatures_ar || [],
      photos: program.photos || []
    });
    
    // Load current photos
    setCurrentProgramPhotos(program.photos || []);
    
    setActiveEditLanguage('en');
    setNewModule('');
    setNewCareer('');
    setNewFeature({ title: '', description: '' });
    setEditBrochureEnFile(null);
    setEditBrochureArFile(null);
    setAutoFillText('');
    setAutoFillSuccess('');
    setTranslateSuccess('');
    setError('');
    setShowPhotoManager(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProgram(null);
    setEditFormData({});
    setActiveEditLanguage('en');
    setIncludeArabicEdit(false);
    setError('');
    setNewModule('');
    setNewCareer('');
    setNewFeature({ title: '', description: '' });
    setEditBrochureEnFile(null);
    setEditBrochureArFile(null);
    setAutoFillText('');
    setAutoFillSuccess('');
    setTranslateSuccess('');
    setShowPhotoManager(false);
    setCurrentProgramPhotos([]);
  };

  // Handle photo updates
  const handlePhotosUpdate = (updatedPhotos: ProgramPhoto[]) => {
    setCurrentProgramPhotos(updatedPhotos);
    setEditFormData(prev => ({
      ...prev,
      photos: updatedPhotos
    }));
  };

  // Handle form changes
  const handleEditChange = (field: string, value: string | boolean) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add module
  const addModule = () => {
    if (!newModule.trim()) return;
    const field = activeEditLanguage === 'ar' ? 'modules_ar' : 'modules';
    setEditFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newModule.trim()]
    }));
    setNewModule('');
  };

  // Remove module
  const removeModule = (index: number) => {
    const field = activeEditLanguage === 'ar' ? 'modules_ar' : 'modules';
    setEditFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  // Add career opportunity
  const addCareer = () => {
    if (!newCareer.trim()) return;
    const field = activeEditLanguage === 'ar' ? 'careerOpportunities_ar' : 'careerOpportunities';
    setEditFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newCareer.trim()]
    }));
    setNewCareer('');
  };

  // Remove career opportunity
  const removeCareer = (index: number) => {
    const field = activeEditLanguage === 'ar' ? 'careerOpportunities_ar' : 'careerOpportunities';
    setEditFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  // Add key feature
  const addFeature = () => {
    if (!newFeature.title.trim() || !newFeature.description.trim()) return;
    const field = activeEditLanguage === 'ar' ? 'keyFeatures_ar' : 'keyFeatures';
    setEditFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), { ...newFeature }]
    }));
    setNewFeature({ title: '', description: '' });
  };

  // Remove key feature
  const removeFeature = (index: number) => {
    const field = activeEditLanguage === 'ar' ? 'keyFeatures_ar' : 'keyFeatures';
    setEditFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  // Extract data from pasted brochure text using ChatGPT for edit mode
  const extractDataFromText = async (brochureText: string) => {
    try {
      console.log('Using ChatGPT API for brochure text analysis...');
      console.log('Brochure text length:', brochureText.length);
      console.log('Current edit language:', activeEditLanguage);
      
      const apiKey = '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';
      
      console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
      
      // Adjust the system prompt based on the current language mode
      const systemPrompt = activeEditLanguage === 'ar' 
        ? `You are an expert at organizing educational program information from brochure text in Arabic. 

            CRITICAL RULE: You MUST ONLY extract text that actually exists in the provided brochure content. DO NOT generate, create, or write any new content.

            IMPORTANT: You MUST respond ONLY with a valid JSON object, no markdown formatting, no explanations, no extra text.

            Your task is to find and extract the EXACT text from the Arabic brochure for these fields:

            1. PROGRAM TITLE: Find the exact title as written in Arabic
            
            2. TAGLINE/SLOGAN: Find the exact marketing text or slogan as written in Arabic
            
            3. PROGRAM DESCRIPTION: 
               Look for the main program description paragraph in Arabic.
               Copy this text WORD FOR WORD exactly as it appears.
               DO NOT paraphrase, rewrite, or create new text.
               If you cannot find a clear description, return an empty string "".
            
            4. DURATION: Find the exact duration text in Arabic
            
            5. PROGRAM TYPE: Based on the program level, choose either "MBA" or "DBA". If unsure, default to "MBA".
            
            6. MODULES: Find the exact module/course names as listed in Arabic
            
            7. CAREER OPPORTUNITIES: Find the exact job titles as listed in Arabic
            
            8. KEY FEATURES: Find the exact feature names and descriptions as written in Arabic
            
            9. ACCREDITATION: Look for IBAS, VERN, or similar institutions

            10. SPECIALTY: Based on the program content, choose the MOST appropriate specialty. Return the ENGLISH version from this list:
                - Digital Transformation
                - Strategic Management
                - Healthcare Management
                - Project Management
                - Accounting & Finance Management
                - Marketing Management
                - Logistics & Supply Chain Management
                - Human Resources Management
                - Quality Management
                - Accounting & Finance
                - Entrepreneurship & Innovation
                - International Business Management
                - Sports Management
                - Hospitality & Events Management

            REMEMBER: 
            - ONLY extract text that actually exists in the Arabic brochure
            - DO NOT create or generate any content
            - Copy Arabic text exactly as written
            - For specialty, choose the English name from the list above that best matches the program content
            - If you cannot find something, use empty string "" or empty array []

            Return this exact JSON structure:
            {
              "title": "exact program title as found in Arabic brochure",
              "tagline": "exact marketing tagline as found in Arabic brochure", 
              "description": "EXACT program description as found in Arabic brochure - word for word",
              "duration": "exact duration as found in Arabic brochure",
              "programType": "MBA or DBA based on program level",
              "specialty": "English specialty name from the list above that best matches",
              "modules": ["exact module names as found in Arabic brochure"],
              "careerOpportunities": ["exact career titles as found in Arabic brochure"],
              "keyFeatures": [{"title": "Exact Feature Name from Arabic brochure", "description": "Exact feature description from Arabic brochure"}],
              "accreditation": "vern, ibas, both, or none"
            }`
        : `You are an expert at organizing educational program information from brochure text. 

            CRITICAL RULE: You MUST ONLY extract text that actually exists in the provided brochure content. DO NOT generate, create, or write any new content.

            IMPORTANT: You MUST respond ONLY with a valid JSON object, no markdown formatting, no explanations, no extra text.

            Your task is to find and extract the EXACT text from the brochure for these fields:

            1. PROGRAM TITLE: Find the exact title as written (usually contains "MBA", "Dual-Accredited", etc.)
            
            2. TAGLINE/SLOGAN: Find the exact marketing text or slogan as written
            
            3. PROGRAM DESCRIPTION: 
               Look for the main program description paragraph.
               Copy this text WORD FOR WORD exactly as it appears.
               DO NOT paraphrase, rewrite, or create new text.
               If you cannot find a clear description, return an empty string "".
            
            4. DURATION: Find the exact duration text (e.g., "1 Academic Year")
            
            5. PROGRAM TYPE: Based on the program level, choose either "MBA" or "DBA". If unsure, default to "MBA".
            
            6. MODULES: Find the exact module/course names as listed
            
            7. CAREER OPPORTUNITIES: Find the exact job titles as listed
            
            8. KEY FEATURES: Find the exact feature names and descriptions as written
            
            9. ACCREDITATION: Look for IBAS, VERN, or similar institutions

            10. SPECIALTY: Based on the program content, choose the MOST appropriate specialty. Return the ENGLISH version from this list:
                - Digital Transformation
                - Strategic Management
                - Healthcare Management
                - Project Management
                - Accounting & Finance Management
                - Marketing Management
                - Logistics & Supply Chain Management
                - Human Resources Management
                - Quality Management
                - Accounting & Finance
                - Entrepreneurship & Innovation
                - International Business Management
                - Sports Management
                - Hospitality & Events Management

            REMEMBER: 
            - ONLY extract text that actually exists in the brochure
            - DO NOT create or generate any content
            - Copy text exactly as written
            - For specialty, choose the English name from the list above that best matches the program content
            - If you cannot find something, use empty string "" or empty array []

            Return this exact JSON structure:
            {
              "title": "exact program title as found in brochure",
              "tagline": "exact marketing tagline as found in brochure", 
              "description": "EXACT program description as found in brochure - word for word",
              "duration": "exact duration as found in brochure",
              "programType": "MBA or DBA based on program level",
              "specialty": "English specialty name from the list above that best matches",
              "modules": ["exact module names as found in brochure"],
              "careerOpportunities": ["exact career titles as found in brochure"],
              "keyFeatures": [{"title": "Exact Feature Name from brochure", "description": "Exact feature description from brochure"}],
              "accreditation": "vern, ibas, both, or none"
            }`;
      
      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please organize this brochure text and extract the program information. Use ONLY the exact text provided, do not generate new content:

            ${brochureText}`
          }
        ],
        temperature: 0.1,
        max_tokens: 3000
      };
      
      console.log('Request body created, making API call...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ChatGPT API error response:', errorText);
        throw new Error(`ChatGPT API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Full ChatGPT API response:', JSON.stringify(data, null, 2));
      
      // Validate API response structure
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new Error('Invalid API response: no choices array found');
      }
      
      const choice = data.choices[0];
      if (!choice || !choice.message) {
        throw new Error('Invalid API response: no message found in choice');
      }
      
      const extractedContent = choice.message.content;

      if (!extractedContent) {
        throw new Error('No content received from ChatGPT API - message content is empty');
      }

      console.log('ChatGPT raw response:', extractedContent);

      // Parse the JSON response with improved extraction
      let parsedData;
      try {
        // Clean the response to extract JSON - try multiple methods
        let jsonString = extractedContent.trim();
        
        // Remove markdown code blocks if present
        jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        // Try to find JSON object boundaries more robustly
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        }
        
        // Additional cleaning
        jsonString = jsonString.trim();
        
        console.log('Cleaned JSON string:', jsonString.substring(0, 200) + '...');
        
        parsedData = JSON.parse(jsonString);
        
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Failed to parse:', extractedContent);
        
        // Try a more aggressive approach - extract just the content between first { and last }
        try {
          const firstBrace = extractedContent.indexOf('{');
          const lastBrace = extractedContent.lastIndexOf('}');
          
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonSubstring = extractedContent.substring(firstBrace, lastBrace + 1);
            console.log('Attempting to parse aggressive extraction:', jsonSubstring.substring(0, 200) + '...');
            parsedData = JSON.parse(jsonSubstring);
      } else {
            throw new Error('No valid JSON object boundaries found in response');
          }
        } catch (secondParseError) {
          console.error('Second JSON parsing attempt failed:', secondParseError);
          throw new Error('Failed to parse ChatGPT response as JSON. Response may be malformed.');
        }
      }

      // Validate that we have a valid object
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('ChatGPT response did not contain a valid JSON object');
      }

      // Find matching specialty pair based on AI result
      const selectedSpecialty = specialtyOptions.find(opt => 
        opt.en === parsedData.specialty
      ) || specialtyOptions.find(opt => opt.en === 'International Business Management');

      // Map program type to Arabic
      const programTypeMapping = {
        'MBA': 'ماجستير إدارة الأعمال',
        'DBA': 'دكتوراه إدارة الأعمال'
      };

      // Validate and structure the data
      const result = {
        title: parsedData.title || '',
        tagline: parsedData.tagline || '',
        description: parsedData.description || '',
        duration: parsedData.duration || '',
        programType: parsedData.programType || 'MBA',
        programType_ar: programTypeMapping[parsedData.programType as keyof typeof programTypeMapping] || 'ماجستير إدارة الأعمال',
        specialty: selectedSpecialty?.en || 'International Business Management',
        specialty_ar: selectedSpecialty?.ar || 'إدارة الأعمال الدولية',
        modules: Array.isArray(parsedData.modules) ? parsedData.modules : [],
        careerOpportunities: Array.isArray(parsedData.careerOpportunities) ? parsedData.careerOpportunities : [],
        keyFeatures: Array.isArray(parsedData.keyFeatures) ? parsedData.keyFeatures : [],
        accreditation: parsedData.accreditation || 'none'
      };

      console.log('ChatGPT parsing result:', {
        title: result.title,
        tagline: result.tagline.substring(0, 50) + '...',
        description: result.description.substring(0, 100) + '...',
        duration: result.duration,
        modulesCount: result.modules.length,
        modules: result.modules,
        careersCount: result.careerOpportunities.length,
        careers: result.careerOpportunities,
        featuresCount: result.keyFeatures.length,
        features: result.keyFeatures,
        accreditation: result.accreditation
      });

      console.log('Full extracted description:', result.description);

      return result;

    } catch (error) {
      console.error('ChatGPT extraction error:', error);
      throw new Error(`ChatGPT parsing failed: ${(error as Error).message}`);
    }
  };

  // Handle auto-fill for edit mode
  const handleAutoFill = async () => {
    if (!autoFillText.trim()) {
      setError(activeEditLanguage === 'en' ? 'Please paste your brochure text first' : 'يرجى لصق نص الكتيب أولاً');
      return;
    }

    setAutoFilling(true);
    setError('');
    setAutoFillSuccess('');

    try {
      console.log('Starting text analysis for edit mode in language:', activeEditLanguage);
      
      // Use ChatGPT API for intelligent text parsing
      const parsedData = await extractDataFromText(autoFillText);
      console.log('ChatGPT parsed data:', parsedData);

      // Update edit form with AI-extracted data based on current language
      if (activeEditLanguage === 'ar') {
        // Fill Arabic fields when in Arabic mode
        setEditFormData(prev => ({
          ...prev,
          title_ar: parsedData.title || prev.title_ar,
          tagline_ar: parsedData.tagline || prev.tagline_ar,
          description_ar: parsedData.description || prev.description_ar,
          duration_ar: parsedData.duration || prev.duration_ar,
          programType_ar: parsedData.programType_ar || prev.programType_ar,
          specialty_ar: parsedData.specialty_ar || prev.specialty_ar,
          modules_ar: parsedData.modules || prev.modules_ar,
          careerOpportunities_ar: parsedData.careerOpportunities || prev.careerOpportunities_ar,
          keyFeatures_ar: parsedData.keyFeatures || prev.keyFeatures_ar,
          // Also update the English equivalents for consistency
          programType: parsedData.programType || prev.programType,
          specialty: parsedData.specialty || prev.specialty,
          accreditation: parsedData.accreditation || prev.accreditation
        }));
      } else {
        // Fill English fields when in English mode
        setEditFormData(prev => ({
          ...prev,
          title: parsedData.title || prev.title,
          tagline: parsedData.tagline || prev.tagline,
          description: parsedData.description || prev.description,
          duration: parsedData.duration || prev.duration,
          programType: parsedData.programType || prev.programType,
          programType_ar: parsedData.programType_ar || prev.programType_ar,
          specialty: parsedData.specialty || prev.specialty,
          specialty_ar: parsedData.specialty_ar || prev.specialty_ar,
          modules: parsedData.modules || prev.modules,
          careerOpportunities: parsedData.careerOpportunities || prev.careerOpportunities,
          keyFeatures: parsedData.keyFeatures || prev.keyFeatures,
          accreditation: parsedData.accreditation || prev.accreditation
        }));
      }

      const successMessage = activeEditLanguage === 'en' 
        ? `Auto-fill successful! Detected accreditation: ${(parsedData.accreditation || 'none').toUpperCase()}`
        : `تم الملء التلقائي بنجاح! تم اكتشاف الاعتماد: ${(parsedData.accreditation || 'none').toUpperCase()}`;
      
      setAutoFillSuccess(successMessage);
      
      // Clear the auto-fill text after successful extraction
      setAutoFillText('');
      
    } catch (err) {
      console.error('Error in text parsing:', err);
      const errorMessage = activeEditLanguage === 'en' 
        ? 'Auto-fill failed. Please fill manually.'
        : 'فشل الملء التلقائي. يرجى الملء يدوياً.';
      setError(errorMessage);
    } finally {
      setAutoFilling(false);
    }
  };

  // Auto-translate English content to Arabic for edit mode
  const handleAutoTranslate = async () => {
    // Check if there's English content to translate
    if (!editFormData.title && !editFormData.tagline && !editFormData.description && 
        (!editFormData.modules || editFormData.modules.length === 0) && 
        (!editFormData.careerOpportunities || editFormData.careerOpportunities.length === 0) && 
        (!editFormData.keyFeatures || editFormData.keyFeatures.length === 0) && !editFormData.duration) {
      setError('No English content available to translate. Please fill the English version first.');
      return;
    }
    
    setTranslating(true);
    setError('');
    setTranslateSuccess('');

    try {
      console.log('Starting auto-translation from English to Arabic for edit mode...');

      const apiKey = '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';
      
      const contentToTranslate = {
        title: editFormData.title,
        tagline: editFormData.tagline,
        description: editFormData.description,
        duration: editFormData.duration,
        modules: editFormData.modules || [],
        careerOpportunities: editFormData.careerOpportunities || [],
        keyFeatures: editFormData.keyFeatures || []
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional Arabic translator specializing in educational content. 

              IMPORTANT: You MUST respond ONLY with a valid JSON object, no markdown formatting, no explanations, no extra text.

              Translate the following educational program content from English to Arabic:
              - Maintain professional, academic tone
              - Use proper Arabic terminology for business and educational concepts
              - Preserve the exact meaning and structure
              - For modules and features, translate each item individually
              - Keep the same JSON structure
              
              Return this exact JSON structure:
              {
                "title": "Arabic translation of title",
                "tagline": "Arabic translation of tagline", 
                "description": "Arabic translation of description",
                "duration": "Arabic translation of duration",
                "modules": ["Arabic translation of module1", "Arabic translation of module2", ...],
                "careerOpportunities": ["Arabic translation of career1", "Arabic translation of career2", ...],
                "keyFeatures": [{"title": "Arabic translation of feature title", "description": "Arabic translation of feature description"}, ...]
              }`
            },
            {
              role: 'user',
              content: `Translate this educational program content to Arabic:

              ${JSON.stringify(contentToTranslate, null, 2)}`
            }
          ],
          temperature: 0.1,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Translation API error:', errorText);
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Translation API response:', data);
      
      // Validate API response structure
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new Error('Invalid translation response: no choices array found');
      }
      
      const choice = data.choices[0];
      if (!choice || !choice.message) {
        throw new Error('Invalid translation response: no message found in choice');
      }
      
      const translatedContent = choice.message.content;

      if (!translatedContent) {
        throw new Error('No translated content received from API');
      }

      console.log('Raw translation response:', translatedContent);

      // Parse the JSON response
      let parsedTranslation;
      try {
        // Clean the response to extract JSON
        let jsonString = translatedContent.trim();
        
        // Remove markdown code blocks if present
        jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        // Try to find JSON object boundaries
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        }
        
        jsonString = jsonString.trim();
        console.log('Cleaned translation JSON:', jsonString.substring(0, 200) + '...');
        
        parsedTranslation = JSON.parse(jsonString);
        
      } catch (parseError) {
        console.error('Translation JSON parsing error:', parseError);
        throw new Error('Failed to parse translation response as JSON');
      }

      // Validate and apply translations to edit form
      const updatedEditFormData = { ...editFormData };
      
      if (parsedTranslation.title) updatedEditFormData.title_ar = parsedTranslation.title;
      if (parsedTranslation.tagline) updatedEditFormData.tagline_ar = parsedTranslation.tagline;
      if (parsedTranslation.description) updatedEditFormData.description_ar = parsedTranslation.description;
      if (parsedTranslation.duration) updatedEditFormData.duration_ar = parsedTranslation.duration;
      
      if (Array.isArray(parsedTranslation.modules)) {
        updatedEditFormData.modules_ar = parsedTranslation.modules;
      }
      
      if (Array.isArray(parsedTranslation.careerOpportunities)) {
        updatedEditFormData.careerOpportunities_ar = parsedTranslation.careerOpportunities;
      }
      
      if (Array.isArray(parsedTranslation.keyFeatures)) {
        updatedEditFormData.keyFeatures_ar = parsedTranslation.keyFeatures;
      }

      setEditFormData(updatedEditFormData);
      setTranslateSuccess('Translation completed successfully!');
      
      console.log('Translation completed successfully:', {
        title: parsedTranslation.title,
        modulesCount: parsedTranslation.modules?.length || 0,
        careersCount: parsedTranslation.careerOpportunities?.length || 0,
        featuresCount: parsedTranslation.keyFeatures?.length || 0
      });

    } catch (err) {
      console.error('Translation error:', err);
      setError('Translation failed. Please translate manually.');
    } finally {
      setTranslating(false);
    }
  };

  // Handle brochure upload for edit mode
  const handleEditBrochureChange = (e: React.ChangeEvent<HTMLInputElement>, language: 'en' | 'ar') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf')) {
        setError(activeEditLanguage === 'en' ? 'Please select a valid PDF file' : 'يرجى اختيار ملف PDF صحيح');
        return;
      }
      
      if (language === 'en') {
        setEditBrochureEnFile(file);
      } else {
        setEditBrochureArFile(file);
      }
      setError('');
    }
  };

  // Get current field value based on active language
  const getCurrentField = (field: string): any => {
    if (includeArabicEdit && activeEditLanguage === 'ar' && `${field}_ar` in editFormData) {
      return editFormData[`${field}_ar` as keyof typeof editFormData] || '';
    }
    return editFormData[field as keyof typeof editFormData] || '';
  };

  // Save program changes
  const saveProgram = async (programId: string) => {
    if (!editFormData.title?.trim()) {
      setError('Program title is required');
      return;
    }

    setEditLoading(true);
    setError('');

    try {
      let brochureEnUrl = '';
      let brochureArUrl = '';
      
      // Upload brochures if new files are provided
      try {
        if (editBrochureEnFile) {
          const timestamp = Date.now();
          const brochurePath = `brochures/${timestamp}-en.pdf`;
          console.log(`Uploading EN brochure: ${brochurePath}`);
          
          try {
            brochureEnUrl = await uploadFile(editBrochureEnFile, brochurePath);
            console.log('EN brochure uploaded successfully');
          } catch (storageError) {
            console.error('EN brochure upload failed:', storageError);
            brochureEnUrl = 'development-placeholder-en-brochure';
          }
        }
      } catch (uploadErr: any) {
        console.warn('English brochure upload failed:', uploadErr);
        // Continue without blocking
      }
      
      try {
        if (editBrochureArFile) {
          const timestamp = Date.now();
          const brochurePath = `brochures/${timestamp}-ar.pdf`;
          console.log(`Uploading AR brochure: ${brochurePath}`);
          
          try {
            brochureArUrl = await uploadFile(editBrochureArFile, brochurePath);
            console.log('AR brochure uploaded successfully');
          } catch (storageError) {
            console.error('AR brochure upload failed:', storageError);
            brochureArUrl = 'development-placeholder-ar-brochure';
          }
        }
      } catch (uploadErr: any) {
        console.warn('Arabic brochure upload failed:', uploadErr);
        // Continue without blocking
      }
      
      // Update the program in Firestore
      const programRef = doc(db, 'programs', programId);
      
      const updateData: any = {
        ...editFormData,
        hasArabicContent: includeArabicEdit,
        updatedAt: serverTimestamp()
      };
      
      // Update brochure URLs if new files were uploaded
      if (brochureEnUrl) {
        updateData.brochure_en = brochureEnUrl;
      }
      if (brochureArUrl) {
        updateData.brochure_ar = brochureArUrl;
      }

      // If Arabic is not enabled, remove Arabic fields
      if (!includeArabicEdit) {
        updateData.title_ar = deleteField();
        updateData.tagline_ar = deleteField();
        updateData.description_ar = deleteField();
        updateData.duration_ar = deleteField();
        updateData.programType_ar = deleteField();
        updateData.specialty_ar = deleteField();
        updateData.modules_ar = deleteField();
        updateData.careerOpportunities_ar = deleteField();
        updateData.keyFeatures_ar = deleteField();
      }

      await updateDoc(programRef, updateData);

      setEditSuccess('Program updated successfully!');
      setEditingProgram(null);
      setEditFormData({});
      setActiveEditLanguage('en');
      setIncludeArabicEdit(false);
      setNewModule('');
      setNewCareer('');
      setNewFeature({ title: '', description: '' });
      setEditBrochureEnFile(null);
      setEditBrochureArFile(null);
      setAutoFillText('');
      setAutoFillSuccess('');
      setTranslateSuccess('');
    } catch (err) {
      console.error('Error updating program:', err);
      setError('Failed to update program. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmation(id);
  };

  // Confirm delete
  const confirmDelete = async (id: string) => {
    setDeleteLoading(true);
    setError('');
    
    try {
      await deleteDoc(doc(db, 'programs', id));
      setDeleteConfirmation(null);
      setError('');
    } catch (err) {
      console.error('Error deleting program:', err);
      setError('Failed to delete program. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Import static program
  const importStaticProgram = async (staticProgram: Program) => {
      setIsImporting(true);
      setError('');
      
    try {
      const programData = {
        title: staticProgram.title,
        description: staticProgram.description || '',
        price: staticProgram.price || 0,
        category: staticProgram.category || '',
        speciality: staticProgram.speciality || '',
        duration: staticProgram.duration || '',
        studyTime: staticProgram.studyTime || '',
        status: 'draft' as const,
        level: staticProgram.level || '',
        programType: staticProgram.programType || 'Certificate',
        type: staticProgram.type || 'Professional Certificate',
        specialization: staticProgram.specialization || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser?.uid
      };

      await addDoc(collection(db, 'programs'), programData);
      setImportSuccess(`Successfully imported "${staticProgram.title}" as an admin program!`);
    } catch (err) {
      console.error('Error importing program:', err);
      setError('Failed to import program. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (programId: string, currentStatus: string) => {
    setStatusToggleLoading(programId);
    
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const programRef = doc(db, 'programs', programId);
      
      await updateDoc(programRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      setStatusSuccess(`Program ${newStatus === 'published' ? 'published' : 'moved to draft'} successfully!`);
    } catch (err) {
      console.error('Error updating program status:', err);
      setError('Failed to update program status. Please try again.');
    } finally {
      setStatusToggleLoading(null);
    }
  };

  // Redirect if not authorized
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/admin/login');
      return;
    }

    if (!isLoading && currentUser && userRole !== 'admin' && !hasPermission('programs')) {
      router.push('/admin/login');
    }
  }, [currentUser, userRole, isLoading, router, hasPermission]);

  // Filter and sort programs
  const filteredPrograms = programs
    .filter(program => {
      // Status filter
      if (filterStatus !== 'all' && program.status !== filterStatus) return false;
      
      // Type filter
      if (filterType === 'admin' && program.isStatic) return false;
      if (filterType === 'static' && !program.isStatic) return false;
      
      // Search filter
      if (searchTerm && !program.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Basic sorting by title
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage educational programs, courses, and offerings
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/programs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Link>
        </div>
      </div>

      {/* Success message */}
      {importSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{importSuccess}</span>
        </div>
      )}
      
      {statusSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <CheckCircle size={20} className="mr-2" />
            <span>{statusSuccess}</span>
          </div>
        </div>
      )}

      {editSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <CheckCircle size={20} className="mr-2" />
            <span>{editSuccess}</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      )}



      {/* Filters */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter Programs:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Status filter */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              
              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'admin' | 'static')}
                className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Types</option>
                <option value="admin">Admin Programs</option>
                <option value="static">Template Programs</option>
              </select>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary focus:border-primary min-w-[200px]"
              />
              
              {/* Sort order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <ChevronsUpDown className="h-4 w-4 mr-1" />
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Programs ({filteredPrograms.length})
          </h3>
          
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No programs found matching your criteria.</p>
                  <Link
                    href="/admin/programs/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Program
                  </Link>
                </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredPrograms.map((program) => (
                <li key={program.id} className="py-6">
                  {editingProgram === program.id ? (
                    // Edit Form
                    <div className="space-y-6" dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {/* Arabic Content Toggle */}
                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <div className="flex items-center justify-between">
                    <div className="flex items-center">
                            <input
                              id="include-arabic-edit"
                              type="checkbox"
                              checked={includeArabicEdit}
                              onChange={(e) => {
                                setIncludeArabicEdit(e.target.checked);
                                if (!e.target.checked) {
                                  setActiveEditLanguage('en');
                                }
                              }}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="include-arabic-edit" className="ml-3 text-sm font-medium text-gray-700">
                              Include Arabic version of the program
                            </label>
                          </div>
                          
                          {includeArabicEdit && (
                            <div className="flex rounded-md shadow-sm" role="group">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveEditLanguage('en');
                                  // Clear success messages when switching languages
                                  setAutoFillSuccess('');
                                  setTranslateSuccess('');
                                }}
                                className={`flex items-center justify-center px-3 py-2 rounded-l-md text-sm font-medium transition-colors ${
                                  activeEditLanguage === 'en'
                                    ? 'bg-white text-gray-900 shadow-sm border border-gray-300'
                                    : 'text-gray-500 hover:text-gray-700 border border-gray-300 bg-gray-100'
                                }`}
                              >
                                English
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveEditLanguage('ar');
                                  // Clear success messages when switching languages
                                  setAutoFillSuccess('');
                                  setTranslateSuccess('');
                                }}
                                className={`flex items-center justify-center px-3 py-2 rounded-r-md text-sm font-medium transition-colors ${
                                  activeEditLanguage === 'ar'
                                    ? 'bg-white text-gray-900 shadow-sm border border-gray-300'
                                    : 'text-gray-500 hover:text-gray-700 border border-gray-300 bg-gray-100'
                                }`}
                              >
                                العربية
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Auto-Fill Section */}
                      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <h3 className="text-lg font-semibold text-blue-900">
                            {activeEditLanguage === 'en' ? 'Auto-Fill from Brochure Text' : 'الملء التلقائي من نص الكتيب'}
                          </h3>
                        </div>
                        <p className="text-blue-700 mb-4">
                          {activeEditLanguage === 'en' 
                            ? 'Paste your program brochure text below and automatically organize it into the form fields.'
                            : 'أدخل نص كتيب البرنامج أدناه وسيتم تنظيمه تلقائياً في حقول النموذج.'
                          }
                        </p>
                        
                        <div className="space-y-4">
                          <textarea
                            rows={8}
                            placeholder={activeEditLanguage === 'en' ? 'Paste your complete brochure text here...' : 'أدخل نص الكتيب الكامل هنا...'}
                            value={autoFillText}
                            onChange={(e) => setAutoFillText(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          />
                          
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={handleAutoFill}
                              disabled={autoFilling || !autoFillText.trim()}
                              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {autoFilling 
                                ? (activeEditLanguage === 'en' ? 'Organizing...' : 'جاري التنظيم...')
                                : (activeEditLanguage === 'en' ? 'Organize Form' : 'تنظيم النموذج')
                              }
                              {autoFilling && (
                                <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                              )}
                            </button>
                            
                            <div className="text-sm text-blue-600">
                              {activeEditLanguage === 'en' 
                                ? 'Paste all your brochure text for best results'
                                : 'أدخل كامل نص الكتيب للحصول على أفضل النتائج'
                              }
                            </div>
                          </div>
                        </div>

                        {autoFillSuccess && (
                          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <div className="flex">
                              <span>{autoFillSuccess}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Auto-Translate Section - Only show for Arabic */}
                      {includeArabicEdit && activeEditLanguage === 'ar' && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <h3 className="text-lg font-semibold text-green-900">
                              ترجمة تلقائية من الإنجليزية
                            </h3>
                          </div>
                          <p className="text-green-700 mb-4">
                            اضغط على الزر أدناه لترجمة المحتوى الإنجليزي تلقائياً إلى العربية باستخدام الذكاء الاصطناعي.
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={handleAutoTranslate}
                              disabled={translating}
                              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {translating ? 'جاري الترجمة...' : 'ترجمة من الإنجليزية تلقائياً'}
                              {translating && (
                                <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              )}
                            </button>
                            
                            <div className="text-sm text-green-600">
                              يتطلب وجود محتوى في النسخة الإنجليزية أولاً
                            </div>
                          </div>

                          {translateSuccess && (
                            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                              <div className="flex">
                                <span>{translateSuccess}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Program Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeEditLanguage === 'en' ? 'Program Title *' : 'عنوان البرنامج *'}
                          </label>
                          <input
                            type="text"
                            value={getCurrentField('title')}
                            onChange={(e) => handleEditChange(activeEditLanguage === 'ar' ? 'title_ar' : 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder={activeEditLanguage === 'en' ? "e.g. DUAL MBA IN ACCOUNTING AND FINANCE" : "مثال: ماجستير إدارة الأعمال المزدوج في المحاسبة والمالية"}
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </div>

                        {/* Program Tagline */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeEditLanguage === 'en' ? 'Program Tagline' : 'شعار البرنامج'}
                          </label>
                          <input
                            type="text"
                            value={getCurrentField('tagline')}
                            onChange={(e) => handleEditChange(activeEditLanguage === 'ar' ? 'tagline_ar' : 'tagline', e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder={activeEditLanguage === 'en' ? "e.g. Empower Your Future with Internationally Accredited MBA and DBA Programs" : "مثال: عزز مستقبلك ببرامج ماجستير إدارة الأعمال ودكتوراه إدارة الأعمال المعتمدة دولياً"}
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeEditLanguage === 'en' ? 'Duration' : 'المدة'}
                          </label>
                          <input
                            type="text"
                            value={getCurrentField('duration')}
                            onChange={(e) => handleEditChange(activeEditLanguage === 'ar' ? 'duration_ar' : 'duration', e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder={activeEditLanguage === 'en' ? "e.g. 1 Academic Year" : "مثال: سنة أكاديمية واحدة"}
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </div>

                        {/* Program Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeEditLanguage === 'en' ? 'Program Type' : 'نوع البرنامج'}
                          </label>
                          <select
                            value={getCurrentField('programType')}
                            onChange={(e) => handleEditChange(activeEditLanguage === 'ar' ? 'programType_ar' : 'programType', e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          >
                            <option value={activeEditLanguage === 'ar' ? 'ماجستير إدارة الأعمال' : 'MBA'}>
                              {activeEditLanguage === 'en' ? 'MBA' : 'ماجستير إدارة الأعمال'}
                            </option>
                            <option value={activeEditLanguage === 'ar' ? 'دكتوراه إدارة الأعمال' : 'DBA'}>
                              {activeEditLanguage === 'en' ? 'DBA' : 'دكتوراه إدارة الأعمال'}
                            </option>
                          </select>
                        </div>

                        {/* Specialty */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeEditLanguage === 'en' ? 'Specialty' : 'التخصص'}
                          </label>
                          <select
                            value={getCurrentField('specialty')}
                            onChange={(e) => handleEditChange(activeEditLanguage === 'ar' ? 'specialty_ar' : 'specialty', e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          >
                            <option value="">
                              {activeEditLanguage === 'en' ? 'Select a specialty...' : 'اختر التخصص...'}
                            </option>
                            {specialtyOptions.map((specialty, index) => (
                              <option key={index} value={activeEditLanguage === 'ar' ? specialty.ar : specialty.en}>
                                {activeEditLanguage === 'ar' ? specialty.ar : specialty.en}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Accreditation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeEditLanguage === 'en' ? 'Accreditation' : 'الاعتماد الأكاديمي'}
                          </label>
                          <select
                            value={editFormData.accreditation || 'none'}
                            onChange={(e) => handleEditChange('accreditation', e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          >
                            <option value="none">{activeEditLanguage === 'en' ? 'None' : 'لا يوجد'}</option>
                            <option value="vern">{activeEditLanguage === 'en' ? 'VERN University' : 'جامعة فيرن'}</option>
                            <option value="ibas">{activeEditLanguage === 'en' ? 'IBAS Business School' : 'مدرسة آيباس للأعمال'}</option>
                            <option value="both">{activeEditLanguage === 'en' ? 'VERN & IBAS' : 'فيرن وآيباس'}</option>
                          </select>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeEditLanguage === 'en' ? 'Status' : 'حالة البرنامج'}
                          </label>
                          <select
                            value={editFormData.status || 'draft'}
                            onChange={(e) => handleEditChange('status', e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                          >
                            <option value="draft">{activeEditLanguage === 'en' ? 'Draft' : 'مسودة'}</option>
                            <option value="published">{activeEditLanguage === 'en' ? 'Published' : 'منشور'}</option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {activeEditLanguage === 'en' ? 'Description' : 'وصف البرنامج'}
                        </label>
                        <textarea
                          value={getCurrentField('description')}
                          onChange={(e) => handleEditChange(activeEditLanguage === 'ar' ? 'description_ar' : 'description', e.target.value)}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder={activeEditLanguage === 'en' ? "Detailed description of the program..." : "وصف مفصل للبرنامج..."}
                          dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      {/* Exclusive Program */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {activeEditLanguage === 'en' ? 'Exclusive Program' : 'برنامج حصري'}
                        </label>
                        <div className="flex items-center">
                          <input
                            id="exclusive-edit"
                            type="checkbox"
                            checked={editFormData.exclusive || false}
                            onChange={(e) => handleEditChange('exclusive', e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="exclusive-edit" className={`text-sm text-gray-700 ${activeEditLanguage === 'ar' ? 'mr-3' : 'ml-3'}`}>
                            {activeEditLanguage === 'en' ? 'This is an exclusive program' : 'هذا برنامج حصري'}
                          </label>
                        </div>
                <p className="mt-1 text-sm text-gray-500">
                          {activeEditLanguage === 'en' 
                            ? 'Exclusive programs are highlighted and given priority in the program listing' 
                            : 'البرامج الحصرية يتم تمييزها وإعطاؤها الأولوية في قائمة البرامج'}
                        </p>
                      </div>

                      {/* Program Overview (Modules) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {activeEditLanguage === 'en' ? 'Program Overview (Modules)' : 'نظرة عامة على البرنامج (الوحدات)'}
                        </label>
                        <div className="space-y-2">
                          {(activeEditLanguage === 'ar' ? editFormData.modules_ar : editFormData.modules)?.map((module, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <span dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}>{module}</span>
                              <button
                                type="button"
                                onClick={() => removeModule(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                </div>
                          ))}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newModule}
                              onChange={(e) => setNewModule(e.target.value)}
                              placeholder={activeEditLanguage === 'en' ? 'Enter module name' : 'أدخل اسم الوحدة'}
                              className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                            />
                            <button
                              type="button"
                              onClick={addModule}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              <Plus size={16} />
                            </button>
              </div>
                        </div>
                      </div>

                      {/* Career Opportunities */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {activeEditLanguage === 'en' ? 'Career Opportunities' : 'الفرص المهنية'}
                        </label>
                        <div className="space-y-2">
                          {(activeEditLanguage === 'ar' ? editFormData.careerOpportunities_ar : editFormData.careerOpportunities)?.map((career, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <span dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}>{career}</span>
                              <button
                                type="button"
                                onClick={() => removeCareer(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCareer}
                              onChange={(e) => setNewCareer(e.target.value)}
                              placeholder={activeEditLanguage === 'en' ? 'Enter career opportunity' : 'أدخل الفرصة المهنية'}
                              className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                            />
                            <button
                              type="button"
                              onClick={addCareer}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {activeEditLanguage === 'en' ? 'Key Features' : 'الميزات الرئيسية'}
                        </label>
                        <div className="space-y-2">
                          {(activeEditLanguage === 'ar' ? editFormData.keyFeatures_ar : editFormData.keyFeatures)?.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <div dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}>
                                <div className="font-medium">{feature.title}</div>
                                <div className="text-sm text-gray-600">{feature.description}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={newFeature.title}
                              onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                              placeholder={activeEditLanguage === 'en' ? 'Enter feature title' : 'أدخل عنوان الميزة'}
                              className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                            />
                            <input
                              type="text"
                              value={newFeature.description}
                              onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                              placeholder={activeEditLanguage === 'en' ? 'Enter feature description' : 'أدخل وصف الميزة'}
                              className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              dir={activeEditLanguage === 'ar' ? 'rtl' : 'ltr'}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={addFeature}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            <Plus size={16} className={`${activeEditLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
                            {activeEditLanguage === 'en' ? 'Add Key Feature' : 'إضافة ميزة رئيسية'}
                          </button>
                        </div>
                      </div>

                      {/* Brochure Upload */}
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          {activeEditLanguage === 'en' ? 'Brochure Files' : 'ملفات الكتيب'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {activeEditLanguage === 'en' ? 'Upload Brochure (English)' : 'رفع الكتيب (إنجليزي)'}
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleEditBrochureChange(e, 'en')}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                            {editBrochureEnFile && (
                              <p className="mt-1 text-sm text-green-600">
                                {activeEditLanguage === 'en' ? 'File selected:' : 'تم اختيار الملف:'} {editBrochureEnFile.name}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {activeEditLanguage === 'en' ? 'Upload Brochure (Arabic)' : 'رفع الكتيب (عربي)'}
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleEditBrochureChange(e, 'ar')}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                            {editBrochureArFile && (
                              <p className="mt-1 text-sm text-green-600">
                                {activeEditLanguage === 'en' ? 'File selected:' : 'تم اختيار الملف:'} {editBrochureArFile.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Photo Management */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-semibold text-gray-900">
                            {activeEditLanguage === 'en' ? 'Program Photos' : 'صور البرنامج'}
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowPhotoManager(!showPhotoManager)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            {showPhotoManager 
                              ? (activeEditLanguage === 'en' ? 'Hide Photo Manager' : 'إخفاء مدير الصور')
                              : (activeEditLanguage === 'en' ? 'Manage Photos' : 'إدارة الصور')
                            }
                          </button>
                        </div>
                        
                        {/* Current photos preview */}
                        {currentProgramPhotos.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                              {activeEditLanguage === 'en' 
                                ? `${currentProgramPhotos.length} photo(s) uploaded` 
                                : `تم رفع ${currentProgramPhotos.length} صورة`}
                            </p>
                            <div className="flex space-x-2 overflow-x-auto">
                              {currentProgramPhotos
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .slice(0, 5)
                                .map((photo) => (
                                  <div key={photo.id} className="relative flex-shrink-0">
                                    <img
                                      src={photo.url}
                                      alt={photo.altText || photo.fileName}
                                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    {photo.isPrimary && (
                                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                                        <span className="text-xs">★</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              {currentProgramPhotos.length > 5 && (
                                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                                  <span className="text-sm text-gray-500">+{currentProgramPhotos.length - 5}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Photo Manager */}
                        {showPhotoManager && (
                          <ProgramPhotoManager
                            programId={program.id}
                            photos={currentProgramPhotos}
                            onPhotosUpdate={handlePhotosUpdate}
                            language={activeEditLanguage}
                          />
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 pt-4">
                        <button
                          onClick={() => saveProgram(program.id)}
                          disabled={editLoading}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {editLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {editLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={editLoading}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900 truncate">{program.title}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              program.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {program.status}
                        </span>
                      {program.isStatic && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Template
                        </span>
                      )}
                    </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div>
                        <span className="font-medium mr-1">Type:</span> 
                        {program.programType || program.type || 'N/A'}
                      </div>
                          <div>
                            <span className="font-medium mr-1">Specialty:</span> 
                            {program.specialty || program.speciality || program.specialization || 'N/A'}
                      </div>
                          <div>
                        <span className="font-medium mr-1">Price:</span> 
                            {typeof program.price === 'number' 
                          ? `$${program.price.toLocaleString()}` 
                          : program.price || 'N/A'}
                      </div>
                          <div>
                        <span className="font-medium mr-1">Duration:</span> 
                        {program.studyTime || program.duration || 'N/A'}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {program.shortDescription || (program.description ? `${program.description.substring(0, 150)}...` : '')}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {program.isStatic ? (
                      <>
                        <button
                          onClick={() => importStaticProgram(program)}
                          disabled={isImporting}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          title="Import as Admin Program"
                        >
                          <Copy className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`/programs/${program.id}`}
                          target="_blank"
                          className="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          title="View Program"
                        >
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        </Link>
                            <button
                              onClick={() => startEditing(program)}
                              className="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              title="Edit Program"
                            >
                              <Edit3 className="h-5 w-5" aria-hidden="true" />
                            </button>
                        <button
                          onClick={() => {
                            setEditingProgram(program.id);
                            setCurrentProgramPhotos(program.photos || []);
                            setShowPhotoManager(true);
                          }}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          title="Manage Photos"
                        >
                          <Camera className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(program.id, program.status)}
                          disabled={statusToggleLoading === program.id}
                          className={`inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                            program.status === 'published' 
                              ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                              : 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                          }`}
                          title={program.status === 'published' ? 'Mark as Draft' : 'Publish Program'}
                        >
                          {statusToggleLoading === program.id ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            program.status === 'published' ? (
                              <BookmarkCheck className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <Bookmark className="h-5 w-5" aria-hidden="true" />
                            )
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(program.id)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Delete Program"
                        >
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                  )}

                  {/* Standalone Photo Manager */}
                  {editingProgram === program.id && showPhotoManager && !editFormData.title && (
                    <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Managing Photos for: {program.title}
                        </h4>
                        <button
                          onClick={() => {
                            setEditingProgram(null);
                            setShowPhotoManager(false);
                            setCurrentProgramPhotos([]);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Close
                        </button>
                      </div>
                      <ProgramPhotoManager
                        programId={program.id}
                        photos={currentProgramPhotos}
                        onPhotosUpdate={handlePhotosUpdate}
                        language="en"
                      />
                    </div>
                  )}

                {/* Delete confirmation */}
                {deleteConfirmation === program.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">Are you sure you want to delete this program? This action cannot be undone.</p>
                    <div className="mt-3 flex space-x-3">
                      <button
                        onClick={() => confirmDelete(program.id)}
                        disabled={deleteLoading}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
              ))}
        </ul>
          )}
        </div>
      </div>
    </div>
  );
} 