import React, { useState, useEffect } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { fetchReviews } from '../lib/data';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await fetchReviews();
      if (!active) return;
      setReviews(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const stars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-500 text-amber-500' : 'text-border'}`}
        />
      ))}
    </div>
  );

  return (
    <section id="reviews" className="bg-background py-24">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">Kind Words</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Loved at the breakfast table
          </h2>
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2">
            <span className="font-display text-2xl font-semibold text-foreground">{avg}</span>
            {stars(5)}
            <span className="text-sm text-muted-foreground">/ {reviews.length || 0} reviews</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="relative rounded-2xl border border-border bg-card p-7 shadow-sm"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-amber-100" />
                {stars(review.rating)}
                <blockquote className="mt-4 leading-relaxed text-foreground/90">
                  “{review.comment}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-600 font-display text-lg font-semibold text-white">
                    {review.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
