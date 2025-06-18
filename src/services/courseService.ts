import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';
import { Course, Module, Lesson, CourseLevel, LessonType } from '../types/course';

// Collection references
const coursesRef = collection(db, 'courses');
const enrollmentsRef = collection(db, 'enrollments');

/**
 * Fetch all published courses
 */
export const getPublishedCourses = async (): Promise<Course[]> => {
  try {
    const q = query(
      coursesRef,
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Course));
  } catch (error) {
    console.error('Error fetching published courses:', error);
    throw error;
  }
};

/**
 * Fetch course by ID
 */
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const courseDoc = await getDoc(doc(coursesRef, courseId));
    
    if (courseDoc.exists()) {
      return {
        id: courseDoc.id,
        ...courseDoc.data()
      } as Course;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    throw error;
  }
};

/**
 * Fetch enrolled courses for a user
 */
export const getEnrolledCourses = async (userId: string): Promise<Course[]> => {
  try {
    // Get enrollments for the user
    const q = query(enrollmentsRef, where('userId', '==', userId));
    const enrollmentSnapshot = await getDocs(q);
    
    // Extract course IDs
    const courseIds = enrollmentSnapshot.docs.map(doc => doc.data().courseId);
    
    if (courseIds.length === 0) {
      return [];
    }
    
    // Get course details
    const courses: Course[] = [];
    
    for (const courseId of courseIds) {
      const courseData = await getCourseById(courseId);
      if (courseData) {
        courses.push(courseData);
      }
    }
    
    return courses;
  } catch (error) {
    console.error(`Error fetching enrolled courses for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Create a new course
 */
export const createCourse = async (courseData: Partial<Course>, thumbnail?: File): Promise<string> => {
  try {
    let thumbnailUrl = '';
    
    // Upload thumbnail if provided
    if (thumbnail) {
      const storageRef = ref(storage, `courses/thumbnails/${Date.now()}_${thumbnail.name}`);
      await uploadBytes(storageRef, thumbnail);
      thumbnailUrl = await getDownloadURL(storageRef);
    }
    
    // Create course document
    const newCourse = {
      ...courseData,
      thumbnail: thumbnailUrl || courseData.thumbnail || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPublished: false,
      modules: []
    };
    
    const docRef = await addDoc(coursesRef, newCourse);
    return docRef.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Update course information
 */
export const updateCourse = async (courseId: string, courseData: Partial<Course>, thumbnail?: File): Promise<void> => {
  try {
    const courseRef = doc(coursesRef, courseId);
    
    let updatedData: any = {
      ...courseData,
      updatedAt: serverTimestamp()
    };
    
    // Upload new thumbnail if provided
    if (thumbnail) {
      const storageRef = ref(storage, `courses/thumbnails/${Date.now()}_${thumbnail.name}`);
      await uploadBytes(storageRef, thumbnail);
      updatedData.thumbnail = await getDownloadURL(storageRef);
    }
    
    await updateDoc(courseRef, updatedData);
  } catch (error) {
    console.error(`Error updating course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    await deleteDoc(doc(coursesRef, courseId));
  } catch (error) {
    console.error(`Error deleting course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Create a new module in a course
 */
export const addModule = async (courseId: string, moduleData: Partial<Module>): Promise<string> => {
  try {
    const courseRef = doc(coursesRef, courseId);
    const courseDoc = await getDoc(courseRef);
    
    if (!courseDoc.exists()) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
    const courseData = courseDoc.data() as Course;
    const modules = courseData.modules || [];
    
    // Generate a unique ID for the module
    const moduleId = doc(collection(db, 'tempCollection')).id;
    
    const newModule: Module = {
      id: moduleId,
      title: moduleData.title || 'Untitled Module',
      description: moduleData.description || '',
      order: moduleData.order || modules.length + 1,
      lessons: []
    };
    
    modules.push(newModule);
    
    // Sort modules by order
    modules.sort((a, b) => a.order - b.order);
    
    await updateDoc(courseRef, {
      modules,
      updatedAt: serverTimestamp()
    });
    
    return moduleId;
  } catch (error) {
    console.error(`Error adding module to course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Add a lesson to a module
 */
export const addLesson = async (
  courseId: string, 
  moduleId: string, 
  lessonData: Partial<Lesson>
): Promise<string> => {
  try {
    const courseRef = doc(coursesRef, courseId);
    const courseDoc = await getDoc(courseRef);
    
    if (!courseDoc.exists()) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
    const courseData = courseDoc.data() as Course;
    const modules = courseData.modules || [];
    
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) {
      throw new Error(`Module with ID ${moduleId} not found in course ${courseId}`);
    }
    
    // Generate a unique ID for the lesson
    const lessonId = doc(collection(db, 'tempCollection')).id;
    
    const newLesson: Lesson = {
      id: lessonId,
      title: lessonData.title || 'Untitled Lesson',
      description: lessonData.description || '',
      type: lessonData.type || LessonType.TEXT,
      content: lessonData.content || '',
      videoUrl: lessonData.videoUrl || '',
      duration: lessonData.duration || 0,
      resources: lessonData.resources || [],
      order: lessonData.order || modules[moduleIndex].lessons.length + 1
    };
    
    modules[moduleIndex].lessons.push(newLesson);
    
    // Sort lessons by order
    modules[moduleIndex].lessons.sort((a, b) => a.order - b.order);
    
    await updateDoc(courseRef, {
      modules,
      updatedAt: serverTimestamp()
    });
    
    return lessonId;
  } catch (error) {
    console.error(`Error adding lesson to module ${moduleId} in course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Enroll a user in a course
 */
export const enrollUserInCourse = async (userId: string, courseId: string): Promise<string> => {
  try {
    // Check if user is already enrolled
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    
    const enrollmentSnapshot = await getDocs(q);
    
    if (!enrollmentSnapshot.empty) {
      throw new Error('User is already enrolled in this course');
    }
    
    // Create new enrollment
    const enrollment = {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      progress: 0,
      lastAccessedAt: serverTimestamp(),
      completedLessons: [],
      certificateIssued: false
    };
    
    const docRef = await addDoc(enrollmentsRef, enrollment);
    return docRef.id;
  } catch (error) {
    console.error(`Error enrolling user ${userId} in course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Mark a lesson as completed
 */
export const markLessonAsCompleted = async (
  userId: string,
  courseId: string,
  lessonId: string
): Promise<void> => {
  try {
    // Get enrollment document
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    
    const enrollmentSnapshot = await getDocs(q);
    
    if (enrollmentSnapshot.empty) {
      throw new Error('Enrollment not found');
    }
    
    const enrollmentDoc = enrollmentSnapshot.docs[0];
    const enrollmentData = enrollmentDoc.data();
    
    // Add lesson to completed lessons if not already there
    if (!enrollmentData.completedLessons.includes(lessonId)) {
      const completedLessons = [...enrollmentData.completedLessons, lessonId];
      
      // Get course to calculate progress
      const courseDoc = await getDoc(doc(coursesRef, courseId));
      
      if (!courseDoc.exists()) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      
      const courseData = courseDoc.data() as Course;
      
      // Count total lessons in the course
      let totalLessons = 0;
      courseData.modules.forEach(module => {
        totalLessons += module.lessons.length;
      });
      
      // Calculate progress percentage
      const progress = totalLessons > 0 
        ? Math.round((completedLessons.length / totalLessons) * 100) 
        : 0;
      
      // Update enrollment
      await updateDoc(doc(enrollmentsRef, enrollmentDoc.id), {
        completedLessons,
        progress,
        lastAccessedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error(`Error marking lesson ${lessonId} as completed:`, error);
    throw error;
  }
}; 