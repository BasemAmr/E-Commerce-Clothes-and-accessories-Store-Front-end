import { Suspense } from 'react';
import Link from 'next/link';
import { Fraunces, Space_Grotesk } from 'next/font/google';
import Container from '@/components/ui/container';
import { LandingSearchDemo } from './landing-client';

const displayFont = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const accentFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function LandingPage() {
  return (
    <main className="bg-[#f8f6f2] text-slate-900">
        <Container>
            {/* Section 1: Hero */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl motion-safe:animate-float-soft" />
                <div className="absolute top-12 right-[-120px] h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl motion-safe:animate-float-soft" />
                <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl motion-safe:animate-shimmer-soft" />
                </div>

                <div className="relative px-4 py-20 sm:py-28 lg:py-32">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <span className={`${accentFont.className} inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600`}>
                        New season drop
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <h1 className={`${displayFont.className} mt-6 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl`}>
                        A modern wardrobe built for movement and light.
                        </h1>
                        <p className="mt-5 max-w-xl text-lg text-slate-600">
                        Curated pieces for modern city life. Discover layered textures, bold
                        tailoring, and effortless silhouettes designed for everyday edge.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                        >
                            Explore the catalog
                        </Link>
                        <Link
                            href="/landing#instant-search"
                            className="inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-900/40"
                        >
                            Watch instant search
                        </Link>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
                        <div>
                            <p className="text-xl font-semibold text-slate-900">1200+</p>
                            <p>Styles curated weekly</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-slate-900">48h</p>
                            <p>Rapid new arrivals</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-slate-900">98%</p>
                            <p>Happy customer fit rate</p>
                        </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)]">
                        <div className="grid gap-4">
                            <div className="rounded-3xl bg-gradient-to-br from-amber-100 via-white to-emerald-100 p-5">
                            <p className={`${accentFont.className} text-xs font-semibold uppercase tracking-[0.2em] text-slate-500`}>
                                Lookbook
                            </p>
                            <p className="mt-3 text-2xl font-semibold text-slate-900">
                                Soft tailoring meets athletic ease.
                            </p>
                            <p className="mt-3 text-sm text-slate-600">
                                Luxe fabrics, clean lines, and layered basics that work
                                from early commute to late dinner.
                            </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                'Airy linen sets',
                                'Sculpted denim',
                                'City-ready outerwear',
                                'Essential tees',
                            ].map((label) => (
                                <div
                                key={label}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                                >
                                {label}
                                </div>
                            ))}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Collection grid */}
            <section className="border-t border-slate-200/70 bg-white/70 px-4">
                <div className="py-16 sm:py-20">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className={`${accentFont.className} text-xs font-semibold uppercase tracking-[0.2em] text-slate-500`}>
                        Curated for city life
                        </p>
                        <h2 className={`${displayFont.className} mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl`}>
                        Four moods. One refined identity.
                        </h2>
                    </div>
                    <p className="max-w-lg text-base text-slate-600">
                        Build outfits by mood, texture, and movement. Each edit is tuned for
                        seasonal layering and effortless transitions from day to night.
                    </p>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                        title: 'Soft Structure',
                        body: 'Tailored blazers and relaxed trousers for clean silhouettes.',
                        accent: 'from-amber-100 to-white',
                        },
                        {
                        title: 'Everyday Canvas',
                        body: 'Neutral tees, knit tanks, and core layering essentials.',
                        accent: 'from-sky-100 to-white',
                        },
                        {
                        title: 'Lightweight Outerwear',
                        body: 'Anoraks, cropped jackets, and elevated utility pieces.',
                        accent: 'from-emerald-100 to-white',
                        },
                        {
                        title: 'After Hours',
                        body: 'Textured fabrics and glossy finishes for evening edits.',
                        accent: 'from-rose-100 to-white',
                        },
                    ].map((card) => (
                        <div
                        key={card.title}
                        className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_25px_50px_-35px_rgba(15,23,42,0.5)] transition hover:-translate-y-1"
                        >
                        <div className={`h-32 rounded-2xl bg-gradient-to-br ${card.accent}`} />
                        <h3 className="mt-6 text-lg font-semibold text-slate-900">
                            {card.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">{card.body}</p>
                        <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            View edit
                        </span>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Instant Search Demo */}
            <section
                id="instant-search"
                className="relative border-t border-slate-200/70 bg-gradient-to-b from-[#f8f6f2] via-white to-white px-4"
            >
                <div className="py-16 sm:py-20">
                    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className={`${accentFont.className} text-xs font-semibold uppercase tracking-[0.2em] text-slate-500`}>
                        Search for your next look!
                        </p>
                        <h2 className={`${displayFont.className} mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl`}>
                        We have your perfect wardrobe collection ready to explore.
                        </h2>
                        <p className="mt-4 text-base text-slate-600">
                        Type any fabric, color, or fit.
                        </p>
                        
                    </div>

                    <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)]">
                        <Suspense fallback={<div className="h-40 rounded-2xl bg-slate-100" />}> 
                        <LandingSearchDemo />
                        </Suspense>
                    </div>
                    </div>
                </div>
            </section>

            {/* Section 4: CTA */}
            <section className="border-t border-slate-200/70 bg-white">
                <div className="py-16 sm:py-20">
                    <div className="grid gap-10 rounded-[32px] border border-slate-200 bg-slate-950 px-8 py-12 text-white shadow-[0_40px_90px_-60px_rgba(15,23,42,0.9)] md:grid-cols-[1.2fr_0.8fr] md:items-center">
                    <div>
                        <p className={`${accentFont.className} text-xs font-semibold uppercase tracking-[0.2em] text-slate-300`}>
                        Ready to launch
                        </p>
                        <h2 className={`${displayFont.className} mt-3 text-3xl font-semibold sm:text-4xl`}>
                        Turn the catalog into a cinematic shopping story.
                        </h2>
                        <p className="mt-4 text-base text-slate-300">
                        We craft landing pages, instant search, and high-performance
                        storefronts for fashion teams who want to move fast.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Link
                        href="/search"
                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                        >
                        Try the live search
                        </Link>
                        <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                        >
                        Browse the store
                        </Link>
                        <p className="text-xs text-slate-400">
                        No code changes needed. We plug into your existing catalog.
                        </p>
                    </div>
                    </div>
                </div>
            </section>
        </Container>
    </main>
  );
}
