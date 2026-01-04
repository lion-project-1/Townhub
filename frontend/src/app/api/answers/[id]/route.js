import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api';

// PATCH /api/answers/[id]
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const url = `${BACKEND_URL}/answers/${id}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('답변 수정 프록시 실패:', error);
    return NextResponse.json(
      { success: false, code: 'PROXY_ERROR', message: '프록시 요청 실패' },
      { status: 500 }
    );
  }
}

// DELETE /api/answers/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    
    const url = `${BACKEND_URL}/answers/${id}`;
    
    const headers = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('답변 삭제 프록시 실패:', error);
    return NextResponse.json(
      { success: false, code: 'PROXY_ERROR', message: '프록시 요청 실패' },
      { status: 500 }
    );
  }
}

