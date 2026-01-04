'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, X, UserMinus, ArrowLeft } from 'lucide-react';

export default function GroupManagePage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('requests');

  const requests = [
    { id: 1, name: '박민수', message: '등산을 좋아해서 가입하고 싶습니다!', date: '2025-01-20' },
    { id: 2, name: '최지영', message: '건강한 취미 생활을 함께 하고 싶어요', date: '2025-01-19' },
  ];

  const members = [
    { id: 1, name: '김철수', role: '모임장', joinedAt: '2025-01-01' },
    { id: 2, name: '이영희', role: '멤버', joinedAt: '2025-01-05' },
    { id: 3, name: '홍길동', role: '멤버', joinedAt: '2025-01-10' },
  ];

  const handleApprove = (requestId) => {
    alert(`가입 승인: ${requestId}`);
  };

  const handleReject = (requestId) => {
    alert(`가입 거절: ${requestId}`);
  };

  const handleRemove = (memberId) => {
    if (confirm('정말로 이 멤버를 내보내시겠습니까?')) {
      alert(`멤버 제거: ${memberId}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/town/groups/${params.id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            모임으로 돌아가기
          </Link>
          <h1 className="text-gray-900">모임 관리</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-6 py-4 ${
                activeTab === 'requests'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              가입 신청 ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 px-6 py-4 ${
                activeTab === 'members'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              멤버 관리 ({members.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'requests' && (
              <div className="space-y-4">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">{request.name}</h3>
                          <p className="text-sm text-gray-600">{request.message}</p>
                        </div>
                        <span className="text-sm text-gray-500">{request.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          거절
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    새로운 가입 신청이 없습니다.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                        {member.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{member.name}</span>
                          {member.role === '모임장' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {member.role}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">가입일: {member.joinedAt}</span>
                      </div>
                    </div>
                    {member.role !== '모임장' && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="px-3 py-1.5 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-1"
                      >
                        <UserMinus className="w-4 h-4" />
                        내보내기
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
