import { useNavigate } from "react-router"
import { authForms } from "../../assets"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Label } from "./ui/label"



export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  // Handle redirection to the Sign In form
  const handleSignInRedirect = () => {
    navigate("/signin"); // Redirect to the sign-in page
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <img
              src={`${authForms.signOutForm}`}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Sign up with Apple</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                  <span className="sr-only">Sign up with Google</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#0081fb" d="M47,29.36l-2.193,1.663L42.62,29.5c0-0.16,0-0.33-0.01-0.5c0-0.16,0-0.33-0.01-0.5 c-0.14-3.94-1.14-8.16-3.14-11.25c-1.54-2.37-3.51-3.5-5.71-3.5c-2.31,0-4.19,1.38-6.27,4.38c-0.06,0.09-0.13,0.18-0.19,0.28 c-0.04,0.05-0.07,0.1-0.11,0.16c-0.1,0.15-0.2,0.3-0.3,0.46c-0.9,1.4-1.84,3.03-2.86,4.83c-0.09,0.17-0.19,0.34-0.28,0.51 c-0.03,0.04-0.06,0.09-0.08,0.13l-0.21,0.37l-1.24,2.19c-2.91,5.15-3.65,6.33-5.1,8.26C14.56,38.71,12.38,40,9.51,40 c-3.4,0-5.56-1.47-6.89-3.69C1.53,34.51,1,32.14,1,29.44l4.97,0.17c0,1.76,0.38,3.1,0.89,3.92C7.52,34.59,8.49,35,9.5,35 c1.29,0,2.49-0.27,4.77-3.43c1.83-2.53,3.99-6.07,5.44-8.3l1.37-2.09l0.29-0.46l0.3-0.45l0.5-0.77c0.76-1.16,1.58-2.39,2.46-3.57 c0.1-0.14,0.2-0.28,0.31-0.42c0.1-0.14,0.21-0.28,0.31-0.41c0.9-1.15,1.85-2.22,2.87-3.1c1.85-1.61,3.84-2.5,5.85-2.5 c3.37,0,6.58,1.95,9.04,5.61c2.51,3.74,3.82,8.4,3.97,13.25c0.01,0.16,0.01,0.33,0.01,0.5C47,29.03,47,29.19,47,29.36z" /><linearGradient id="wSMw7pqi7WIWHewz2_TZXa" x1="42.304" x2="13.533" y1="24.75" y2="24.75" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0081fb" /><stop offset=".995" stop-color="#0064e1" /></linearGradient><path fill="url(#wSMw7pqi7WIWHewz2_TZXa)" d="M4.918,15.456 C7.195,11.951,10.483,9.5,14.253,9.5c2.184,0,4.354,0.645,6.621,2.493c2.479,2.02,5.122,5.346,8.419,10.828l1.182,1.967 c2.854,4.746,4.477,7.187,5.428,8.339C37.125,34.606,37.888,35,39,35c2.82,0,3.617-2.54,3.617-5.501L47,29.362 c0,3.095-0.611,5.369-1.651,7.165C44.345,38.264,42.387,40,39.093,40c-2.048,0-3.862-0.444-5.868-2.333 c-1.542-1.45-3.345-4.026-4.732-6.341l-4.126-6.879c-2.07-3.452-3.969-6.027-5.068-7.192c-1.182-1.254-2.642-2.754-5.067-2.754 c-1.963,0-3.689,1.362-5.084,3.465L4.918,15.456z" /><linearGradient id="wSMw7pqi7WIWHewz2_TZXb" x1="7.635" x2="7.635" y1="32.87" y2="13.012" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0081fb" /><stop offset=".995" stop-color="#0064e1" /></linearGradient><path fill="url(#wSMw7pqi7WIWHewz2_TZXb)" d="M14.25,14.5 c-1.959,0-3.683,1.362-5.075,3.465C7.206,20.937,6,25.363,6,29.614c0,1.753-0.003,3.072,0.5,3.886l-3.84,2.813 C1.574,34.507,1,32.2,1,29.5c0-4.91,1.355-10.091,3.918-14.044C7.192,11.951,10.507,9.5,14.27,9.5L14.25,14.5z" /><path d="M21.67,20.27l-0.3,0.45l-0.29,0.46c0.71,1.03,1.52,2.27,2.37,3.69l0.21-0.37c0.02-0.04,0.05-0.09,0.08-0.13 c0.09-0.17,0.19-0.34,0.28-0.51C23.19,22.5,22.39,21.29,21.67,20.27z M24.94,15.51c-0.11,0.14-0.21,0.28-0.31,0.42 c0.73,0.91,1.47,1.94,2.25,3.1c0.1-0.16,0.2-0.31,0.3-0.46c0.04-0.06,0.07-0.11,0.11-0.16c0.06-0.1,0.13-0.19,0.19-0.28 c-0.76-1.12-1.5-2.13-2.23-3.03C25.15,15.23,25.04,15.37,24.94,15.51z" opacity=".05" /><path d="M21.67,20.27l-0.3,0.45c0.71,1.02,1.51,2.24,2.37,3.65c0.09-0.17,0.19-0.34,0.28-0.51C23.19,22.5,22.39,21.29,21.67,20.27 z M24.63,15.93c0.73,0.91,1.47,1.94,2.25,3.1c0.1-0.16,0.2-0.31,0.3-0.46c-0.77-1.14-1.52-2.16-2.24-3.06 C24.83,15.65,24.73,15.79,24.63,15.93z" opacity=".07" /></svg>
                  <span className="sr-only">Sign up with Meta</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="#" className="underline underline-offset-4"
                  onClick={handleSignInRedirect}
                >
                  Sign In
                </a>
              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
