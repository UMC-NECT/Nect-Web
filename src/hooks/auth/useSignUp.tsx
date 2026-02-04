import { postSignup } from "@/api/users"
import type { RequestSignupDto } from "@/types/api/users"
import { useMutation } from "@tanstack/react-query"

export const useSignUp = () => {
    return useMutation({
        mutationFn: (body: RequestSignupDto) => postSignup(body),
        onSuccess: () => {
    })
}