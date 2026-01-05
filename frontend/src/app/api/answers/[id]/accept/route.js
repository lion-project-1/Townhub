import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api';

// PATCH /api/answers/[id]/accept
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    
    const url = `${BACKEND_URL}/answers/${id}/accept`;
    
    const headers = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('답변 채택 프록시 실패:', error);
    return NextResponse.json(
      { success: false, code: 'PROXY_ERROR', message: '프록시 요청 실패' },
      { status: 500 }
    );
  }
}




