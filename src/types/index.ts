export interface Program {
  id: string;
  title: string;
  description: string;
  level: 'bachelor' | 'mba' | 'dba';
  duration: string;
  format: string[];
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