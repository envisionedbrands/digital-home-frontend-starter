type StarterNoticeProps = {
  compact?: boolean;
};

const PROMPT_BUILDER_URL = 'https://prompt-builder-pink.vercel.app';

export default function StarterNotice({ compact = false }: StarterNoticeProps) {
  if (compact) {
    return (
      <div className="mt-8  border border-hair bg-canvas-soft p-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-olive mb-3">
          Start Here
        </p>
        <h2 className="text-xl md:text-2xl font-semibold tracking-[-0.04em] text-ink mb-3">
          This is your starting clay.
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-neutral-300">
          The structure is here. Now shape the design, copy, and visual direction to fit your brand.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a
            href={PROMPT_BUILDER_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center  border border-hair px-3.5 py-1.5 text-ink-soft transition-colors hover:text-ink"
          >
            Use Prompt Builder
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8  border border-hair bg-canvas-soft p-6 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-olive mb-3">
            Start Here
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.05em] text-ink mb-3">
            This is your starting clay.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-neutral-300">
            The structure is here. Now shape the design, copy, and visual direction to fit your brand.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={PROMPT_BUILDER_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center  text-sm font-medium bg-transparent text-ink px-5 py-2.5 hover:bg-olive hover:text-canvas border border-hair-olive transition-all"
          >
            Use Prompt Builder
          </a>
        </div>
      </div>
    </div>
  );
}
