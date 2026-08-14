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

/* Editorial visual for articles without a hero image — an initial on the stone
   palette, so the page holds its look before photos exist */
function ImageFallback({ initial, ratio = 'aspect-[4/3]' }: { initial: string; ratio?: string }) {
  return (
    <div className={`relative ${ratio} w-full bg-[linear-gradient(160deg,#F3F1EC_0%,#EDE9E3_60%,#E3DED5_100%)]`}>
      <span className="display pointer-events-none absolute inset-0 flex items-center justify-center text-[7rem] leading-none text-olive/20 select-none">
        {initial}
      </span>
    </div>
  );
}

function ArticleImage({
  article,
  ratio,
  sizes,
}: {
  article: JournalArticle;
  ratio: string;
  sizes: [number, number];
}) {
  return article.image ? (
    <Image
      src={article.image}
      alt={article.title}
      width={sizes[0]}
      height={sizes[1]}
      className={`${ratio} w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]`}
    />
  ) : (
    <ImageFallback initial={article.title.charAt(0)} ratio={ratio} />
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
            <p className="kicker text-[0.74rem] uppercase tracking-[0.24em] text-olive mb-6">
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

  const hero = allArticles[0];
  const featured = allArticles.slice(0, 4);
  const categories = Array.from(new Set(allArticles.map((a) => a.category)));

  return (
    <main>
      {/* ── Masthead — serif nameplate over a heavy rule ─────── */}
      <section className="pt-32 px-6">
        <div className="mx-auto max-w-[1300px] text-center">
          <h1 className="display text-5xl md:text-7xl text-ink leading-[1.02] tracking-tight pb-10">
            The Journal
          </h1>
        </div>
        <div className="mx-auto max-w-[1300px] border-b-2 border-ink" />
      </section>

      {/* ── Hero band — image · latest post · image, hairline-divided ── */}
      <section className="px-6">
        <div className="mx-auto grid max-w-[1300px] gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:gap-0 lg:grid-cols-[1.1fr_1fr_0.35fr]">
          <Link href={`/blog/${hero.slug}`} className="group block md:border-r md:border-hair md:pr-10">
            <ArticleImage article={hero} ratio="aspect-[4/3]" sizes={[1024, 768]} />
          </Link>

          <div className="flex flex-col justify-between md:px-10">
            <div className="flex items-baseline justify-between">
              <p className="kicker text-[0.72rem] uppercase tracking-[0.26em] text-ink">
                Latest piece
              </p>
              <p className="kicker text-[0.74rem] uppercase tracking-[0.2em] text-ink/80">
                {formatDate(hero.published_at)}
              </p>
            </div>

            <div className="py-10">
              <Link href={`/blog/${hero.slug}`} className="group">
                <h2 className="display text-3xl md:text-4xl lg:text-[2.75rem] text-ink leading-[1.08] transition-colors group-hover:text-olive">
                  {hero.title}
                </h2>
              </Link>
              {hero.excerpt && (
                <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-ink/70">
                  {hero.excerpt}
                </p>
              )}
            </div>

            <Link
              href={`/blog/${hero.slug}`}
              className="kicker group inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.24em] text-ink"
            >
              Continue reading
              <span aria-hidden="true" className="inline-block h-px w-8 bg-ink transition-all duration-300 group-hover:w-12" />
            </Link>
          </div>

          {/* Peek of the next piece — the Chronicle's carousel edge, static.
              Only rendered when the piece has a real image: a fill-image with
              an empty src is a broken tile, worse than no peek. */}
          {allArticles[1]?.image && (
            <Link
              href={`/blog/${allArticles[1].slug}`}
              className="group relative hidden overflow-hidden border-l border-hair pl-10 lg:block"
              aria-label={allArticles[1].title}
            >
              {/* Fills the band's full height so its bottom edge lines up with
                  the hero image, whatever the source image's own ratio. */}
              <div className="relative h-full min-h-[420px]">
                <Image
                  src={allArticles[1].image || ''}
                  alt={allArticles[1].title}
                  fill
                  sizes="30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ── Category strip between hairlines ─────────────────── */}
      <section className="px-6">
        <div className="mx-auto max-w-[1300px] border-y border-ink/60 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-2 md:justify-between md:px-10">
            {categories.slice(0, 6).map((c) => (
              <span key={c} className="kicker text-[0.74rem] uppercase tracking-[0.24em] text-ink capitalize">
                {c}
              </span>
            ))}
            <span className="kicker text-[0.74rem] uppercase tracking-[0.24em] text-ink/80">
              {allArticles.length} pieces
            </span>
          </div>
        </div>
      </section>

      {/* ── Featured posts — 4-up grid, hairline-columned ────── */}
      <section className="px-6 pt-24 pb-8">
        <div className="mx-auto max-w-[1300px]">
          <p className="kicker text-[0.74rem] uppercase tracking-[0.28em] text-ink mb-6">
            Featured posts
          </p>
          <div className="border-t-2 border-ink">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className={`group flex flex-col gap-5 py-8 pr-6 ${i > 0 ? 'lg:border-l lg:border-hair lg:pl-6' : ''} ${i % 2 === 1 ? 'sm:border-l sm:border-hair sm:pl-6 lg:pl-6' : ''}`}
                >
                  <p className="kicker text-[0.74rem] uppercase tracking-[0.22em] text-ink/80 capitalize">
                    Filed in: {article.category}
                  </p>
                  <h3 className="display text-xl md:text-[1.35rem] text-ink leading-snug transition-colors group-hover:text-olive">
                    {article.title}
                  </h3>
                  {/* mt-auto pins every image to the card's bottom edge, so a
                      title wrapping to four lines can't push its image out of
                      line with the neighbours. Same aspect + same pin = all
                      four images identical in size and vertical position. */}
                  <div className="mt-auto overflow-hidden">
                    <ArticleImage article={article} ratio="aspect-[4/3]" sizes={[640, 480]} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The articles — alternating editorial rows ────────── */}
      <section className="px-6 pt-20 pb-8">
        <div className="mx-auto max-w-[1300px]">
          <h2 className="display text-center text-4xl md:text-6xl uppercase tracking-[0.06em] text-ink">
            The Articles
          </h2>
          <div className="mx-auto mt-12 border-t border-ink/60" />

          {allArticles.map((article, i) => (
            <article
              key={article.slug}
              className="grid items-center gap-10 border-b border-hair py-16 md:grid-cols-2 md:gap-16"
            >
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <p className="kicker text-[0.74rem] uppercase tracking-[0.22em] text-ink/80 capitalize">
                  Filed in: {article.category}
                </p>
                <Link href={`/blog/${article.slug}`} className="group block">
                  <h3 className="display mt-5 text-3xl md:text-4xl text-ink leading-[1.1] transition-colors group-hover:text-olive">
                    {article.title}
                  </h3>
                </Link>
                {article.excerpt && (
                  <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-ink/70">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="kicker group inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.24em] text-ink"
                  >
                    Continue reading
                    <span aria-hidden="true" className="inline-block h-px w-8 bg-ink transition-all duration-300 group-hover:w-12" />
                  </Link>
                  <span className="kicker text-[0.74rem] uppercase tracking-[0.18em] text-ink/80">
                    {formatDate(article.published_at)} · {article.reading_time} min
                  </span>
                </div>
              </div>

              <Link
                href={`/blog/${article.slug}`}
                className={`group block overflow-hidden ${i % 2 === 1 ? 'md:order-1' : ''}`}
                aria-label={article.title}
              >
                <ArticleImage article={article} ratio="aspect-[4/5] max-h-[560px]" sizes={[820, 1025]} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Closing band ─────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-[1300px] mx-auto bg-ink px-8 py-16 text-center md:py-20">
          <p className="kicker text-[0.74rem] uppercase tracking-[0.28em] text-sage mb-6">
            Before you go
          </p>
          <p className="display mx-auto max-w-3xl text-3xl md:text-5xl leading-tight text-canvas">
            Your best thinking deserves better than a browser tab of drafts.
          </p>
          <Link
            href="/contact"
            className="kicker mt-10 inline-block border border-canvas px-8 py-3.5 text-[0.74rem] uppercase tracking-[0.24em] text-canvas transition-colors hover:bg-canvas hover:text-ink"
          >
            Start the conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
