import { LoginForm } from "@/components/form/LoginForm"
import { PageLayout } from "@/components/layouts/PageLayout"

export default function LoginPage() {
  return (
    <PageLayout
      variant="centered"
      contentWidth="sm"
    >
      <LoginForm />
    </PageLayout>
  )
}
