import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] text-neutral-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand / Editorial Side */}
        <section className="relative hidden overflow-hidden bg-neutral-950 lg:flex">
          {/* Decorative background */}
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/[0.06] blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/[0.05] blur-3xl" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-[0.18em] text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20">
                B
              </span>

              BEAUTYHUB
            </Link>

            {/* Main message */}
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white/70">
                <Sparkles className="h-3.5 w-3.5" />
                BEAUTY, SIMPLIFIED
              </div>

              <h1 className="text-5xl font-medium leading-[1.05] tracking-[-0.04em] text-white xl:text-6xl">
                Beauty products
                <br />
                you can{" "}
                <span className="text-white/50">trust.</span>
              </h1>

              <p className="mt-7 max-w-md text-base leading-7 text-white/55">
                Discover carefully selected skincare and personal-care
                products, understand what you're buying, and shop with
                confidence.
              </p>

              {/* Trust points */}
              <div className="mt-12 grid max-w-md grid-cols-2 gap-3">
                <TrustPoint text="Curated products" />
                <TrustPoint text="Transparent pricing" />
                <TrustPoint text="Simple discovery" />
                <TrustPoint text="Reliable delivery" />
              </div>
            </div>

            {/* Bottom statement */}
            <p className="text-xs text-white/30">
              A better way to discover beauty.
            </p>
          </div>
        </section>

        {/* Authentication Side */}
        <section className="flex min-h-screen flex-col">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-6 py-6 lg:hidden">
            <Link
              href="/"
              className="text-sm font-semibold tracking-[0.16em]"
            >
              BEAUTYHUB
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Store
            </Link>
          </div>

          {/* Desktop back link */}
          <div className="hidden justify-end px-10 py-8 lg:flex">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-6 sm:px-10">
            <div className="w-full max-w-md">
              {/* Mobile intro */}
              <div className="mb-8 lg:hidden">
                <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-neutral-400">
                  WELCOME TO BEAUTYHUB
                </p>

                <h1 className="text-3xl font-medium tracking-[-0.03em]">
                  Beauty starts here.
                </h1>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Sign in to continue shopping and manage your orders.
                </p>
              </div>

              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: [
                      "w-full",
                      "shadow-none",
                      "border-0",
                      "bg-transparent",
                      "p-0",
                    ].join(" "),

                    headerTitle:
                      "text-2xl font-medium tracking-[-0.03em] text-neutral-950",

                    headerSubtitle:
                      "text-sm leading-6 text-neutral-500 mt-2",

                    socialButtonsBlockButton:
                      "h-11 rounded-xl border border-neutral-200 bg-white text-sm font-medium shadow-none hover:bg-neutral-50",

                    socialButtonsBlockButtonText:
                      "text-neutral-800 font-medium",

                    dividerLine:
                      "bg-neutral-200",

                    dividerText:
                      "text-xs text-neutral-400",

                    formFieldLabel:
                      "text-sm font-medium text-neutral-800",

                    formFieldInput:
                      "h-11 rounded-xl border-neutral-200 bg-white text-sm shadow-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900",

                    formButtonPrimary:
                      "h-11 rounded-xl bg-neutral-950 text-sm font-medium shadow-none transition hover:bg-neutral-800",

                    footerActionText:
                      "text-sm text-neutral-500",

                    footerActionLink:
                      "text-sm font-medium text-neutral-950 hover:text-neutral-600",

                    identityPreviewEditButton:
                      "text-neutral-900",

                    alert:
                      "rounded-xl border border-red-100 bg-red-50 text-sm",
                  },
                  variables: {
                    colorPrimary: "#171717",
                    colorBackground: "#faf9f7",
                    borderRadius: "0.75rem",
                    fontFamily:
                      "Inter, ui-sans-serif, system-ui, sans-serif",
                  },
                }}
                routing="path"
                path="/auth"
                signUpUrl="/auth/sign-up"
                forceRedirectUrl="/"
              />

              {/* Trust message */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Your account is securely managed by Clerk.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
      <span className="text-xs text-white/60">{text}</span>
    </div>
  );
}