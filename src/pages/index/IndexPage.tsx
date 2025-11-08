import { PageLayout } from "@/components/layouts/PageLayout"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

function IndexPage() {
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = "/" // ✅ 새로고침하면서 상태 초기화
  }

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
          <p className="text-muted-foreground">오늘도 멋진 선택을 해보세요 👇</p>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4 active:scale-95 transition-transform"
          >
            로그아웃
          </Button>
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
  )
}

export default IndexPage
