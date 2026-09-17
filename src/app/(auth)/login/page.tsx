import LoginForm from "./LoginForm";
import { toOAuthCallbackError } from "./schema";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, next } = await searchParams;

  return <LoginForm next={next} initialError={toOAuthCallbackError(error)} />;
}
