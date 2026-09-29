"use client";

import { useCallback, useEffect, useState } from "react";

type Lesson = {
  id: string;
  title: string;
  blurb: string;
  src: string;
  poster: string;
};

const STORAGE_KEY = "invisible-team:watched";

function loadWatched(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? new Set(ids) : new Set();
  } catch {
    return new Set();
  }
}

function saveWatched(watched: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(watched)));
  } catch {
    // Private browsing or storage disabled — progress just won't persist.
  }
}

export default function TrainingSeries({ lessons }: { lessons: readonly Lesson[] }) {
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWatched(loadWatched());
    setHydrated(true);
  }, []);

  const markWatched = useCallback((id: string) => {
    setWatched((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveWatched(next);
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col gap-px border border-hair bg-hair">
      {lessons.map((lesson, index) => {
        const previous = lessons[index - 1];
        // Before hydration, assume locked (except lesson one) so the page
        // never flashes an unlocked video it is about to lock on mount.
        const unlocked = index === 0 || (hydrated && watched.has(previous.id));
        const isWatched = watched.has(lesson.id);

        return (
          <LessonCard
            key={lesson.id}
            number={index + 1}
            lesson={lesson}
            unlocked={unlocked}
            watched={isWatched}
            lockedOn={previous?.title}
            onEnded={() => markWatched(lesson.id)}
          />
        );
      })}
    </div>
  );
}

function LessonCard({
  number,
  lesson,
  unlocked,
  watched,
  lockedOn,
  onEnded,
}: {
  number: number;
  lesson: Lesson;
  unlocked: boolean;
  watched: boolean;
  lockedOn?: string;
  onEnded: () => void;
}) {
  return (
    <div className="bg-canvas-soft px-8 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
        <h2 className="text-[1.55rem] font-medium text-ink">
          {number}. {lesson.title}
        </h2>
        {watched ? <span className="kicker text-olive">Watched</span> : null}
      </div>

      <p className="text-[1.08rem] text-taupe leading-[1.75] mb-6">{lesson.blurb}</p>

      {unlocked ? (
        <video
          className="w-full border border-hair"
          controls
          preload="metadata"
          poster={lesson.poster}
          onEnded={onEnded}
        >
          <source src={lesson.src} type="video/mp4" />
        </video>
      ) : (
        <div
          className="relative w-full aspect-video border border-hair overflow-hidden"
          aria-disabled="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the site's
              custom loader returns src unresized, so next/image adds no
              optimization here; see src/lib/image-loader.ts */}
          <img
            src={lesson.poster}
            alt=""
            className="w-full h-full object-cover opacity-25 grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/55 px-6 text-center">
            <LockIcon />
            <p className="kicker text-canvas">
              Finish &ldquo;{lockedOn}&rdquo; first
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" stroke="#FBFAF9" strokeWidth="1.5" />
      <path
        d="M8 11V7.5a4 4 0 0 1 8 0V11"
        stroke="#FBFAF9"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
