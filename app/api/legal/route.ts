import { NextRequest, NextResponse } from 'next/server';
import termsService from '../../../src/services/termsService';

// GET endpoint to fetch active legal documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'terms' | 'privacy' | null;
    const language = searchParams.get('lang') as 'en' | 'ar' | null;

    if (type) {
      // Get specific document type
      const document = await termsService.getDocumentByType(type);
      
      if (!document) {
        return NextResponse.json(
          { error: `No active ${type} document found` },
          { status: 404 }
        );
      }

      // Return document with appropriate language content
      const response = {
        id: document.id,
        type: document.type,
        version: document.version,
        publishedAt: document.publishedAt,
        title: language === 'ar' && document.title_ar ? document.title_ar : document.title,
        content: language === 'ar' && document.content_ar ? document.content_ar : document.content,
        hasArabicVersion: !!(document.title_ar && document.content_ar),
        hasEnglishVersion: !!(document.title && document.content),
      };

      return NextResponse.json(response, { status: 200 });
    } else {
      // Get all active documents
      const documents = await termsService.getActiveDocuments();
      
      const response = documents.map(doc => ({
        id: doc.id,
        type: doc.type,
        version: doc.version,
        publishedAt: doc.publishedAt,
        title: language === 'ar' && doc.title_ar ? doc.title_ar : doc.title,
        content: language === 'ar' && doc.content_ar ? doc.content_ar : doc.content,
        hasArabicVersion: !!(doc.title_ar && doc.content_ar),
        hasEnglishVersion: !!(doc.title && doc.content),
      }));

      return NextResponse.json(response, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching legal documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal documents' },
      { status: 500 }
    );
  }
} 