import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Envisioned Systems',
  description:
    'Maria-Inés builds AI infrastructure that codifies founder thinking. Venezuela taught her what breaks when everything depends on one person.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 pt-40 pb-32 flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="kicker mb-8">About</p>

        <h1 className="display text-4xl md:text-6xl xl:text-7xl text-ink mb-8">
          Systems fail people.
          <br />
          I build the kind that don&rsquo;t.
        </h1>

        <div className="max-w-[40em] space-y-6 text-[1.15rem] text-ink-soft leading-[1.8] mb-20">
          <p>
            I grew up watching Venezuela collapse. I know exactly what happens
            when systems fail the people inside them, and I&rsquo;ve spent twenty
            years in rooms (humanitarian operations across thirty countries,
            ethics panels, one livestream that reached the Pentagon) where
            &ldquo;move fast&rdquo; was not an acceptable answer.
          </p>
          <p>
            My mother kept a boutique. I watched, daily, what a garment fitted to
            one body does that the factory version never will. That is the whole
            method: su misura, made to measure, applied to how a founder thinks.
          </p>
          <p>
            Today I build AI infrastructure for women whose businesses run on
            their judgment: mentors with a named method, founders whose standards
            are the product. The work is extraction (getting the thinking out of
            your head), codification (writing it where humans and machines can
            both read it), and deployment (tools that carry your standards into
            rooms you&rsquo;re not in).
          </p>
        </div>

        <div className="grid gap-px sm:grid-cols-2 mb-20 border border-hair bg-hair">
          {[
            [
              'Access',
              'For the first time in history, leverage is not reserved for companies with massive teams and budgets. You can build and ship without gatekeepers. That matters most to the people systems usually fail.',
            ],
            [
              'Agency',
              'Support is not surrender; adoption is authorship. AI amplifies you. It never replaces you, and anything that tries has been built wrong.',
            ],
            [
              'Refusal',
              'Refusing AI is a privilege most women building businesses do not have. Using it without refusals is how brilliant work goes generic. Engage consciously; keep your no.',
            ],
            [
              'Transmission',
              'Literacy is influence. When we use these tools deliberately, we shape how they get used. Helping other women build with their own intelligence raises more women. A rising tide lifts all boats.',
            ],
          ].map(([label, note]) => (
            <div key={label} className="bg-canvas-soft px-8 py-9">
              <span className="kicker block mb-5">{label}</span>
              <p className="text-[1.05rem] text-taupe leading-[1.7]">{note}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-hair-olive pt-10">
          <p className="kicker mb-6">What I won&rsquo;t build</p>
          <p className="text-[1.08rem] text-taupe leading-[1.75] max-w-[40em] mb-8">
            I don&rsquo;t build founder replacements. I don&rsquo;t build
            chatbots that impersonate intimacy. I don&rsquo;t build anything your
            clients would feel deceived by. Every system ships with its refusals
            written in, because your &ldquo;no&rdquo; is half of your method.
          </p>
          <Link
            href="/blog"
            className="text-[1.02rem] italic text-olive hover:text-olive-deep transition-colors"
          >
            Read the essays &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
