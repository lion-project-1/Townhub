import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api';

// GET /api/questions/[id]/answers
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    const url = `${BACKEND_URL}/questions/${id}/answers`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const res = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('답변 목록 조회 프록시 실패:', error);
    return NextResponse.json(
      { success: false, code: 'PROXY_ERROR', message: '프록시 요청 실패' },
      { status: 500 }
    );
  }
}

// POST /api/questions/[id]/answers
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const url = `${BACKEND_URL}/questions/${id}/answers`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('답변 등록 프록시 실패:', error);
    return NextResponse.json(
      { success: false, code: 'PROXY_ERROR', message: '프록시 요청 실패' },
      { status: 500 }
    );
  }
}

