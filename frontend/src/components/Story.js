import React from 'react';
import { Wheat, Clock3, Leaf, HandHeart } from 'lucide-react';
import { STORY_IMAGE } from '../lib/images';

const PILLARS = [
  { icon: Wheat, title: 'Heritage grain', body: 'Stone-milled flours from regional farms.' },
  { icon: Clock3, title: 'Slow proof', body: 'A 36-hour cold ferment for deep flavour.' },
  { icon: Leaf, title: 'Real ingredients', body: 'Nothing artificial — ever.' },
  { icon: HandHeart, title: 'Made by hand', body: 'Shaped and scored one loaf at a time.' },
];

const Story = () => {
  return (
    <section id="story" className="relative overflow-hidden bg-secondary py-24">
      <div className="section-shell">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={STORY_IMAGE.src}
                alt="Freshly baked croissants"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-amber-600 px-7 py-6 text-white shadow-xl sm:block">
              <p className="font-display text-4xl font-semibold">7+</p>
              <p className="text-sm text-amber-50">years of baking</p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              A neighbourhood bakehouse, done properly
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Levain began at a single home oven and a stubborn belief that great
              bread should be part of everyday life. Today we still bake in small
              batches, guided by the same wild starter we began with — because the
              best things take time.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-5">
              {PILLARS.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
