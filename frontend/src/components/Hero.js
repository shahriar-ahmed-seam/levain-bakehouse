import React from 'react';
import { ArrowRight, Wheat, Star } from 'lucide-react';
import { Button } from './ui/button';
import { HERO_IMAGE } from '../lib/images';

const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE.src}
          alt="Freshly baked artisan bread"
          className="h-full w-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="section-shell">
          <div className="max-w-2xl text-white">
            <div className="animate-rise mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <Wheat className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-medium tracking-wide">Baked fresh every morning</span>
            </div>

            <h1 className="animate-rise delay-1 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              The art of the
              <br />
              <span className="brand-gradient-text">perfect loaf.</span>
            </h1>

            <p className="animate-rise delay-2 mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Levain is a small-batch bakehouse crafting sourdough, pastries and
              celebration bakes with heritage grain, wild yeast and a great deal of
              patience — delivered warm to your door.
            </p>

            <div className="animate-rise delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => scrollTo('products')}
                size="lg"
                className="group h-14 gap-2 bg-amber-600 px-8 py-6 text-base text-white hover:bg-amber-500"
              >
                Explore the menu
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                onClick={() => scrollTo('order')}
                size="lg"
                variant="outline"
                className="h-14 border-white/40 bg-white/5 px-8 py-6 text-base text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
              >
                Order for delivery
              </Button>
            </div>

            <div className="animate-rise delay-3 mt-10 flex items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>Loved by 2,000+ local customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue + credit */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
        </div>
      </div>
      <span className="absolute bottom-4 right-4 z-10 text-[11px] text-white/40">
        Photo:{' '}
        <a href={HERO_IMAGE.creditUrl} target="_blank" rel="noreferrer" className="underline">
          {HERO_IMAGE.credit}
        </a>{' '}
        / Unsplash
      </span>
    </section>
  );
};

export default Hero;

