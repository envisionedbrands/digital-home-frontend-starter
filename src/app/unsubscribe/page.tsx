/**
 * The page a reader lands on from the unsubscribe link in an email.
 *
 * It asks before acting. The confirm button POSTs to /api/unsubscribe - the
 * page itself never changes anything, because mail scanners follow every link
 * in an email and a mutating page would unsubscribe people who never clicked.
 *
 * Gmail's one-click button skips this page entirely and POSTs straight to the
 * API route. This is the path for someone who clicked the footer link.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Unsubscribe — Envisioned',
  robots: { index: false, follow: false },
};

type Search = { t?: string; state?: string };

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { t = '', state = '' } = await searchParams;

  // Look the address up so the reader can see whose subscription this is.
  // Holding the token is the proof - it's their own address being shown back.
  let email: string | null = null;
  let alreadyOff = false;

  if (t && !state) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('leads')
      .select('email, email_status')
      .eq('unsubscribe_token', t)
      .maybeSingle();
    email = data?.email ?? null;
    alreadyOff = data?.email_status === 'unsubscribed';
  }

  const shell = (kicker: string, heading: string, body: ReactNode) => (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="kicker mb-8">{kicker}</p>
        <h1 className="display text-4xl md:text-6xl text-ink mb-8">{heading}</h1>
        <div className="text-xl text-ink-soft max-w-[38em] leading-[1.75]">{body}</div>
      </div>
    </main>
  );

  if (state === 'done') {
    return shell(
      'Done',
      "You're unsubscribed.",
      <>
        <p className="mb-8">
          You won&rsquo;t receive any more emails from me. It takes effect
          immediately &mdash; nothing else is queued.
        </p>
        <p>
          If this was a mistake, or you&rsquo;d like to come back later, just
          write to{' '}
          <a href="mailto:hello@mariaines.co" className="text-ink underline">
            hello@mariaines.co
          </a>{' '}
          and I&rsquo;ll add you again myself.
        </p>
      </>
    );
  }

  if (state === 'error') {
    return shell(
      'Something broke',
      'That didn’t go through.',
      <p>
        Rather than leave you guessing: write to{' '}
        <a href="mailto:hello@mariaines.co" className="text-ink underline">
          hello@mariaines.co
        </a>{' '}
        and I&rsquo;ll take you off the list by hand. You will not be emailed
        again in the meantime.
      </p>
    );
  }

  if (!t || state === 'invalid' || (!email && !alreadyOff)) {
    return shell(
      'Link not recognised',
      "That link didn't work.",
      <p>
        It may have expired, or been truncated by an email client. Write to{' '}
        <a href="mailto:hello@mariaines.co" className="text-ink underline">
          hello@mariaines.co
        </a>{' '}
        and I&rsquo;ll remove you manually &mdash; you don&rsquo;t have to chase
        this.
      </p>
    );
  }

  if (alreadyOff) {
    return shell(
      'Already done',
      "You're already unsubscribed.",
      <p>
        There&rsquo;s nothing more to do &mdash; you&rsquo;re not on the list.
        If you&rsquo;re still receiving emails from me, that&rsquo;s a fault
        worth telling me about at{' '}
        <a href="mailto:hello@mariaines.co" className="text-ink underline">
          hello@mariaines.co
        </a>
        .
      </p>
    );
  }

  return shell(
    'Unsubscribe',
    'Leaving the list?',
    <>
      <p className="mb-4">
        This will stop all emails to <strong className="text-ink">{email}</strong>.
      </p>
      <p className="mb-10">
        No hard feelings and no follow-up asking you to reconsider. The essays
        stay free to read whenever you want them.
      </p>

      <form method="POST" action="/api/unsubscribe">
        <input type="hidden" name="t" value={t} />
        <button
          type="submit"
          className="bg-ink text-canvas px-8 py-4 text-base font-medium hover:opacity-90 transition-opacity"
        >
          Unsubscribe me
        </button>
      </form>

      <p className="mt-10 text-base">
        Changed your mind?{' '}
        <Link href="/" className="text-ink underline">
          Go back to the site
        </Link>
        .
      </p>
    </>
  );
}
