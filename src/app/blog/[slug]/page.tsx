import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

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

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/* Inject ids into h2/h3 headings and collect them for the left-hand
   "In this article" navigation */
function buildToc(body: string): { html: string; toc: { id: string; level: number; text: string }[] } {
  const toc: { id: string; level: number; text: string }[] = [];
  let counter = 0;
  const html = body.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, lvl, attrs, inner) => {
    const plain = inner.replace(/<[^>]+>/g, '').trim();
    if (!plain) return match;
    counter += 1;
    const id = slugifyHeading(plain) || `section-${counter}`;
    toc.push({ id, level: Number(lvl), text: plain });
    const cleanAttrs = attrs.replace(/\s*id="[^"]*"/, '');
    return `<h${lvl} id="${id}"${cleanAttrs}>${inner}</h${lvl}>`;
  });
  return { html, toc };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('content_objects')
    .select('title, excerpt, seo_meta(title, description, og_image_url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!data) return { title: 'Article Not Found' };

  const seo = Array.isArray(data.seo_meta) ? data.seo_meta[0] : data.seo_meta;

  return {
    title: seo?.title || data.title,
    description: seo?.description || data.excerpt || '',
    openGraph: seo?.og_image_url ? { images: [seo.og_image_url] } : undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: article } = await supabase
    .from('content_objects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) notFound();

  const readingTime = estimateReadingTime(article.body);
  const publishedAt = article.published_at || article.created_at;
  const category = (article.semantic_tags?.[0] || article.content_type || 'essay').replace(/-/g, ' ');
  const { html: bodyHtml, toc } = buildToc(article.body || '');

  // Three more pieces for "Keep reading"
  const { data: more } = await supabase
    .from('content_objects')
    .select('slug, title, excerpt, semantic_tags, content_type, featured_image_url')
    .eq('status', 'published')
    .in('content_type', ['article', 'guide'])
    .neq('slug', slug)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(3);

  // ── Article structured data ───────────────────────────────────────────
  // Lives in the TEMPLATE, so every article published from now on carries it
  // without anyone remembering. The site-wide graph identifies the business;
  // this identifies the PIECE — headline, dates, and an author edge pointing at
  // the same Person @id — which is what lets an answer engine attribute a quote
  // to Maria-Ines rather than to an anonymous page. Audit finding, 2026-08-27.
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.envisioned.me';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE}/blog/${slug}#article`,
    headline: article.title,
    description: article.excerpt || undefined,
    datePublished: publishedAt || undefined,
    dateModified: article.updated_at || publishedAt || undefined,
    image: article.featured_image_url || undefined,
    wordCount: article.word_count || undefined,
    keywords: (article.semantic_tags || []).join(', ') || undefined,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${slug}` },
    author: { '@id': `${SITE}/#maria-ines` },
    publisher: { '@id': `${SITE}/#envisioned` },
    isPartOf: { '@id': `${SITE}/#website` },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ── Article header ───────────────────────────────────── */}
      <section className="pt-36 pb-10 px-6">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="kicker text-[0.74rem] uppercase tracking-[0.28em] text-olive capitalize">
            {category}
          </p>
          <h1 className="display mt-6 text-4xl md:text-5xl xl:text-6xl text-ink leading-[1.06]">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-ink/70 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          <p className="kicker mt-8 text-[0.74rem] uppercase tracking-[0.22em] text-ink/80">
            {formatDate(publishedAt)} · {readingTime} min read · {article.author_name}
          </p>
        </div>
      </section>

      {/* ── Hero image ───────────────────────────────────────── */}
      {article.featured_image_url && (
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-[900px] overflow-hidden border border-hair">
            <Image
              src={article.featured_image_url}
              alt={article.title}
              width={1792}
              height={1024}
              className="w-full object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* ── Body with left navigation ────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* In this article — sticky left nav */}
          <aside className="hidden lg:block">
            {toc.length > 0 && (
              <nav className="sticky top-28">
                <p className="kicker mb-5 text-[0.74rem] uppercase tracking-[0.24em] text-olive">
                  In this article
                </p>
                <ol className="space-y-3 border-l border-hair pl-4">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                      <a
                        href={`#${item.id}`}
                        className="block text-[0.82rem] leading-snug text-ink/55 transition-colors hover:text-ink"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>

          {/* Article body */}
          <article className="mx-auto w-full max-w-[720px]">
            {bodyHtml ? (
              <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            ) : null}
          </article>
        </div>
      </section>

      {/* ── Keep reading ─────────────────────────────────────── */}
      {more && more.length > 0 && (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-10 text-center">
              <p className="kicker text-[0.74rem] uppercase tracking-[0.28em] text-olive">
                Ready for more?
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {more.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="group block text-center">
                  <div className="overflow-hidden border border-hair">
                    {item.featured_image_url ? (
                      <Image
                        src={item.featured_image_url}
                        alt={item.title}
                        width={896}
                        height={672}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="relative aspect-[4/3] w-full bg-[linear-gradient(160deg,#F3F1EC_0%,#EDE9E3_60%,#E3DED5_100%)]">
                        <span className="display pointer-events-none absolute inset-0 flex items-center justify-center text-[6rem] leading-none text-olive/20 select-none">
                          {item.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="kicker mt-5 text-[0.74rem] uppercase tracking-[0.24em] text-olive capitalize">
                    {(item.semantic_tags?.[0] || item.content_type).replace(/-/g, ' ')}
                  </p>
                  <h2 className="display mt-3 text-xl text-ink leading-snug transition-colors group-hover:text-olive">
                    {item.title}
                  </h2>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Closing band ─────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[1100px] bg-ink px-8 py-16 text-center md:py-20">
          <p className="kicker mb-6 text-[0.74rem] uppercase tracking-[0.28em] text-sage">
            Before you go
          </p>
          <p className="display mx-auto max-w-3xl text-3xl leading-tight text-canvas md:text-5xl">
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
