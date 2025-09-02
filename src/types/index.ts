export interface Program {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  shortDescription?: string;
  shortDescription_ar?: string;
  level: 'bachelor' | 'mba' | 'dba';
  duration: string;
  duration_ar?: string;
  format: string[];
  category?: string;
  category_ar?: string;
  specialization?: string;
  specialization_ar?: string;
  price?: number;
  photos?: ProgramPhoto[];
  requirements?: string[];
  requirements_ar?: string[];
  whatYouWillLearn?: string[];
  whatYouWillLearn_ar?: string[];
  coreLearnings?: string[];
  coreLearnings_ar?: string[];
  languages?: ('en' | 'ar')[];
  status?: 'published' | 'draft';
  exclusive?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface ProgramPhoto {
  id: string;
  url: string;
  fileName: string;
  description?: string;
  description_ar?: string;
  altText?: string;
  altText_ar?: string;
  isPrimary?: boolean;
  displayOrder: number;
  uploadedAt: any;
}


export interface TeamMember {
  id: number;
  name: string;
  title: string;
  image: string;
  bio?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}