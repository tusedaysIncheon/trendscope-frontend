// src/pages/auth/SignUpPage.tsx
import { SignUpFormWrapper } from "@/components/form/SignUpFormWrapper"
import { SignUpFields } from  "@/components/form/SignUpFields"

export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">회원가입</h1>
      <SignUpFormWrapper>
        <SignUpFields />
      </SignUpFormWrapper>
    </main>
  )
}
