import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema } from "../lib/zodSchemas/SignUpSchema"
import { z } from "zod"

export type SignUpFormValues = z.infer<typeof SignUpSchema>

export function useSignUpForm() {
  return useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      email: "",
      nickname: "",
      confirmPassword: "",
    },
  })
}