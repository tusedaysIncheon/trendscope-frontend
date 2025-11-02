import { FormProvider } from "react-hook-form"
import { useSignUpForm } from "../../hooks/useSignUpForm"
import { signUpApi } from "@/lib/api/UserApi"
import type { UserRequestDTO } from "@/types/user"
import { toast } from "sonner"


type Props = {
    children: React.ReactNode
}

export function SignUpFormWrapper({ children }: Props) {
    const form = useSignUpForm()

    const onSubmit = async (userinfo: UserRequestDTO) => {
        try {
            console.log("회원가입 데이터:", userinfo);
            const result = await signUpApi(userinfo);
            //회원가입 성공
            toast.success(`${result.nickname}님 회원가입을 축하드립니다!🥳`,{
            description: "이제 로그인하고 투표하러 갈까요?🗳️",
            duration: 4000 
        })

        form.reset(); //폼 초기화

        } catch (error) {
            toast.error("회원가입에 실패했습니다. 다시 시도해주세요.😢",{
           description: "입력 정보를 확인해주세요",
        })
        console.error("회원가입 오류:", error);
    }
}
        

  return (
    <FormProvider {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4 w-80"
        >
            {children}
        </form>
        </FormProvider>
   
  )
}

