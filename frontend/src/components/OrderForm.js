import React, { useState } from 'react';
import { MapPin, Clock, ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useCart } from '../contexts/CartContext';
import { deliveryZones } from '../mock';
import { submitOrder } from '../lib/data';
import { toast } from 'sonner';

const EMPTY = { name: '', email: '', phone: '', address: '', deliveryZone: '', notes: '' };

const OrderForm = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedZone = deliveryZones.find((z) => z.zone === formData.deliveryZone);
  const deliveryFee = selectedZone?.fee || 0;
  const totalAmount = getCartTotal() + deliveryFee;

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return toast.error('Your basket is empty!');
    if (!formData.name || !formData.email || !formData.phone || !formData.deliveryZone)
      return toast.error('Please fill in all required fields');
    if (formData.deliveryZone !== 'Pickup' && !formData.address)
      return toast.error('Please provide a delivery address');

    setIsSubmitting(true);
    try {
      const { demo } = await submitOrder({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || 'Pickup',
          delivery_zone: formData.deliveryZone,
        },
        items: cartItems.map((item) => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        notes: formData.notes,
      });

      toast.success(
        demo
          ? 'Order confirmed (demo) — thanks for trying Levain!'
          : "Order placed! We'll be in touch shortly."
      );
      clearCart();
      setFormData(EMPTY);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="bg-secondary py-24">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">Order &amp; Delivery</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Fresh to your door
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us where to deliver and we'll bake your order the same day.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Delivery details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="jane@example.com" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="zone">Delivery zone *</Label>
                  <Select value={formData.deliveryZone} onValueChange={(v) => handleChange('deliveryZone', v)}>
                    <SelectTrigger id="zone">
                      <SelectValue placeholder="Select a zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryZones.map((zone) => (
                        <SelectItem key={zone.zone} value={zone.zone}>
                          {zone.zone} — ${zone.fee.toFixed(2)} ({zone.time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.deliveryZone && formData.deliveryZone !== 'Pickup' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Delivery address *</Label>
                    <Textarea id="address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="123 Main St, Apt 4B" rows={2} />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="notes">Special instructions</Label>
                  <Textarea id="notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Any allergies or requests?" rows={2} />
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting || cartItems.length === 0} className="w-full gap-2 bg-amber-600 text-white hover:bg-amber-700">
                  {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Placing order…</> : <>Place order · ${totalAmount.toFixed(2)}</>}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-2xl">
                  <ShoppingBag className="h-5 w-5 text-amber-600" /> Your basket
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Your basket is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="space-y-2 border-t border-border pt-4 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span><span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery</span><span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-semibold text-foreground">
                        <span>Total</span><span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              {[
                { icon: MapPin, t: 'Multiple zones', b: 'Flexible delivery across the city.' },
                { icon: Clock, t: 'Same-day baking', b: 'Most orders arrive in 30–75 minutes.' },
                { icon: ShieldCheck, t: 'Freshness promise', b: 'Baked the day it reaches you.' },
              ].map((x) => (
                <div key={x.t} className="flex items-start gap-3">
                  <x.icon className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-foreground">{x.t}</h4>
                    <p className="text-sm text-muted-foreground">{x.b}</p>
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

export default OrderForm;
