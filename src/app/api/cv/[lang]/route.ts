import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const CV_FILES = {
  english: {
    path: '/documents/cv-english.pdf',
    filename: 'CV_Aga_Putra_English.pdf',
  },
  indonesian: {
    path: '/documents/cv-indonesian.pdf',
    filename: 'CV_Aga_Putra_Indonesian.pdf',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const cv = CV_FILES[lang as keyof typeof CV_FILES];

  if (!cv) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }

  const baseUrl = request.nextUrl.origin;
  const fileUrl = `${baseUrl}${cv.path}`;

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}
