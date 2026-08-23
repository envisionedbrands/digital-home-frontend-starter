'use client';

import { useState } from 'react';
import Image from 'next/image';
import EmailGateModal from './EmailGateModal';

interface Resource {
  title: string;
  description: string;
  filename: string;
  image: string;
  /** Warm gradient fallback when image fails to load */
  gradientFallback: string;
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const downloadUrl = `/resources/download/${resource.filename}`;

  return (
    <>
      <article className="group border border-hair bg-canvas overflow-hidden flex flex-col">
        {/* Hero image / gradient */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {imgError ? (
            <div
              className="absolute inset-0"
              style={{ background: resource.gradientFallback }}
            />
          ) : (
            <Image
              src={resource.image}
              alt={resource.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImgError(true)}
            />
          )}
          {/* Subtle overlay to ensure readability of any overlaid elements */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(30,30,30,0.08) 0%, transparent 40%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-7 sm:p-8">
          <span className="kicker block mb-3">Skill file</span>
          <h2 className="display text-2xl sm:text-3xl text-ink mb-4 leading-tight">
            {resource.title}
          </h2>
          <p className="text-[0.95rem] text-taupe leading-[1.7] mb-8 flex-1">
            {resource.description}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="self-start inline-flex items-center gap-2.5 bg-rose text-canvas px-7 py-3.5 text-[0.95rem] font-medium hover:brightness-90 transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M8 1v10m0 0L4.5 7.5M8 11l3.5-3.5M2 14h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Get it free
          </button>
        </div>
      </article>

      <EmailGateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        resourceTitle={resource.title}
        downloadUrl={downloadUrl}
      />
    </>
  );
}
