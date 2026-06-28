"use client";

import { useActionState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login, type LoginState } from "@/app/admin/actions";
import { useAdminT } from "@/components/admin/i18n";

const initialState: LoginState = { error: null };

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const { t } = useAdminT();

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="border-0 bg-white py-0 shadow-xl shadow-[#005761]/10 ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
        <CardHeader className="hidden space-y-3 border-b border-border/60 px-10 pb-8 pt-10 lg:block">
          <CardTitle className="text-3xl font-semibold text-[#0a1f2d] dark:text-foreground">{t.login.title}</CardTitle>
          <CardDescription className="text-base leading-relaxed lg:text-lg">
            {t.login.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <form action={formAction}>
            <FieldGroup className="gap-8">
              <Field className="gap-2.5">
                <FieldLabel htmlFor="email" className="text-base font-medium text-[#0a1f2d] dark:text-foreground">
                  {t.login.email}
                </FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@almajdouie.org"
                    autoComplete="email"
                    required
                    className="h-14 border-input/80 bg-[#f9fafb] ps-11 text-base shadow-none focus-visible:bg-white dark:bg-input/30 dark:focus-visible:bg-input/50"
                  />
                </div>
              </Field>

              <Field className="gap-2.5">
                <FieldLabel htmlFor="password" className="text-base font-medium text-[#0a1f2d] dark:text-foreground">
                  {t.login.password}
                </FieldLabel>
                <div className="relative">
                  <Lock className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="h-14 border-input/80 bg-[#f9fafb] ps-11 text-base shadow-none focus-visible:bg-white dark:bg-input/30 dark:focus-visible:bg-input/50"
                  />
                </div>
              </Field>

              {state.error && (
                <div
                  className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  role="alert"
                >
                  {state.error}
                </div>
              )}

              <Field className="pt-2">
                <Button
                  type="submit"
                  disabled={pending}
                  size="lg"
                  className="h-14 w-full bg-[#005761] text-base font-semibold text-white hover:bg-[#004a52] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                >
                  {pending ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      {t.login.signingIn}
                    </>
                  ) : (
                    t.login.signIn
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
