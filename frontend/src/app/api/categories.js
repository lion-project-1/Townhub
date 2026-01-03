const BASE_URL = "http://localhost:8080/api/categories";

export async function getCategories() {
    const res = await fetch(BASE_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("카테고리 조회 실패");
    }

    return res.json(); // ["맛집", "교통", ...]
}
