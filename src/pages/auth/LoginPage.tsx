import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function LoginPage() {



  return (
    <main className="h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold">Vote SNS</h1>
      <p className="text-muted-foreground">지금 바로 함께해보세요 👇</p>

      <Button className="w-32">
        <Link to="/signup">시작하기</Link>
      </Button>
    </main>
  )
}

export default LoginPage;