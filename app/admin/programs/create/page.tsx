'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context';
import { useCMS } from '../../../contexts/cms-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../../src/firebase/firebase';
import { uploadFile, uploadImageAsDataUrl, compressImage } from '../../../../src/services/storageService';
import { Calendar, DollarSign, Clock, Award, Upload, ArrowLeft, AlertCircle, Check, Globe, Languages, X, Plus, Trash2, FileText, Zap, Shield } from 'lucide-react';

export default function CreateProgramPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const { currentLanguage } = useCMS();
  const router = useRouter();
  
  // Translations
  const translations = {
    en: {
      create_program: 'Create New Program',
      back_to_programs: 'Back to Programs',
      english: 'English',
      arabic: 'العربية',
      auto_fill_section: 'AI-Powered Auto-Fill from Text',
      upload_pdf_auto_fill: 'Paste Brochure Text for AI Analysis',
      auto_fill_button: 'Organize with AI',
      auto_filling: 'AI is analyzing text...',
      auto_fill_success: 'AI successfully organized program data!',
      auto_fill_error: 'AI analysis failed. Please fill manually.',
      pdf_processing: 'Processing with AI...',
      program_title: 'Program Title *',
      program_tagline: 'Program Tagline *',
      program_description: 'Program Description *',
      program_overview: 'Program Overview (Modules) *',
      career_opportunities: 'Career Opportunities *',
      key_features: 'Key Features *',
      duration: 'Duration *',
      accreditation: 'Accreditation *',
      accreditation_none: 'None',
      accreditation_vern: 'VERN University',
      accreditation_ibas: 'IBAS Business School',
      accreditation_both: 'VERN & IBAS',
      program_status: 'Program Status *',
      status_draft: 'Draft',
      status_published: 'Published',
      status_archived: 'Archived',
      brochure_upload: 'Upload Brochure',
      thumbnail_upload: 'Program Thumbnail',
      submit: 'Create Program',
      submitting: 'Creating...',
      add_module: 'Add Module',
      add_career: 'Add Career Opportunity',
      add_feature: 'Add Key Feature',
      module_title: 'Module Title',
      career_title: 'Career Title',
      feature_title: 'Feature Title',
      feature_description: 'Feature Description',
      success_message: 'Program created successfully!',
      error_message: 'Error creating program',
      required_field: 'This field is required',
      enter_module: 'Enter module name',
      enter_career: 'Enter career opportunity',
      enter_feature_title: 'Enter feature title',
      enter_feature_desc: 'Enter feature description',
      auto_translate: 'Auto-Translate from English',
      translating: 'Translating...',
      translate_success: 'Translation completed successfully!',
      translate_error: 'Translation failed. Please translate manually.'
    },
    ar: {
      create_program: 'إنشاء برنامج جديد',
      back_to_programs: 'العودة للبرامج',
      english: 'English',
      arabic: 'العربية',
      auto_fill_section: 'الملء التلقائي بالذكاء الاصطناعي من النص',
      upload_pdf_auto_fill: 'أدخل نص الكتيب للتحليل بالذكاء الاصطناعي',
      auto_fill_button: 'تنظيم بالذكاء الاصطناعي',
      auto_filling: 'الذكاء الاصطناعي يحلل النص...',
      auto_fill_success: 'نجح الذكاء الاصطناعي في تنظيم بيانات البرنامج!',
      auto_fill_error: 'فشل التحليل بالذكاء الاصطناعي. يرجى الملء يدوياً.',
      pdf_processing: 'جاري المعالجة بالذكاء الاصطناعي...',
      program_title: 'عنوان البرنامج *',
      program_tagline: 'شعار البرنامج *',
      program_description: 'وصف البرنامج *',
      program_overview: 'نظرة عامة على البرنامج (الوحدات) *',
      career_opportunities: 'الفرص المهنية *',
      key_features: 'الميزات الرئيسية *',
      duration: 'المدة *',
      accreditation: 'الاعتماد الأكاديمي *',
      accreditation_none: 'لا يوجد',
      accreditation_vern: 'جامعة فيرن',
      accreditation_ibas: 'مدرسة آيباس للأعمال',
      accreditation_both: 'فيرن وآيباس',
      program_status: 'حالة البرنامج *',
      status_draft: 'مسودة',
      status_published: 'منشور',
      status_archived: 'مؤرشف',
      brochure_upload: 'رفع الكتيب',
      thumbnail_upload: 'صورة البرنامج',
      submit: 'إنشاء البرنامج',
      submitting: 'جاري الإنشاء...',
      add_module: 'إضافة وحدة',
      add_career: 'إضافة فرصة مهنية',
      add_feature: 'إضافة ميزة رئيسية',
      module_title: 'عنوان الوحدة',
      career_title: 'المسمى الوظيفي',
      feature_title: 'عنوان الميزة',
      feature_description: 'وصف الميزة',
      success_message: 'تم إنشاء البرنامج بنجاح!',
      error_message: 'خطأ في إنشاء البرنامج',
      required_field: 'هذا الحقل مطلوب',
      enter_module: 'أدخل اسم الوحدة',
      enter_career: 'أدخل الفرصة المهنية',
      enter_feature_title: 'أدخل عنوان الميزة',
      enter_feature_desc: 'أدخل وصف الميزة',
      auto_translate: 'ترجمة من الإنجليزية تلقائياً',
      translating: 'جاري الترجمة...',
      translate_success: 'تم اكتمال الترجمة بنجاح!',
      translate_error: 'فشل الترجمة. يرجى الترجمة يدوياً.'
    }
  };

  const t = (key: keyof typeof translations.en) => translations[currentLanguage][key];

  // Form data based on brochure template
  const [formData, setFormData] = useState({
    // English fields
    title: '',
    tagline: '',
    description: '',
    modules: [] as string[],
    careerOpportunities: [] as string[],
    keyFeatures: [] as { title: string; description: string }[],
    duration: '',
    accreditation: 'none', // none, vern, ibas, both
    status: 'draft', // draft, published, archived
    brochure_en: '',
    
    // Arabic fields
    title_ar: '',
    tagline_ar: '',
    description_ar: '',
    modules_ar: [] as string[],
    careerOpportunities_ar: [] as string[],
    keyFeatures_ar: [] as { title: string; description: string }[],
    duration_ar: '',
    brochure_ar: ''
  });

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ar'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [brochureEnFile, setBrochureEnFile] = useState<File | null>(null);
  const [brochureArFile, setBrochureArFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // Auto-fill states
  const [autoFillText, setAutoFillText] = useState('');
  const [autoFilling, setAutoFilling] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState('');

  // Translation states
  const [translating, setTranslating] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState('');

  // Input states for adding items
  const [newModule, setNewModule] = useState('');
  const [newCareer, setNewCareer] = useState('');
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/admin/login');
      return;
    }

    if (!isLoading && currentUser && userRole !== 'admin' && !hasPermission('programs')) {
      router.push('/admin/login');
    }
  }, [currentUser, userRole, isLoading, router, hasPermission]);

  // Extract data from pasted brochure text using ChatGPT
  const extractDataFromText = async (brochureText: string) => {
    try {
      console.log('Using ChatGPT API for brochure text analysis...');
      console.log('Brochure text length:', brochureText.length);
      
      const apiKey = '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';
      
      console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
      
      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at organizing educational program information from brochure text. 

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
            
            5. MODULES: Find the exact module/course names as listed
            
            6. CAREER OPPORTUNITIES: Find the exact job titles as listed
            
            7. KEY FEATURES: Find the exact feature names and descriptions as written
            
            8. ACCREDITATION: Look for IBAS, VERN, or similar institutions

            REMEMBER: 
            - ONLY extract text that actually exists in the brochure
            - DO NOT create or generate any content
            - Copy text exactly as written
            - If you cannot find something, use empty string "" or empty array []

            Return this exact JSON structure:
            {
              "title": "exact program title as found in brochure",
              "tagline": "exact marketing tagline as found in brochure", 
              "description": "EXACT program description as found in brochure - word for word",
              "duration": "exact duration as found in brochure",
              "modules": ["exact module names as found in brochure"],
              "careerOpportunities": ["exact career titles as found in brochure"],
              "keyFeatures": [{"title": "Exact Feature Name from brochure", "description": "Exact feature description from brochure"}],
              "accreditation": "vern, ibas, both, or none"
            }`
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

      // Validate and structure the data
      const result = {
        title: parsedData.title || 'MBA Program',
        tagline: parsedData.tagline || 'Excellence in Business Education',
        description: parsedData.description || 'This comprehensive program prepares professionals for leadership roles.',
        duration: parsedData.duration || '1 Academic Year',
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

  

  const handleAutoFill = async () => {
    if (!autoFillText.trim()) {
      setError('Please paste your brochure text first');
      return;
    }

    setAutoFilling(true);
    setError('');
    setAutoFillSuccess('');

    try {
      console.log('Starting text analysis...');
      
      // Use ChatGPT API for intelligent text parsing
      const parsedData = await extractDataFromText(autoFillText);
      console.log('ChatGPT parsed data:', parsedData);

      // Update form with AI-extracted data
      setFormData(prev => ({
        ...prev,
        title: parsedData.title || prev.title,
        tagline: parsedData.tagline || prev.tagline,
        description: parsedData.description || prev.description,
        duration: parsedData.duration || prev.duration,
        modules: parsedData.modules || prev.modules,
        careerOpportunities: parsedData.careerOpportunities || prev.careerOpportunities,
        keyFeatures: parsedData.keyFeatures || prev.keyFeatures,
        accreditation: parsedData.accreditation || prev.accreditation,
        status: 'draft'
      }));

      setAutoFillSuccess(`${t('auto_fill_success')} Detected accreditation: ${(parsedData.accreditation || 'none').toUpperCase()}`);
      
      // Clear the auto-fill text after successful extraction
      setAutoFillText('');
      
    } catch (err) {
      console.error('Error in text parsing:', err);
      setError(t('auto_fill_error'));
    } finally {
      setAutoFilling(false);
    }
  };

  // Auto-translate English content to Arabic using ChatGPT
  const handleAutoTranslate = async () => {
    // Check if there's English content to translate
    if (!formData.title && !formData.tagline && !formData.description && 
        formData.modules.length === 0 && formData.careerOpportunities.length === 0 && 
        formData.keyFeatures.length === 0 && !formData.duration) {
      setError('No English content available to translate. Please fill the English version first.');
      return;
    }
    
    setTranslating(true);
    setError('');
    setTranslateSuccess('');

    try {
      console.log('Starting auto-translation from English to Arabic...');

      const apiKey = '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';
      
      const contentToTranslate = {
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        duration: formData.duration,
        modules: formData.modules,
        careerOpportunities: formData.careerOpportunities,
        keyFeatures: formData.keyFeatures
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

      // Validate and apply translations
      const updatedFormData = { ...formData };
      
      if (parsedTranslation.title) updatedFormData.title_ar = parsedTranslation.title;
      if (parsedTranslation.tagline) updatedFormData.tagline_ar = parsedTranslation.tagline;
      if (parsedTranslation.description) updatedFormData.description_ar = parsedTranslation.description;
      if (parsedTranslation.duration) updatedFormData.duration_ar = parsedTranslation.duration;
      
      if (Array.isArray(parsedTranslation.modules)) {
        updatedFormData.modules_ar = parsedTranslation.modules;
      }
      
      if (Array.isArray(parsedTranslation.careerOpportunities)) {
        updatedFormData.careerOpportunities_ar = parsedTranslation.careerOpportunities;
      }
      
      if (Array.isArray(parsedTranslation.keyFeatures)) {
        updatedFormData.keyFeatures_ar = parsedTranslation.keyFeatures;
      }

      setFormData(updatedFormData);
      setTranslateSuccess(t('translate_success'));
      
      console.log('Translation completed successfully:', {
        title: parsedTranslation.title,
        modulesCount: parsedTranslation.modules?.length || 0,
        careersCount: parsedTranslation.careerOpportunities?.length || 0,
        featuresCount: parsedTranslation.keyFeatures?.length || 0
      });

    } catch (err) {
      console.error('Translation error:', err);
      setError(t('translate_error'));
    } finally {
      setTranslating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear success messages when user starts editing
    setAutoFillSuccess('');
    setTranslateSuccess('');
  };

  const addModule = () => {
    if (!newModule.trim()) return;
    const field = activeLanguage === 'ar' ? 'modules_ar' : 'modules';
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newModule.trim()]
    }));
    setNewModule('');
  };

  const removeModule = (index: number) => {
    const field = activeLanguage === 'ar' ? 'modules_ar' : 'modules';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addCareer = () => {
    if (!newCareer.trim()) return;
    const field = activeLanguage === 'ar' ? 'careerOpportunities_ar' : 'careerOpportunities';
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newCareer.trim()]
    }));
    setNewCareer('');
  };

  const removeCareer = (index: number) => {
    const field = activeLanguage === 'ar' ? 'careerOpportunities_ar' : 'careerOpportunities';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (!newFeature.title.trim() || !newFeature.description.trim()) return;
    const field = activeLanguage === 'ar' ? 'keyFeatures_ar' : 'keyFeatures';
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { ...newFeature }]
    }));
    setNewFeature({ title: '', description: '' });
  };

  const removeFeature = (index: number) => {
    const field = activeLanguage === 'ar' ? 'keyFeatures_ar' : 'keyFeatures';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>, language: 'en' | 'ar') => {
    const file = e.target.files?.[0];
    if (file) {
      if (language === 'en') {
        setBrochureEnFile(file);
          } else {
        setBrochureArFile(file);
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setThumbnailFile(file);
      
      // Create preview - this will be used as a fallback in development
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const previewUrl = e.target.result as string;
          setThumbnailPreview(previewUrl);
          console.log('Thumbnail preview created successfully');
        }
      };
      reader.onerror = (error) => {
        console.error('Error creating thumbnail preview:', error);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let brochureEnUrl = '';
      let brochureArUrl = '';
      let thumbnailUrl = '';
      
      // Upload files if provided - make uploads optional to avoid blocking form submission
      try {
        if (brochureEnFile) {
          const timestamp = Date.now();
          const brochurePath = `brochures/${timestamp}-en.pdf`;
          console.log(`Uploading EN brochure: ${brochurePath}`);
          
          try {
            brochureEnUrl = await uploadFile(brochureEnFile, brochurePath);
            console.log('EN brochure uploaded successfully');
            
          } catch (storageError) {
            console.error('EN brochure upload failed:', storageError);
            brochureEnUrl = 'development-placeholder-en-brochure';
          }
        }
      } catch (uploadErr: any) {
        console.warn('English brochure upload failed:', uploadErr);
        brochureEnUrl = 'development-placeholder-en-brochure';
        // Continue without blocking
      }
      
      try {
        if (brochureArFile) {
          const timestamp = Date.now();
          const brochurePath = `brochures/${timestamp}-ar.pdf`;
          console.log(`Uploading AR brochure: ${brochurePath}`);
          
          try {
            brochureArUrl = await uploadFile(brochureArFile, brochurePath);
            console.log('AR brochure uploaded successfully');
            
          } catch (storageError) {
            console.error('AR brochure upload failed:', storageError);
            brochureArUrl = 'development-placeholder-ar-brochure';
          }
        }
      } catch (uploadErr: any) {
        console.warn('Arabic brochure upload failed:', uploadErr);
        brochureArUrl = 'development-placeholder-ar-brochure';
        // Continue without blocking
      }
      
      try {
        if (thumbnailFile) {
          const timestamp = Date.now();
          const fileExtension = thumbnailFile.type.split('/')[1] || 'png';
          const thumbnailPath = `thumbnails/${timestamp}-thumbnail.${fileExtension}`;
          console.log(`Uploading thumbnail: ${thumbnailPath}`);
          
          thumbnailUrl = await uploadFile(thumbnailFile, thumbnailPath);
          console.log('Thumbnail uploaded successfully');
        }
      } catch (uploadErr: any) {
        console.error('Thumbnail upload failed:', uploadErr);
        throw new Error(`Thumbnail upload failed: ${uploadErr.message}`);
      }

      const programData = {
        ...formData,
        brochure_en: brochureEnUrl,
        brochure_ar: brochureArUrl,
        thumbnail: thumbnailUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser?.uid
      };

      const docRef = await addDoc(collection(db, 'programs'), programData);
      
      setSuccess(t('success_message'));
      setTimeout(() => {
        router.push('/admin/programs');
      }, 2000);

    } catch (err) {
      console.error('Error creating program:', err);
      setError(t('error_message'));
    } finally {
      setLoading(false);
    }
  };

  const getCurrentField = (field: keyof typeof formData): any => {
    // For language-specific fields, check if Arabic version exists when in Arabic mode
    if (activeLanguage === 'ar' && `${field}_ar` in formData) {
      return formData[`${field}_ar` as keyof typeof formData] || '';
    }
    // For fields that don't have language variants (accreditation, status), always return the main field
    return formData[field] || '';
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {t('create_program')}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/programs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <ArrowLeft size={16} className={`${currentLanguage === 'ar' ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('back_to_programs')}
          </Link>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <Check size={20} className={`${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Language Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setActiveLanguage('en');
              setError('');
              setTranslateSuccess('');
              setAutoFillSuccess('');
            }}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'en' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe size={16} className="mr-2" />
            {t('english')}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveLanguage('ar');
              setError('');
              setTranslateSuccess('');
              setAutoFillSuccess('');
            }}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'ar' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Languages size={16} className="mr-2" />
            {t('arabic')}
          </button>
        </div>
        
        {/* Auto-Translate Section - Only show for Arabic */}
        {activeLanguage === 'ar' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Languages size={24} className="mr-3 text-green-600" />
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
                <Languages size={16} className="ml-2" />
                {translating ? t('translating') : t('auto_translate')}
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
                  <Check size={20} className="mr-2" />
                  <span>{translateSuccess}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Auto-Fill Text Section */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Zap size={24} className="mr-3 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">
              {activeLanguage === 'en' ? 'Auto-Fill from Brochure Text' : 'الملء التلقائي من نص الكتيب'}
            </h3>
          </div>
          <p className="text-blue-700 mb-4">
            {activeLanguage === 'en' 
              ? 'Paste your program brochure text below and automatically organize it into the form fields.'
              : 'أدخل نص كتيب البرنامج أدناه وسيتم تنظيمه تلقائياً في حقول النموذج.'
            }
          </p>
          
          <div className="space-y-4">
            <textarea
              rows={10}
              placeholder={activeLanguage === 'en' ? 'Paste your complete brochure text here...' : 'أدخل نص الكتيب الكامل هنا...'}
              value={autoFillText}
              onChange={(e) => setAutoFillText(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={autoFilling || !autoFillText.trim()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={16} className="mr-2" />
                {autoFilling 
                  ? (activeLanguage === 'en' ? 'Organizing...' : 'جاري التنظيم...')
                  : (activeLanguage === 'en' ? 'Organize Form' : 'تنظيم النموذج')
                }
                {autoFilling && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
              
              <div className="text-sm text-blue-600">
                {activeLanguage === 'en' 
                  ? 'Paste all your brochure text for best results'
                  : 'أدخل كامل نص الكتيب للحصول على أفضل النتائج'
                }
              </div>
            </div>
          </div>

          {autoFillSuccess && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <div className="flex">
                <Check size={20} className="mr-2" />
                <span>{autoFillSuccess}</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Program Title */}
            <div>
            <label className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Program Title *' : 'عنوان البرنامج *'}
              </label>
              <input
                type="text"
              name={activeLanguage === 'ar' ? 'title_ar' : 'title'}
                required
              value={getCurrentField('title')}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? "e.g. DUAL MBA IN ACCOUNTING AND FINANCE" : "مثال: ماجستير إدارة الأعمال المزدوج في المحاسبة والمالية"}
              dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

          {/* Program Tagline */}
            <div>
            <label className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Program Tagline *' : 'شعار البرنامج *'}
              </label>
              <input
                type="text"
              name={activeLanguage === 'ar' ? 'tagline_ar' : 'tagline'}
                required
              value={getCurrentField('tagline')}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? "e.g. Empower Your Future with Internationally Accredited MBA and DBA Programs" : "مثال: عزز مستقبلك ببرامج ماجستير إدارة الأعمال ودكتوراه إدارة الأعمال المعتمدة دولياً"}
              dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
              />
          </div>

          {/* Program Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Program Description *' : 'وصف البرنامج *'}
            </label>
            <textarea
              name={activeLanguage === 'ar' ? 'description_ar' : 'description'}
              rows={4}
              required
              value={getCurrentField('description')}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? "Detailed description of the program..." : "وصف مفصل للبرنامج..."}
              dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Duration *' : 'المدة *'}
            </label>
              <input
                type="text"
              name={activeLanguage === 'ar' ? 'duration_ar' : 'duration'}
              required
              value={getCurrentField('duration')}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={activeLanguage === 'en' ? "e.g. 1 Academic Year" : "مثال: سنة أكاديمية واحدة"}
              dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Accreditation */}
            <div>
            <label className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Accreditation *' : 'الاعتماد الأكاديمي *'}
              </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accreditation"
                  value="none"
                  checked={getCurrentField('accreditation') === 'none'}
                onChange={handleChange}
                  className="mr-2"
                />
                {t('accreditation_none')}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accreditation"
                  value="vern"
                  checked={getCurrentField('accreditation') === 'vern'}
                onChange={handleChange}
                  className="mr-2"
                />
                {t('accreditation_vern')}
              </label>
              <label className="flex items-center">
              <input
                  type="radio"
                  name="accreditation"
                  value="ibas"
                  checked={getCurrentField('accreditation') === 'ibas'}
                onChange={handleChange}
                  className="mr-2"
                />
                {t('accreditation_ibas')}
              </label>
              <label className="flex items-center">
              <input
                  type="radio"
                  name="accreditation"
                  value="both"
                  checked={getCurrentField('accreditation') === 'both'}
                onChange={handleChange}
                  className="mr-2"
              />
                {t('accreditation_both')}
              </label>
            </div>
          </div>

          {/* Program Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Program Status *' : 'حالة البرنامج *'}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={getCurrentField('status') === 'draft'}
              onChange={handleChange}
                  className="mr-2"
                />
                {t('status_draft')}
            </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={getCurrentField('status') === 'published'}
              onChange={handleChange}
                  className="mr-2"
                />
                {t('status_published')}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="archived"
                  checked={getCurrentField('status') === 'archived'}
                  onChange={handleChange}
                  className="mr-2"
                />
                {t('status_archived')}
              </label>
            </div>
          </div>

          {/* Program Overview (Modules) */}
                  <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {activeLanguage === 'en' ? 'Program Overview (Modules) *' : 'نظرة عامة على البرنامج (الوحدات) *'}
            </label>
            <div className="space-y-2">
              {(activeLanguage === 'ar' ? formData.modules_ar : formData.modules).map((module, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <span dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>{module}</span>
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
                  placeholder={activeLanguage === 'en' ? 'Enter module name' : 'أدخل اسم الوحدة'}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
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
              {activeLanguage === 'en' ? 'Career Opportunities *' : 'الفرص المهنية *'}
                    </label>
            <div className="space-y-2">
              {(activeLanguage === 'ar' ? formData.careerOpportunities_ar : formData.careerOpportunities).map((career, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <span dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>{career}</span>
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
                  placeholder={activeLanguage === 'en' ? 'Enter career opportunity' : 'أدخل الفرصة المهنية'}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
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
              {activeLanguage === 'en' ? 'Key Features *' : 'الميزات الرئيسية *'}
            </label>
            <div className="space-y-3">
              {(activeLanguage === 'ar' ? formData.keyFeatures_ar : formData.keyFeatures).map((feature, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                    </div>
                      <button
                        type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <Trash2 size={16} />
                      </button>
                    </div>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                  type="text"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={activeLanguage === 'en' ? 'Enter feature title' : 'أدخل عنوان الميزة'}
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
                <input
                  type="text"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={activeLanguage === 'en' ? 'Enter feature description' : 'أدخل وصف الميزة'}
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
                        </div>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus size={16} className={`${activeLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {activeLanguage === 'en' ? 'Add Key Feature' : 'إضافة ميزة رئيسية'}
              </button>
                        </div>
                      </div>

          {/* Brochure Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
              <label className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Upload Brochure (English)' : 'رفع الكتيب (إنجليزي)'}
                </label>
                        <input
                          type="file"
                accept=".pdf"
                onChange={(e) => handleBrochureChange(e, 'en')}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">
                {activeLanguage === 'en' ? 'Upload Brochure (Arabic)' : 'رفع الكتيب (عربي)'}
                      </label>
                <input
                  type="file"
                accept=".pdf"
                onChange={(e) => handleBrochureChange(e, 'ar')}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
                </div>
              </div>

          {/* Thumbnail Upload */}
                              <div>
            <label className="block text-sm font-medium text-gray-700">
              {activeLanguage === 'en' ? 'Program Thumbnail' : 'صورة البرنامج'}
                </label>
                <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
            {thumbnailPreview && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">
                  {activeLanguage === 'en' ? 'Thumbnail Preview:' : 'معاينة الصورة:'}
                </h4>
                <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 max-w-sm h-auto rounded-md" />
                                </div>
            )}
              </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (activeLanguage === 'en' ? 'Creating...' : 'جاري الإنشاء...')
                : (activeLanguage === 'en' ? 'Create Program' : 'إنشاء البرنامج')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 