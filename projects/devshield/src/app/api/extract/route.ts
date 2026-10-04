import { NextRequest, NextResponse } from 'next/server';
import * as pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Server-side Guardrails
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 });
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or DOCX.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    try {
      if (file.type === 'application/pdf') {
        const data = await (pdf as any)(buffer);
        text = data.text;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      }
    } catch (extractionError) {
      console.error('Extraction Tool Error:', extractionError);
      return NextResponse.json({ error: 'Document appears to be corrupted or invalid. Please check the file and try again.' }, { status: 422 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during extraction.' }, { status: 500 });
  }
}
