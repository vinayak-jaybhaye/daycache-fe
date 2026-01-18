import { ArrowRightIcon, Calendar, LockIcon, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTodayYYYYMMDD } from "@/utils/calendar.utils";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex items-center justify-center bg-bg-app">
      <div className="max-w-2xl w-full my-4 px-2">
        {/* Main card */}
        <div className="rounded-3xl bg-surface-default p-2 text-center relative overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-soft opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-soft opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            {/* Icon/Logo area */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6">
              <img src="/notebook.png" />
            </div>

            {/* Heading */}
            <h1 className="font-heading text-3xl text-text-primary mb-4">
              Welcome to DayCache
            </h1>

            {/* Subheading */}
            <p className="text-lg text-text-secondary mb-2">
              Your personal space for reflection
            </p>

            {/* Description */}
            <p className="text-sm text-text-muted leading-relaxed max-w-md mx-auto mb-10">
              Start capturing your thoughts, moments, and memories.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center mb-3">
                  <PencilIcon />
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-1">
                  Simple
                </h3>
                <p className="text-xs text-text-muted">
                  Just write, nothing else
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center mb-3">
                  <LockIcon />
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-1">
                  Private
                </h3>
                <p className="text-xs text-text-muted">
                  Your thoughts stay yours
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center mb-3">
                  <Calendar />
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-1">
                  Daily
                </h3>
                <p className="text-xs text-text-muted">One day at a time</p>
              </div>
            </div>

            {/* CTA */}
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-primary text-text-inverse px-8 py-3.5 text-sm font-medium shadow-sm hover:bg-accent-strong transition-colors duration-200"
              onClick={() => navigate(`/day/${getTodayYYYYMMDD()}`)}
            >
              Start Writing
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-text-muted mt-6">
          Start writing to create your first entry
        </p>
      </div>
    </div>
  );
}
