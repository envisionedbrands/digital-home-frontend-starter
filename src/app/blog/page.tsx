import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Journal — Envisioned',
  description:
    'Essays and field notes on codifying founder intelligence: AI infrastructure, judgment, and businesses that run without their founder in every room.',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function estimateReadingTime(body: string | null): number {
  if (!body) return 5;
  const words = body.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  reading_time: number;
  image: string;
};

function categoryOf(tags: string[], contentType: string): string {
  if (tags && tags.length > 0) return tags[0].replace(/-/g, ' ');
  return contentType;
}

/* Editorial visual for articles without a hero image — a Meganté initial
   on the stone palette, so the page holds its look before photos exist */
function ImageFallback({ initial }: { initial: string }) {
  return (
    <div className="relative aspect-[4/3] w-full bg-[linear-gradient(160deg,#F3F1EC_0%,#EDE9E3_60%,#E3DED5_100%)]">
      <span className="display pointer-events-none absolute inset-0 flex items-center justify-center text-[7rem] leading-none text-olive/20 select-none">
        {initial}
      </span>
    </div>
  );
}

export default async function BlogPage() {
  let allArticles: JournalArticle[] = [];

  try {
    const supabase = createAdminClient();
    const { data: articles, error } = await supabase
      .from('content_objects')
      .select('id, slug, title, content_type, excerpt, semantic_tags, published_at, featured_image_url, body')
      .eq('status', 'published')
      .in('content_type', ['article', 'guide'])
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Supabase query error:', error.message);
    }

    allArticles = (articles || []).map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || '',
      category: categoryOf(a.semantic_tags || [], a.content_type),
      published_at: a.published_at || a.slug,
      reading_time: estimateReadingTime(a.body),
      image: a.featured_image_url || '',
    }));
  } catch (err) {
    console.error('Blog page error:', err);
  }

  // Empty state — first visit before anything is published
  if (allArticles.length === 0) {
    return (
      <main>
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl border border-hair bg-canvas-soft p-12 text-center">
            <p className="kicker text-[0.68rem] uppercase tracking-[0.24em] text-olive mb-6">
              The Journal
            </p>
            <h1 className="display text-4xl md:text-5xl text-ink mb-5 leading-tight">
              The first piece is on its way.
            </h1>
            <p className="text-lg text-ink/70 leading-relaxed">
              Essays and field notes on codifying founder intelligence. Check back soon — or start
              with <Link href="/services" className="underline underline-offset-4 text-ink">the rooms</Link>.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const trio = allArticles.slice(0, 3);
  const rest = allArticles.slice(3);

  return (
    <main>
      {/* ── Masthead ─────────────────────────────────────────── */}
      <section className="pt-36 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="kicker text-[0.68rem] uppercase tracking-[0.28em] text-olive mb-6">
            The Journal
          </p>
          <h1 className="display text-5xl md:text-7xl text-ink leading-[1.02] tracking-tight">
            Hot off the press.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-ink/70 leading-relaxed">
            Essays and field notes on codifying what you know — so your business can think
            with you, not just wait for you.
          </p>
        </div>
      </section>

      {/* ── Featured trio ────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid gap-10 md:grid-cols-3">
            {trio.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group block text-center">
                <div className="overflow-hidden border border-hair">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={896}
                      height={672}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <ImageFallback initial={article.title.charAt(0)} />
                  )}
                </div>
                <p className="kicker mt-6 text-[0.62rem] uppercase tracking-[0.24em] text-olive capitalize">
                  {article.category}
                </p>
                <h2 className="display mt-3 text-xl md:text-2xl text-ink leading-snug transition-colors group-hover:text-olive">
                  {article.title}
                </h2>
                <div className="mx-auto mt-5 h-px w-10 bg-hair transition-all duration-300 group-hover:w-16 group-hover:bg-olive/50" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slim CTA strip ───────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href="/services"
            className="group flex flex-col items-center justify-between gap-4 border border-ink/60 bg-canvas-soft px-8 py-6 md:flex-row"
          >
            <div className="flex items-center gap-5">
              <span className="kicker hidden text-[0.62rem] uppercase tracking-[0.24em] text-olive md:inline">
                While you&rsquo;re here
              </span>
              <span className="display text-lg md:text-xl text-ink">
                Curious what a business that thinks with you looks like?
              </span>
            </div>
            <span className="kicker border border-ink px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.22em] text-ink transition-colors group-hover:bg-ink group-hover:text-canvas">
              See the rooms
            </span>
          </Link>
        </div>
      </section>

      {/* ── The archive list ─────────────────────────────────── */}
      {rest.length > 0 && (
        <section className="px-6 pb-24">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex items-center gap-6 mb-2">
              <p className="kicker text-[0.68rem] uppercase tracking-[0.28em] text-olive whitespace-nowrap">
                From the archive
              </p>
              <div className="h-px flex-1 bg-hair" />
              <span className="kicker text-[0.62rem] uppercase tracking-[0.2em] text-ink/50 whitespace-nowrap">
                {allArticles.length} pieces
              </span>
            </div>

            <div>
              {rest.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group grid items-center gap-6 border-b border-hair py-10 sm:grid-cols-[220px_minmax(0,1fr)] md:gap-10"
                >
                  <div className="overflow-hidden border border-hair">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={448}
                        height={336}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <ImageFallback initial={article.title.charAt(0)} />
                    )}
                  </div>

                  <div>
                    <p className="kicker text-[0.62rem] uppercase tracking-[0.24em] text-olive capitalize">
                      {article.category}
                    </p>
                    <h3 className="display mt-3 text-2xl md:text-3xl text-ink leading-snug transition-colors group-hover:text-olive">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/70">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-6 flex flex-wrap items-center gap-5">
                      <span className="kicker border border-ink px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.22em] text-ink transition-colors group-hover:bg-ink group-hover:text-canvas">
                        Read the post
                      </span>
                      <span className="kicker text-[0.62rem] uppercase tracking-[0.18em] text-ink/50">
                        {formatDate(article.published_at)} · {article.reading_time} min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Closing band ─────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto bg-ink px-8 py-16 text-center md:py-20">
          <p className="kicker text-[0.68rem] uppercase tracking-[0.28em] text-sage mb-6">
            Before you go
          </p>
          <p className="display mx-auto max-w-3xl text-3xl md:text-5xl leading-tight text-canvas">
            Your best thinking deserves better than a browser tab of drafts.
          </p>
          <Link
            href="/contact"
            className="kicker mt-10 inline-block border border-canvas px-8 py-3.5 text-[0.68rem] uppercase tracking-[0.24em] text-canvas transition-colors hover:bg-canvas hover:text-ink"
          >
            Start the conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
