export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category?: string;
  level: CourseLevel;
  duration: string; // Human-readable duration (e.g., "4 weeks")
  durationHours?: number; // in hours
  lessons?: number; // Total number of lessons
  modules: Module[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  instructor: Instructor;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  content: string;
  videoUrl?: string;
  duration?: number; // in minutes
  resources?: Resource[];
  order: number;
  isCompleted?: boolean; // For student tracking
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  email: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  lastAccessedAt: string;
  completedLessons: string[]; // Array of lesson ids
  certificateIssued: boolean;
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum LessonType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment'
}

export enum ResourceType {
  PDF = 'pdf',
  DOCUMENT = 'document',
  LINK = 'link',
  DOWNLOAD = 'download'
} 