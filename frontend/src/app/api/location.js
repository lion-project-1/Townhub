const BASE_URL = "http://localhost:8080/api/locations";

export async function searchTowns(keyword) {
  if (!keyword || keyword.trim().length < 2) {
    return [];
  }

  const res = await fetch(
    `${BASE_URL}?keyword=${encodeURIComponent(keyword)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: "Bearer {마스터 토큰}}",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("동네 검색 실패");
  }

  return res.json();
}
