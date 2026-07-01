import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Wheat } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-[hsl(24_30%_8%)] text-amber-50">
      <div className="section-shell py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-600 text-white">
                <Wheat className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-semibold">Levain</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-amber-100/60">
              Small-batch artisan bakehouse. Heritage grain, wild yeast, and a
              great deal of patience — since 2018.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200/80">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {[['home', 'Home'], ['products', 'Menu'], ['story', 'Our Story'], ['order', 'Order']].map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="text-amber-100/60 transition-colors hover:text-amber-50">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200/80">Visit &amp; contact</h4>
            <ul className="space-y-3 text-sm text-amber-100/60">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (555) 123-4567</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@levain.bake</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123 Baker Street, Downtown</li>
            </ul>
            <p className="mt-4 text-sm text-amber-100/60">
              Mon–Sat 7am–8pm · Sun 8am–6pm
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200/80">Follow</h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 transition-colors hover:bg-amber-600"
                  aria-label="Social link"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-sm text-amber-100/50 sm:flex-row">
          <p>© {year} Levain Bakehouse. All rights reserved.</p>
          <p>
            Imagery from{' '}
            <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline">Unsplash</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
