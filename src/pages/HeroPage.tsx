import { Link } from "react-router-dom";
import { MaterialIcon } from "../components/MaterialIcon";

/** Reset the demo overlay flag so it shows again when entering the app */
function resetDemoOverlay() {
  sessionStorage.removeItem("tab-demo-seen");
}

/**
 * Marketing landing page for Tab. Describes the problem of clunky expense
 * reporting and positions Tab as the solution. Includes a phone mockup
 * showing the app and links to enter the interactive demo.
 */
export function HeroPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-outline-variant/15">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/tab-logo-dark.svg" alt="Tab logo" className="w-7 h-7 rounded-md dark:hidden" />
            <img src="/tab-logo-dark-transparent.svg" alt="Tab logo" className="w-7 h-7 hidden dark:block" />
            <span className="font-black text-xl tracking-[0.2em] text-[#1a1a1a] dark:text-primary uppercase">
              Tab
            </span>
          </div>
          <div className="flex items-center gap-7">
            <a
              href="#problem"
              className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/80 hover:text-on-surface transition-colors"
            >
              About
            </a>
            <a
              href="https://github.com/lovelaces-io/tab"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/80 hover:text-on-surface transition-colors"
            >
              GitHub
            </a>
            <Link
              to="/current"
              onClick={resetDemoOverlay}
              className="bg-primary text-on-primary font-semibold text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-md hover:bg-primary/90 active:translate-y-px transition-all"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20 pb-16 md:pb-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Headline and call to action */}
          <div className="flex-1 text-center md:text-left hero-fade-1">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
              Expense Management, Simplified
            </span>
            <h1 className="text-[2.5rem] md:text-[4rem] font-black tracking-[-0.035em] leading-[1.05] mb-6">
              Expense reports<br className="hidden sm:block" /> shouldn't be a chore
            </h1>
            <p className="text-lg text-on-surface-variant max-w-[34rem] mb-9 mx-auto md:mx-0 leading-relaxed">
              Tab makes submitting out-of-pocket business expenses fast, transparent, and painless.
              No more lost receipts, confusing policies, or invisible approval chains.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/current"
                onClick={resetDemoOverlay}
                className="bg-primary text-on-primary font-semibold uppercase tracking-[0.18em] text-xs px-7 py-3.5 rounded-md hover:bg-primary/90 active:translate-y-px transition-all shadow-md shadow-primary/15 text-center"
              >
                Try the Demo
              </Link>
              <a
                href="#problem"
                className="font-semibold uppercase tracking-[0.18em] text-xs px-7 py-3.5 rounded-md text-on-surface border border-outline-variant/40 hover:border-on-surface/40 hover:bg-surface-container/40 active:translate-y-px transition-all text-center"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Phone mockup — hidden on mobile to keep the hero section compact */}
          <div className="hidden md:block flex-shrink-0 hero-fade-2">
            <div className="relative mx-auto w-[280px] md:w-[320px]">
              <div className="rounded-[2.75rem] border-[7px] border-black overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
                {/* Dark mode: dark screenshot with black notch area */}
                <div className="dark:hidden bg-white">
                  <div className="mx-auto w-28 h-7 bg-black rounded-b-2xl" />
                  <img
                    src="/app-screenshot-light.png"
                    alt="Tab app showing the close tab screen with expenses"
                    className="w-full"
                  />
                </div>
                {/* Light mode: light screenshot with white notch area */}
                <div className="hidden dark:block bg-black">
                  <div className="mx-auto w-28 h-7 bg-black rounded-b-2xl" />
                  <img
                    src="/app-screenshot.png"
                    alt="Tab app showing the close tab screen with expenses"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section id="problem" className="bg-surface-container/50 py-16 md:py-20 border-y border-outline-variant/15">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 hero-fade-3">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-error mb-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-error" />
              The Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.025em]">
              Why employees give up on expense reports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "description",
                title: "Too many steps",
                description: "Multi-page forms, manual categorization, separate receipt uploads. The friction adds up until it's easier to just eat the cost.",
              },
              {
                icon: "help",
                title: "Policy confusion",
                description: "What's the meal limit? Does this need pre-approval? Employees shouldn't need to memorize a policy handbook to submit a coffee receipt.",
              },
              {
                icon: "visibility_off",
                title: "No visibility",
                description: "Expenses vanish into a queue. No status updates, no timeline, no idea if you'll get reimbursed this month or next.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-row items-center gap-4 md:flex-col md:items-center md:text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-outline-variant/25"
              >
                <div className="w-11 h-11 rounded-full bg-error-container/25 flex items-center justify-center flex-shrink-0 md:mb-3">
                  <MaterialIcon name={card.icon} className="text-error" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight mb-1.5">{card.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
              How Tab Helps
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.025em]">
              Built for the way you actually work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "touch_app",
                title: "One-screen capture",
                description: "Snap a receipt, pick a merchant, and submit. Tab auto-categorizes and assigns project codes so you don't have to think about it.",
              },
              {
                icon: "verified",
                title: "Real-time policy check",
                description: "See instantly whether your expense is within policy before you submit. No more surprise rejections days later.",
              },
              {
                icon: "notifications_active",
                title: "Instant updates",
                description: "Know the moment your manager approves. Track every expense from submission to reimbursement in one place.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-row items-center gap-4 md:flex-col md:items-center md:text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
              >
                <div className="w-11 h-11 rounded-full bg-primary-container/25 flex items-center justify-center flex-shrink-0 md:mb-3">
                  <MaterialIcon name={card.icon} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight mb-1.5">{card.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer call to action */}
      <section className="py-16 md:py-20 bg-surface-container/50 border-t border-outline-variant/15">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.025em] mb-4">
            See it in action
          </h2>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            Tab is an interactive demo with test data, simulated approvals, and real policy checks.
            Try adding an expense, closing a tab, or exploring the policy engine.
          </p>
          <Link
            to="/current"
            onClick={resetDemoOverlay}
            className="inline-block bg-primary text-on-primary font-semibold uppercase tracking-[0.18em] text-xs px-9 py-3.5 rounded-md hover:bg-primary/90 active:translate-y-px transition-all shadow-md shadow-primary/15"
          >
            Try the Demo
          </Link>
          <div className="mt-10 flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/45">
            <a
              href="https://github.com/lovelaces-io/tab"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              View Source on GitHub
            </a>
            <span>Built with React, TypeScript, Tailwind &amp; Vite</span>
          </div>
        </div>
      </section>
    </div>
  );
}
