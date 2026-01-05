import { Suspense } from "react";
import GroupListClient from "./GroupListClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">로딩 중...</div>}>
      <GroupListClient />
    </Suspense>
  );
}
