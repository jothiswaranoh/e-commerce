import { UserSignupForm } from "../../components/components/user-signup-form"


const SignupForm = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <UserSignupForm />
      </div>
    </div>
  )
}

export default SignupForm