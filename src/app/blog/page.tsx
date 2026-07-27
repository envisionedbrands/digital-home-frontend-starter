import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import StarterNotice from '@/components/layout/StarterNotice';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Journal — Digital Home Starter',
  description:
    'A polished blog structure for articles, essays, and guides you can adapt to your own brand and publishing system.',
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

const FEATURED_PLACEHOLDERS = [
  {
    label: 'Featured essay',
    note: 'Use this space for a hero image, illustration, or branded editorial visual.',
  },
  {
    label: 'Publishing system',
    note: 'The blog is already structured so new posts can slot cleanly into the site.',
  },
  {
    label: 'On-brand later',
    note: 'Swap in your own imagery and voice once the starter becomes your site.',
  },
];

const CARD_PLACEHOLDERS = [
  'Add a branded article image or abstract visual.',
  'Use a product detail, workspace shot, or custom illustration.',
  'Keep it simple with a neutral texture or editorial graphic.',
];

export default async function BlogPage() {
  let allArticles: Array<{
    slug: string;
    title: string;
    excerpt: string;
    semantic_tags: string[];
    content_type: string;
    published_at: string;
    reading_time: number;
    image: string;
  }> = [];

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
      semantic_tags: a.semantic_tags || [],
      content_type: a.content_type,
      published_at: a.published_at || a.slug,
      reading_time: estimateReadingTime(a.body),
      image: a.featured_image_url || '',
    }));
  } catch (err) {
    console.error('Blog page error:', err);
  }

  // Empty state
  if (allArticles.length === 0) {
    return (
      <main>
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl  border border-hair bg-canvas-soft p-10 text-center">
            <span className="inline-flex  border border-hair bg-canvas-soft px-4 py-1.5 text-[0.78rem] font-medium text-taupe mb-6">
              Publishing structure
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.06em] text-ink mb-4">
              Your journal is ready for the first post.
            </h1>
            <p className="text-lg text-taupe leading-relaxed">
              This starter already includes the blog layout. Connect the backend publishing flow, add your
              first article, and this space becomes your live editorial archive.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const featured = allArticles[0];
  const rest = allArticles.slice(1);

  return (
    <main>
      <section className="pt-32 pb-14 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between gap-6 pb-6 mb-8 border-b border-hair text-[0.72rem] font-medium text-olive">
            <span>Publishing structure</span>
            <span>{allArticles.length} live article{allArticles.length === 1 ? '' : 's'}</span>
          </div>

          <div className="max-w-4xl">
            <p className="inline-flex  border border-hair bg-canvas-soft px-4 py-1.5 text-[0.78rem] font-medium text-taupe mb-6">
              Journal
            </p>
            <h1 className="text-5xl md:text-7xl xl:text-[6.6rem] font-semibold tracking-[-0.075em] text-ink leading-[0.95] mb-6">
              A publishing layer
              <br />
              ready for your voice.
            </h1>
            <p className="text-lg md:text-2xl text-neutral-300 max-w-3xl leading-relaxed">
              This starter ships with a clean editorial archive for articles, essays, and guides. Keep the
              structure, then tailor the visuals, categories, and voice to match your brand.
            </p>

            <StarterNotice compact />
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href={`/blog/${featured.slug}`}
            className="grid overflow-hidden  border border-hair bg-canvas-soft transition-all duration-300 hover:border-hair-olive hover:bg-canvas-soft lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
          >
            <div className="border-b border-hair lg:border-b-0 lg:border-r lg:border-hair">
              {featured.image ? (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  width={1792}
                  height={1024}
                  className="h-full min-h-[320px] w-full object-cover"
                  priority
                />
              ) : (
                <div className="grid h-full min-h-[320px] grid-cols-1 gap-px bg-hair p-px sm:grid-cols-3">
                  {FEATURED_PLACEHOLDERS.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex flex-col justify-between  px-6 py-6 ${
                        index === 0 ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))]' :
                        index === 1 ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]' :
                        'bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))]'
                      }`}
                    >
                      <span className="inline-flex w-fit  border border-hair bg-canvas/80 px-3 py-1 text-[0.68rem] font-medium text-olive">
                        {item.label}
                      </span>
                      <p className="max-w-[18ch] text-sm leading-relaxed text-neutral-300">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-8 md:p-10">
              <span className="inline-flex w-fit  border border-hair bg-canvas-soft px-3 py-1 text-[0.72rem] font-medium text-taupe">
                Featured article
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-[-0.05em] text-ink">
                {featured.title}
              </h2>
              <p className="mt-4 text-lg text-taupe leading-relaxed">
                {featured.excerpt || 'Open this post to see how a published article sits inside the starter’s editorial structure.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[0.75rem] font-medium text-olive">
                <span className=" border border-hair px-3 py-1.5">
                  {formatDate(featured.published_at)}
                </span>
                <span className=" border border-hair px-3 py-1.5">
                  {featured.reading_time} min read
                </span>
                <span className=" border border-hair px-3 py-1.5 capitalize">
                  {featured.content_type}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {rest.length > 0 && (
        <section className="px-6 pb-24">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-olive mb-4">
                  More from the archive
                </p>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.05em] text-ink">
                  The rest of the journal.
                </h2>
              </div>
              <span className="hidden md:inline-flex  border border-hair px-4 py-2 text-sm text-olive">
                {allArticles.length} published entries
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((article, index) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group block overflow-hidden  border border-hair bg-canvas-soft transition-all duration-300 hover:border-hair-olive hover:bg-canvas-soft"
                >
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={896}
                      height={512}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-52 items-end border-b border-hair bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-6">
                      <p className="max-w-[20ch] text-sm leading-relaxed text-neutral-300">
                        {CARD_PLACEHOLDERS[index % CARD_PLACEHOLDERS.length]}
                      </p>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 text-[0.72rem] font-medium text-olive">
                      <span className=" border border-hair px-3 py-1">
                        {formatDate(article.published_at)}
                      </span>
                      <span className=" border border-hair px-3 py-1">
                        {article.reading_time} min read
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-ink">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-taupe">
                      {article.excerpt || 'Use this card style for publishing ideas, essays, updates, and evergreen content.'}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {article.semantic_tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className=" border border-hair bg-canvas-soft px-3 py-1 text-[0.72rem] text-taupe"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
