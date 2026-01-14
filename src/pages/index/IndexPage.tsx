import { PageLayout } from "@/components/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

function IndexPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: user, isLoading } = useUser();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃 되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("로그아웃에 실패했습니다.");
    } finally {
      navigate("/login");
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
            {isLoading
              ? "로딩 중..."
              : `${user?.nickname ?? "사용자"}님, 환영합니다 🎉`}
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
            onClick={() => {
              navigate("/profile-setup");
            }}
            className="p-3 bg-blue-500 text-white rounded-lg"
          >
            🔥프로필 마저 입력하기
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
