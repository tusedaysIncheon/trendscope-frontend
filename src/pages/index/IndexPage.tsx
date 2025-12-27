import { PageLayout } from "@/components/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

import { getMyInfoAPI, logoutAPI } from "@/lib/api/UserApi";
import { toast } from "sonner";

function IndexPage() {
  const { user, isAuthenticated } = useAuthStore();
  const clearAuthState = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try{
    await logoutAPI();
    toast.success("로그아웃 되었습니다.");
    
    } catch(err){
      console.error(err);
    } finally {
      clearAuthState();
      window.location.href = "/login"; 
    }
  };

  return (
    <PageLayout
      variant="centered"
      contentWidth="md"
      contentClassName="items-center text-center gap-6"
    >
      {isAuthenticated ? (
        <>
          <h1 className="text-3xl font-bold">
            {user?.nickname ?? user?.username}님, 환영합니다 🎉
          </h1>
          <p className="text-muted-foreground">
            오늘도 멋진 선택을 해보세요 👇
          </p>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4 active:scale-95 transition-transform"
          >
            로그아웃
          </Button>

          <button
            onClick={async () => {
              try {
                const res = await getMyInfoAPI();
                console.log("API 호출 성공:", res);
              } catch (error) {
                console.error("API 호출 실패:", error);
              }
            }}
            className="p-3 bg-blue-500 text-white rounded-lg"
          >
            🔥 API 테스트 (GET /v1/user)
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Vote SNS</h1>
          <p className="text-muted-foreground">지금 바로 함께해보세요 👇</p>

          <Button className="w-32">
            <Link to="/signup">시작하기</Link>
          </Button>
        </>
      )}
    </PageLayout>
  );
}

export default IndexPage;
