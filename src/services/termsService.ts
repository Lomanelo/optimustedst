import { 
  doc, 
  getDoc, 
  setDoc, 
  collection,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface TermsDocument {
  id: string;
  type: 'terms' | 'privacy';
  title: string;
  title_ar?: string;
  content: string;
  content_ar?: string;
  version: string;
  isActive: boolean;
  publishedAt?: any;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
  updatedBy: string;
}

export interface TermsVersion {
  id: string;
  documentId: string;
  version: string;
  title: string;
  title_ar?: string;
  content: string;
  content_ar?: string;
  createdAt: any;
  createdBy: string;
  isArchived: boolean;
}

class TermsService {
  private termsCollection = collection(db, 'legal_documents');
  private versionsCollection = collection(db, 'legal_document_versions');

  /**
   * Get all terms documents
   */
  async getAllDocuments(): Promise<TermsDocument[]> {
    try {
      const q = query(this.termsCollection, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const documents: TermsDocument[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        } as TermsDocument);
      });
      
      return documents;
    } catch (error) {
      console.error('Error fetching terms documents:', error);
      throw error;
    }
  }

  /**
   * Get active terms documents
   */
  async getActiveDocuments(): Promise<TermsDocument[]> {
    try {
      const q = query(
        this.termsCollection, 
        where('isActive', '==', true),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const documents: TermsDocument[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        } as TermsDocument);
      });
      
      return documents;
    } catch (error) {
      console.error('Error fetching active terms documents:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<TermsDocument | null> {
    try {
      const docRef = doc(this.termsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as TermsDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  /**
   * Get document by type (terms or privacy)
   */
  async getDocumentByType(type: 'terms' | 'privacy'): Promise<TermsDocument | null> {
    try {
      const q = query(
        this.termsCollection,
        where('type', '==', type),
        where('isActive', '==', true),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as TermsDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching document by type:', error);
      throw error;
    }
  }

  /**
   * Create or update document
   */
  async saveDocument(
    documentData: Partial<TermsDocument>, 
    userId: string,
    isUpdate = false
  ): Promise<string> {
    try {
      const docId = documentData.id || `${documentData.type}_${Date.now()}`;
      const docRef = doc(this.termsCollection, docId);
      
      // Archive the current active document of the same type if publishing a new one
      if (documentData.isActive && documentData.type) {
        await this.deactivateDocumentsByType(documentData.type, docId);
      }

      // Save current version if updating
      if (isUpdate && documentData.id) {
        const currentDoc = await this.getDocumentById(documentData.id);
        if (currentDoc) {
          await this.archiveVersion(currentDoc, userId);
        }
      }

      const docData = {
        ...documentData,
        ...(isUpdate ? { updatedAt: serverTimestamp(), updatedBy: userId } : {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: userId,
          updatedBy: userId
        }),
        ...(documentData.isActive ? { publishedAt: serverTimestamp() } : {})
      };

      await setDoc(docRef, docData, { merge: isUpdate });
      
      return docId;
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  /**
   * Deactivate other documents of the same type
   */
  private async deactivateDocumentsByType(type: 'terms' | 'privacy', excludeId: string): Promise<void> {
    try {
      const q = query(
        this.termsCollection,
        where('type', '==', type),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const promises = querySnapshot.docs
        .filter(doc => doc.id !== excludeId)
        .map(doc => 
          setDoc(doc.ref, { 
            isActive: false, 
            updatedAt: serverTimestamp() 
          }, { merge: true })
        );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error deactivating documents:', error);
      throw error;
    }
  }

  /**
   * Archive a document version
   */
  private async archiveVersion(document: TermsDocument, userId: string): Promise<void> {
    try {
      const versionId = `${document.id}_v${document.version}_${Date.now()}`;
      const versionRef = doc(this.versionsCollection, versionId);
      
      const versionData: TermsVersion = {
        id: versionId,
        documentId: document.id,
        version: document.version,
        title: document.title,
        title_ar: document.title_ar,
        content: document.content,
        content_ar: document.content_ar,
        createdAt: serverTimestamp(),
        createdBy: userId,
        isArchived: true
      };
      
      await setDoc(versionRef, versionData);
    } catch (error) {
      console.error('Error archiving version:', error);
      throw error;
    }
  }

  /**
   * Get document versions
   */
  async getDocumentVersions(documentId: string): Promise<TermsVersion[]> {
    try {
      const q = query(
        this.versionsCollection,
        where('documentId', '==', documentId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const versions: TermsVersion[] = [];
      querySnapshot.forEach((doc) => {
        versions.push(doc.data() as TermsVersion);
      });
      
      return versions;
    } catch (error) {
      console.error('Error fetching document versions:', error);
      throw error;
    }
  }

  /**
   * Delete document (soft delete - deactivate)
   */
  async deleteDocument(id: string, userId: string): Promise<void> {
    try {
      const docRef = doc(this.termsCollection, id);
      await setDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
        updatedBy: userId
      }, { merge: true });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Publish document
   */
  async publishDocument(id: string, userId: string): Promise<void> {
    try {
      const document = await this.getDocumentById(id);
      if (!document) {
        throw new Error('Document not found');
      }

      // Deactivate other documents of the same type
      await this.deactivateDocumentsByType(document.type, id);

      const docRef = doc(this.termsCollection, id);
      await setDoc(docRef, {
        isActive: true,
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: userId
      }, { merge: true });
    } catch (error) {
      console.error('Error publishing document:', error);
      throw error;
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(): Promise<{
    totalDocuments: number;
    activeDocuments: number;
    draftDocuments: number;
    termsDocuments: number;
    privacyDocuments: number;
  }> {
    try {
      const allDocs = await this.getAllDocuments();
      
      return {
        totalDocuments: allDocs.length,
        activeDocuments: allDocs.filter(doc => doc.isActive).length,
        draftDocuments: allDocs.filter(doc => !doc.isActive).length,
        termsDocuments: allDocs.filter(doc => doc.type === 'terms').length,
        privacyDocuments: allDocs.filter(doc => doc.type === 'privacy').length,
      };
    } catch (error) {
      console.error('Error fetching document stats:', error);
      throw error;
    }
  }
}

const termsService = new TermsService();
export default termsService; 