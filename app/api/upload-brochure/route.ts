import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const programId = formData.get('programId') as string;
    const language = formData.get('language') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Create buffer from file
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create directory structure
    const uploadDir = path.join(process.cwd(), 'public', 'brochures');
    await mkdir(uploadDir, { recursive: true });

    // Generate filename
    const fileName = `${programId}-${language}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/brochures/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: fileName,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 