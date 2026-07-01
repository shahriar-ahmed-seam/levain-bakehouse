import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Wheat } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import CartSheet from './CartSheet';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Menu' },
  { id: 'story', label: 'Our Story' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'order', label: 'Order' },
];

const Header = () => {
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const count = getCartCount();
  const dark = !scrolled && !isMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled || isMenuOpen
            ? 'border-b border-border bg-background/90 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="section-shell flex items-center justify-between py-4">
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-2.5">
            <span
              className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
                dark ? 'bg-white/15 text-white backdrop-blur-md' : 'bg-amber-600 text-white'
              }`}
            >
              <Wheat className="h-5 w-5" />
            </span>
            <span
              className={`font-display text-2xl font-semibold tracking-tight ${
                dark ? 'text-white' : 'text-foreground'
              }`}
            >
              Levain
            </span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors ${
                  dark ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative grid h-10 w-10 place-items-center rounded-full transition-colors ${
                dark ? 'text-white hover:bg-white/15' : 'text-foreground hover:bg-muted'
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-amber-600 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </button>

            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${dark ? 'text-white hover:bg-white/15' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="section-shell flex flex-col gap-1 pb-4 md:hidden">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
