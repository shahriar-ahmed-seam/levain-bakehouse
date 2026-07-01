import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { fetchProducts } from '../lib/data';

const Products = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await fetchProducts();
      if (!active) return;
      setProducts(data);
      setCategories(['All', ...new Set(data.map((p) => p.category))]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to your basket`);
  };

  return (
    <section id="products" className="bg-background py-24">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">The Bakehouse Menu</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Signature bakes, made by hand
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every item is proofed slowly and baked the same day it reaches you.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:border-amber-300 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  {product.featured && (
                    <Badge className="absolute left-3 top-3 border-0 bg-white/90 text-amber-800 backdrop-blur-sm">
                      ★ Signature
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium uppercase tracking-wider text-amber-700">
                    {product.category}
                  </span>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-display text-2xl font-semibold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
