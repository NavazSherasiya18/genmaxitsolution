import React, { useState } from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight, Plus, Minus, Trash2, X, ChevronDown, MapPin } from 'lucide-react';
import { ShowcaseProject } from '../../data/showcaseProjects';
import { ProjectBrandLogo } from '../brand/ProjectLogos';

interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  qty: number;
}

export const AureliaLandingPage: React.FC<{ project: ShowcaseProject }> = ({ project }) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const [category, setCategory] = useState<'all' | 'rings' | 'necklaces' | 'earrings'>('all');
  const [bagOpen, setBagOpen] = useState(false);
  const [bagItems, setBagItems] = useState<CartItem[]>([
    { id: 'serpentine-choker', name: 'The Serpentine Diamond Choker', subtitle: '14.5ct VVS · 18K White Gold', price: 34000, qty: 1 },
  ]);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Bespoke Studio Configurator State
  const [bespokeCut, setBespokeCut] = useState<'Emerald Cut' | 'Pear Solitaire' | 'Radiant Cushion'>('Emerald Cut');
  const [bespokeMetal, setBespokeMetal] = useState<'Platinum 950' | '18K Champagne Gold' | '18K Rose Gold'>('Platinum 950');
  const [bespokeCarat, setBespokeCarat] = useState<number>(3.5);
  const [activeSalon, setActiveSalon] = useState<'paris' | 'milan' | 'geneva' | 'dubai'>('paris');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const products = [
    {
      id: 'colombian-emerald-ring',
      category: 'rings',
      name: 'Jardin Pear Emerald Solitaire Ring',
      subtitle: '4.8ct Untreated Colombian Emerald · Pavé Halo',
      price: 22800,
      image: project.secondaryImage,
      tag: 'One-of-One Vault Piece',
    },
    {
      id: 'serpentine-choker',
      category: 'necklaces',
      name: 'The Serpentine Diamond Choker',
      subtitle: '14.5ct Emerald-Cut VVS Diamonds · Platinum',
      price: 34000,
      image: project.thumbnail,
      tag: 'Haute Joaillerie',
    },
    {
      id: 'cascade-earrings',
      category: 'earrings',
      name: 'Lumière Cascade Drop Earrings',
      subtitle: '6.2ct D-Flawless Tear Drops · Milanese Atelier',
      price: 15200,
      image: project.secondaryImage,
      tag: 'Atelier Signature',
    },
    {
      id: 'vendome-signet',
      category: 'rings',
      name: 'Vendôme Baguette Eternity Band',
      subtitle: '5.4ct Asscher-Cut Diamonds · 18K Yellow Gold',
      price: 18900,
      image: project.thumbnail,
      tag: 'Paris Boutique Exclusive',
    },
    {
      id: 'celeste-riviera',
      category: 'necklaces',
      name: 'Céleste Riviera Diamond Collar',
      subtitle: '21.0ct Graduated Marquise Diamonds · Platinum',
      price: 58500,
      image: project.thumbnail,
      tag: 'Archival Masterpiece',
    },
    {
      id: 'duchesse-studs',
      category: 'earrings',
      name: 'Duchesse Asscher Solitaire Studs',
      subtitle: '4.0ct Matched VVS1 Pair · GIA Twin Dossier',
      price: 19400,
      image: project.secondaryImage,
      tag: 'Collector Essentials',
    },
  ];

  const filteredProducts = category === 'all' ? products : products.filter((p) => p.category === category);

  const addToBag = (item: { id: string; name: string; subtitle: string; price: number }) => {
    setBagItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCheckoutDone(false);
    showToast(`Added "${item.name}" to your Aurélia shopping bag.`);
  };

  const updateBagQty = (id: string, delta: number) => {
    setBagItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p)).filter((p) => p.qty > 0)
    );
  };

  const bagTotal = bagItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const bagCount = bagItems.reduce((sum, i) => sum + i.qty, 0);

  const bespokeBase = bespokeCut === 'Emerald Cut' ? 7800 : bespokeCut === 'Pear Solitaire' ? 8400 : 7200;
  const metalPremium = bespokeMetal === 'Platinum 950' ? 2400 : 1200;
  const estimatedCommissionPrice = Math.round(bespokeBase * bespokeCarat + metalPremium);

  const salons = {
    paris: {
      city: 'Place Vendôme · Paris Flagship',
      address: '14 Place Vendôme, 75001 Paris, France',
      hours: 'Mon–Sat · 10:00 – 19:00 CET (Private Salon After Hours)',
      director: 'Directed by Sophie Moreau, Master Gemologist',
    },
    milan: {
      city: 'Via Montenapoleone · Milan Atelier',
      address: 'Via Monte Napoleone 21, 20121 Milano, Italy',
      hours: 'Mon–Sat · 10:30 – 19:30 CET',
      director: 'Directed by Lorenzo Conti, Head of Setting',
    },
    geneva: {
      city: 'Rue du Rhône · Geneva Vault Suite',
      address: 'Rue du Rhône 42, 1204 Genève, Switzerland',
      hours: 'By Private Appointment Only',
      director: 'Directed by Marc-Antoine Rochat, High Jewelry Advisor',
    },
    dubai: {
      city: 'DIFC Gate Village · Dubai Salon',
      address: 'Gate Village Building 8, DIFC, Dubai, UAE',
      hours: 'Daily · 11:00 – 22:00 GST',
      director: 'Directed by Tariq Al-Mansoor, Private Client Director',
    },
  }[activeSalon];

  const faqs = [
    {
      q: 'How are high-value pieces delivered internationally?',
      a: 'Every piece exceeding $10,000 is dispatched exclusively via Malca-Amit or Ferrari Group armored courier with 100% Lloyd’s transit underwriting until personally signed for.',
    },
    {
      q: 'What certifications accompany natural diamonds and Colombian emeralds?',
      a: 'All center stones above 1.0 carat include original dual dossiers from the GIA (Gemological Institute of America) and SSEF Switzerland verifying natural origin and zero clarity enhancement.',
    },
    {
      q: 'Can I preview a custom 3D wax mold before casting in gold or platinum?',
      a: 'Yes. Bespoke commissions include high-resolution CAD renderings and a couriered 1:1 resin fit model for finger-size and proportion sign-off prior to setting.',
    },
    {
      q: 'Do you offer lifetime ultrasonic care and heirloom resizing?',
      a: 'Complimentary lifetime prong inspection, rhodium restoration, and one-time bespoke resizing are included at any Aurélia salon worldwide.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090B10] text-[#F8FAFC] relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#D4AF37] text-[#090B10] text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#090B10]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a href="#top" className="shrink-0">
            <ProjectBrandLogo projectId={project.id} size="md" tone="light" />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.18em] text-slate-300 font-medium">
            <a href="#collections" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0">Collections</a>
            <a href="#bespoke" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0">Bespoke Studio</a>
            <a href="#atelier" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0">The Atelier</a>
            <a href="#salons" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0">Salons</a>
          </nav>

          <button
            onClick={() => setBagOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#141824] border border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#090B10] transition-all text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">Shopping Bag ({bagCount})</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="top" className="py-16 lg:py-24 border-b border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="text-xs tracking-[0.22em] uppercase text-[#D4AF37] font-semibold">
              Place Vendôme Paris · Via Montenapoleone Milan
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textWrap: 'balance' }}
            >
              High Jewelry Crafted for Collectors of Rare Fire
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Untreated Colombian emeralds, Type IIa diamonds, and solid 18K recycled gold hand-set by master Parisian setters. Insured private vault courier worldwide within 48 hours.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#collections"
                className="px-7 py-3.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#090B10] font-bold text-xs uppercase tracking-[0.16em] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Explore Haute Joaillerie</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#bespoke"
                className="px-7 py-3.5 rounded-lg border border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#D4AF37]/10 font-semibold text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap shrink-0"
              >
                Design Bespoke Ring
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="h-full min-h-[420px] rounded-2xl overflow-hidden border border-[#D4AF37]/30 relative">
              <img
                src={project.thumbnail}
                alt="Aurélia High Jewelry Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B10]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#090B10]/90 border border-[#D4AF37]/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#D4AF37] font-medium">Featured Vault Release</div>
                  <div className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    The Serpentine Diamond Choker
                  </div>
                  <div className="text-xs text-slate-400 tabular-nums">14.5ct VVS Diamonds · $34,000 USD</div>
                </div>
                <button
                  onClick={() => addToBag({ id: 'serpentine-choker', name: 'The Serpentine Diamond Choker', subtitle: '14.5ct VVS · Platinum', price: 34000 })}
                  className="px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#090B10] text-xs font-bold uppercase tracking-wider hover:bg-[#E5C158] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  + Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Provenance Strip */}
      <section className="py-10 border-b border-slate-800/80 bg-[#0D1017]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { metric: '$34,000+', label: 'Average Collector Piece' },
            { metric: 'GIA & SSEF', label: 'Dual Origin Certification' },
            { metric: '48 Hours', label: 'Armored Global Dispatch' },
            { metric: '100% Ethical', label: 'Traceable 18K Recycled Gold' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-xl font-bold text-[#D4AF37] tabular-nums" style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.metric}
              </div>
              <div className="text-xs text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Curated Catalog Collection (6 Products) */}
      <section id="collections" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Atelier Curated Releases</div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Private Collection Catalog
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Pieces (6)' },
                { id: 'rings', label: 'Rings' },
                { id: 'necklaces', label: 'Necklaces' },
                { id: 'earrings', label: 'Earrings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategory(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    category === tab.id
                      ? 'bg-[#D4AF37] text-[#090B10]'
                      : 'bg-[#121622] text-slate-300 border border-slate-800 hover:border-[#D4AF37]/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden bg-[#10141F] border border-slate-800/90 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group"
              >
                <div className="h-68 overflow-hidden bg-black relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#D4AF37] mb-1">{item.tag}</div>
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-base font-bold text-white tabular-nums">${item.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToBag(item)}
                      className="px-4 py-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#090B10] text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Bespoke Commission Configurator */}
      <section id="bespoke" className="py-20 bg-[#0D1017] border-y border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Paris Bespoke Studio</div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Configure a One-of-One Solitaire Commission
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Select your preferred stone cut, precious alloy, and carat weight to receive an immediate valuation estimate and reserve private stone sourcing with Place Vendôme gemologists.
            </p>

            {/* Configurator Controls */}
            <div className="p-6 rounded-2xl bg-[#121622] border border-[#D4AF37]/25 space-y-5">
              <div>
                <div className="text-xs text-slate-400 mb-2">Center Diamond / Gemstone Cut</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['Emerald Cut', 'Pear Solitaire', 'Radiant Cushion'] as const).map((cut) => (
                    <button
                      key={cut}
                      onClick={() => setBespokeCut(cut)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        bespokeCut === cut ? 'bg-[#D4AF37] text-[#090B10]' : 'bg-[#090B10] text-slate-300 border border-slate-800'
                      }`}
                    >
                      {cut}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-2">Precious Setting Alloy</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['Platinum 950', '18K Champagne Gold', '18K Rose Gold'] as const).map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setBespokeMetal(metal)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        bespokeMetal === metal ? 'bg-[#D4AF37] text-[#090B10]' : 'bg-[#090B10] text-slate-300 border border-slate-800'
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Target Carat Weight</span>
                  <strong className="text-[#D4AF37] font-mono tabular-nums">{bespokeCarat.toFixed(1)} Carats</strong>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={8.0}
                  step={0.5}
                  value={bespokeCarat}
                  onChange={(e) => setBespokeCarat(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Estimated Bespoke Allocation</div>
                  <div className="text-2xl font-bold text-[#F3E5AB] tabular-nums" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ${estimatedCommissionPrice.toLocaleString()} USD
                  </div>
                </div>
                <button
                  onClick={() =>
                    addToBag({
                      id: `bespoke-${bespokeCut}-${bespokeCarat}`,
                      name: `Bespoke ${bespokeCarat}ct ${bespokeCut} Commission`,
                      subtitle: `Handcrafted in ${bespokeMetal} · Deposit Hold`,
                      price: estimatedCommissionPrice,
                    })
                  }
                  className="px-5 py-3 rounded-lg bg-[#D4AF37] text-[#090B10] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C158] cursor-pointer whitespace-nowrap shrink-0"
                >
                  Reserve Commission in Bag
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#D4AF37]/25 h-[440px]">
            <img
              src={project.secondaryImage}
              alt="Emerald Gemstone Hand Setting"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. 4-Stage Atelier Craftsmanship Heritage */}
      <section id="atelier" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-2">300 Hours Per Masterpiece</div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Place Vendôme Creation Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01. Gemological Selection', desc: 'Fewer than 1.6% of rough stones submitted pass optical fluorescence and inclusion screening.' },
              { step: '02. Gouache & CAD Wax', desc: 'Master illustrators hand-paint 1:1 gouache renderings before milling high-precision wax fittings.' },
              { step: '03. Micro-Pavé Setting', desc: 'Microscopic bezel and claw setting executed under 40x Leica optics inside our Paris atelier.' },
              { step: '04. Armored Vault Courier', desc: 'Dual-certified GIA/SSEF dossiers and insured white-glove delivery anywhere globally within 48h.' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#10141F] border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>{item.step}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Global Private Salons Directory */}
      <section id="salons" className="py-20 bg-[#0D1017] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Global Presence</div>
            <h2 className="text-3xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Private Viewing Salons
            </h2>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {(['paris', 'milan', 'geneva', 'dubai'] as const).map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveSalon(city)}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    activeSalon === city ? 'bg-[#D4AF37] text-[#090B10]' : 'bg-[#121622] text-slate-300 border border-slate-800'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-8 rounded-2xl bg-[#121622] border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Private Suite Appointment</span>
            </div>
            <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {salons.city}
            </h3>
            <p className="text-sm text-slate-300">{salons.address}</p>
            <p className="text-xs text-slate-400">{salons.hours}</p>
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-[#F3E5AB]">{salons.director}</span>
              <button
                onClick={() => showToast(`Private consultation slot requested at ${salons.city}.`)}
                className="px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#090B10] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C158] cursor-pointer"
              >
                Book Salon Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Collector FAQ & Concierge Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
              Private Collector Inquiries & Provenance FAQ
            </h2>
            <div className="space-y-3 pt-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl bg-[#10141F] border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/70 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#10141F] border border-[#D4AF37]/30 text-center space-y-5">
            <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Receive Private Vault Acquisition Dossiers
            </h3>
            {joined ? (
              <div className="p-4 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-sm font-medium">
                Invitation Confirmed — Our Place Vendôme Private Client Director will contact you shortly.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes('@')) {
                    setJoined(true);
                    showToast('Private Salon concierge invitation registered.');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email..."
                  className="flex-1 px-4 py-3 rounded-lg bg-[#090B10] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#D4AF37] text-[#090B10] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C158] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Request Invitation
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Multi-Column Brand Footer */}
      <footer className="py-12 border-t border-slate-800/80 bg-[#050608] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <ProjectBrandLogo projectId={project.id} size="sm" tone="light" />
            <p className="leading-relaxed">Independent Parisian high jewelry house crafting certified heirloom pieces since 1924.</p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase tracking-wider">Collections</div>
            <div>Haute Joaillerie</div>
            <div>Colombian Emeralds</div>
            <div>Bespoke Solitaires</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase tracking-wider">Salons</div>
            <div>14 Place Vendôme, Paris</div>
            <div>Via Montenapoleone 21, Milan</div>
            <div>Rue du Rhône 42, Geneva</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-white uppercase tracking-wider">Private Desk</div>
            <div>concierge@aureliacouture.com</div>
            <div>+33 1 42 68 55 00</div>
            <div>© 2026 Aurélia &amp; Co.</div>
          </div>
        </div>
      </footer>

      {/* Shopping Bag Drawer */}
      {bagOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0E121C] border-l border-[#D4AF37]/30 h-full p-6 flex flex-col justify-between text-white">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Your Aurélia Shopping Bag ({bagCount})
                </h3>
                <button onClick={() => setBagOpen(false)} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {bagItems.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Your shopping bag is currently empty.</p>
                ) : (
                  bagItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-[#141926] border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.subtitle}</div>
                        <div className="text-xs font-bold text-[#D4AF37] mt-1 tabular-nums">${(item.price * item.qty).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateBagQty(item.id, -1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold tabular-nums w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateBagQty(item.id, 1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => updateBagQty(item.id, -item.qty)} className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Insured Armored Delivery</span>
                <span className="text-emerald-400 font-semibold">Complimentary</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold">
                <span>Estimated Total</span>
                <span className="text-[#D4AF37] tabular-nums">${bagTotal.toLocaleString()} USD</span>
              </div>
              {checkoutDone ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center">
                  Vault Order #AU-9042 Reserved — Armored Courier Scheduling Sent
                </div>
              ) : (
                <button
                  disabled={bagItems.length === 0}
                  onClick={() => {
                    setCheckoutDone(true);
                    showToast('Order #AU-9042 Reserved via Armored Vault Dispatch!');
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#090B10] font-bold text-xs uppercase tracking-widest hover:bg-[#E5C158] disabled:opacity-40 cursor-pointer"
                >
                  Proceed to Vault Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
