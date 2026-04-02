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
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/tab-logo-dark.svg" alt="Tab logo" className="w-8 h-8 rounded-lg dark:hidden" />
            <img src="/tab-logo-dark-transparent.svg" alt="Tab logo" className="w-8 h-8 hidden dark:block" />
            <span className="font-black text-2xl tracking-widest text-[#1a1a1a] dark:text-primary uppercase">
              TAB
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#problem"
              className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="https://github.com/lovelaces-io/tab"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <Link
              to="/current"
              onClick={resetDemoOverlay}
              className="bg-primary text-on-primary font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-primary/80 active:scale-[0.98] transition-all"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Headline and call to action */}
          <div className="flex-1 text-center md:text-left hero-fade-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4 block">
              Expense Management, Simplified
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
              Expense reports shouldn't be a chore
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg mb-8 mx-auto md:mx-0">
              Tab makes submitting out-of-pocket business expenses fast, transparent, and painless.
              No more lost receipts, confusing policies, or invisible approval chains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/current"
                onClick={resetDemoOverlay}
                className="bg-primary text-on-primary font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:bg-primary/80 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 text-center"
              >
                Try the Demo
              </Link>
              <a
                href="#problem"
                className="bg-surface-container text-on-surface font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:bg-surface-container-high active:scale-[0.98] transition-all text-center"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Phone mockup — hidden on mobile to keep the hero section compact */}
          <div className="hidden md:block flex-shrink-0 hero-fade-2">
            <div className="relative mx-auto w-[280px] md:w-[320px]">
              <div className="rounded-[3rem] border-[8px] border-black overflow-hidden shadow-2xl phone-glow">
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
      <section id="problem" className="bg-surface-container/50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 hero-fade-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
              The Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Why employees give up on expense reports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-row items-center gap-4 md:flex-col md:items-center md:text-center"
              >
                <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center flex-shrink-0 md:mb-4">
                  <MaterialIcon name={card.icon} className="text-error" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight mb-2">{card.title}</h3>
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
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
              How Tab Helps
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Built for the way you actually work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-row items-center gap-4 md:flex-col md:items-center md:text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0 md:mb-4">
                  <MaterialIcon name={card.icon} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight mb-2">{card.title}</h3>
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
      <section className="py-20 bg-surface-container/50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            See it in action
          </h2>
          <p className="text-on-surface-variant mb-8">
            Tab is an interactive demo with test data, simulated approvals, and real policy checks.
            Try adding an expense, closing a tab, or exploring the policy engine.
          </p>
          <Link
            to="/current"
            onClick={resetDemoOverlay}
            className="inline-block bg-primary text-on-primary font-bold uppercase tracking-widest text-sm px-10 py-4 rounded-lg hover:bg-primary/80 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Try the Demo
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mt-6">
            Built with React, TypeScript, Tailwind CSS, and Vite
          </p>
          <a
            href="https://github.com/lovelaces-io/tab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mt-3 hover:text-primary transition-colors"
          >
            View Source on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
