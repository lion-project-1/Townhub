'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Plus } from 'lucide-react';

const CATEGORIES = ['전체', '운동', '문화', '취미', '스터디', '반려동물', '기타'];
const STATUSES = ['전체', '모집중', '활동중'];

const MOCK_GROUPS = [
  {
    id: 1,
    name: '주말 등산 모임',
    category: '운동',
    description: '매주 주말 근처 산을 함께 오르는 모임입니다.',
    members: 12,
    maxMembers: 15,
    status: '모집중',
  },
  {
    id: 2,
    name: '독서 토론 클럽',
    category: '문화',
    description: '한 달에 한 권씩 책을 읽고 토론합니다.',
    members: 8,
    maxMembers: 10,
    status: '모집중',
  },
  {
    id: 3,
    name: '반려동물 산책',
    category: '반려동물',
    description: '반려동물과 함께 산책하는 모임입니다.',
    members: 15,
    maxMembers: 20,
    status: '활동중',
  },
  {
    id: 4,
    name: '영어 회화 스터디',
    category: '스터디',
    description: '영어로 대화하며 실력을 향상시키는 스터디입니다.',
    members: 6,
    maxMembers: 8,
    status: '모집중',
  },
  {
    id: 5,
    name: '사진 촬영 동호회',
    category: '취미',
    description: '주말마다 동네 곳곳을 사진으로 남기는 모임입니다.',
    members: 10,
    maxMembers: 12,
    status: '활동중',
  },
];

export default function GroupListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  const filteredGroups = MOCK_GROUPS.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || group.category === selectedCategory;
    const matchesStatus = selectedStatus === '전체' || group.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-gray-900">모임</h1>
            <p className="text-gray-600">관심사가 같은 이웃들과 함께 모임을 만들어보세요</p>
          </div>
          <Link
            href="/town/groups/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            모임 만들기
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="모임 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-700 mb-2">카테고리</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-700 mb-2">상태</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Link
              key={group.id}
              href={`/town/groups/${group.id}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Users className="w-16 h-16 text-blue-400" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-gray-900 flex-1">{group.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      group.status === '모집중'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {group.status}
                  </span>
                </div>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mb-3">
                  {group.category}
                </span>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {group.members}/{group.maxMembers}명
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
            <Link href="/town/groups/new" className="text-blue-600 hover:underline">
              새로운 모임을 만들어보세요
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
