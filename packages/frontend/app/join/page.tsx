import OpeningCard from "@/components/OpeningCard";
import { openingApi, type OpeningViewModel } from "@/lib/strapi-client";

export default async function JoinUsPage() {
  let openings: OpeningViewModel[] = [];
  try {
    const res = await openingApi.getOpeningList();
    openings = res.data || [];
  } catch (error) {
    console.error("获取岗位列表失败:", error);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">加入我们</h1>
      </div>
      
      <div className="mt-12">
        {openings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openings.map((opening) => (
              <OpeningCard key={opening.id} opening={opening} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">当前暂无开放岗位。</p>
          </div>
        )}
      </div>
    </div>
  );
}
