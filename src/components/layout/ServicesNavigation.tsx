import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { SERVICE_CATEGORIES, servicePath, type CatalogService, type ServiceCategoryId } from '../../data/servicesData';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-cyan-400';
const accent = 'text-indigo-600 dark:text-cyan-400';

function ServiceLinks({ services, inDrawer = false, onNavigate }: {
  services: CatalogService[];
  inDrawer?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {services.map((service) => (
        <li key={service.slug}>
          <NavLink
            to={servicePath(service.slug)}
            end
            onClick={onNavigate}
            className={({ isActive }) => `group/item flex items-center justify-between gap-1 rounded-md px-1.5 text-xs leading-snug hover:text-indigo-600 dark:hover:text-white motion-safe:transition-colors ${focusRing} ${
              inDrawer ? 'min-h-11 py-2' : 'min-h-6 py-1 pointer-coarse:min-h-11'
            } ${isActive ? `${accent} bg-indigo-50 font-semibold dark:bg-slate-800` : 'text-slate-600 dark:text-slate-300'}`}
          >
            <span>{service.title}</span>
            <ArrowUpRight aria-hidden="true" className="size-3 shrink-0 text-indigo-600 opacity-0 motion-safe:transition-opacity group-hover/item:opacity-100 group-focus-visible/item:opacity-100 dark:text-cyan-400" />
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function ServicesFooter({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
      <span>Need a custom technology roadmap?</span>
      <Link to="/services" onClick={onNavigate} className={`ml-auto inline-flex min-h-11 items-center gap-1 rounded font-semibold hover:underline lg:min-h-8 pointer-coarse:min-h-11 ${accent} ${focusRing}`}>
        View All Capabilities <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </Link>
    </div>
  );
}

export function ServicesMegaMenu({ active }: { active: boolean }) {
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState<'hover' | 'disclosure' | false>(false);
  const { key: locationKey } = useLocation();

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);
  useEffect(() => setOpen(false), [locationKey]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;

      if (root.current?.contains(document.activeElement)) {
        event.preventDefault();
        toggle.current?.focus();
      }
      setOpen(false);
    };
    const breakpoint = window.matchMedia('(min-width: 64rem)');
    const handleBreakpoint = () => setOpen(false);

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    breakpoint.addEventListener('change', handleBreakpoint);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      breakpoint.removeEventListener('change', handleBreakpoint);
    };
  }, [open]);

  function closeAfterNavigation() {
    if (root.current?.contains(document.activeElement)) toggle.current?.focus();
    setOpen(false);
  }

  return (
    <div
      ref={root}
      className="inline-flex items-center whitespace-nowrap"
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return;
        window.clearTimeout(leaveTimer.current);
        setOpen((current) => current || 'hover');
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return;
        leaveTimer.current = window.setTimeout(() => {
          if (root.current?.contains(document.activeElement)) return;
          setOpen((current) => current === 'hover' ? false : current);
        }, 180);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        to="/services"
        onClick={() => setOpen(false)}
        className={`rounded py-2 transition-colors hover:text-indigo-600 dark:hover:text-white ${focusRing} ${active ? `${accent} font-semibold` : ''}`}
      >
        Services
      </Link>
      <button
        ref={toggle}
        type="button"
        aria-label="Service categories"
        aria-expanded={Boolean(open)}
        aria-controls={panelId}
        className={`inline-flex h-9 items-center justify-center rounded pl-1.5 hover:text-indigo-600 dark:hover:text-white pointer-coarse:min-w-11 ${focusRing}`}
        onClick={() => setOpen((current) => current ? false : 'disclosure')}
      >
        <ChevronDown aria-hidden="true" className={`size-3.5 motion-safe:transition-transform ${open ? `rotate-180 ${accent}` : ''}`} />
      </button>

      <div id={panelId} inert={!open} data-open={Boolean(open)} className="services-mega-menu absolute inset-x-0 top-full mx-auto w-[calc(100%-3rem)] max-w-[76rem] pt-1 whitespace-normal">
        <div className="genmax-card flex max-h-[calc(100dvh-6rem)] flex-col rounded-2xl px-4 pt-4 pb-2 xl:px-6">
          <div className="services-menu-scroll min-h-0 overflow-y-auto overscroll-contain p-1 pb-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 xl:grid-cols-4">
              {SERVICE_CATEGORIES.map((category) => (
                <div key={category.id} className="min-w-0">
                  <p className={`mb-1 px-1.5 text-xs leading-snug font-bold tracking-wider uppercase ${accent}`}>{category.title}</p>
                  <ServiceLinks services={category.services} onNavigate={closeAfterNavigation} />
                </div>
              ))}
            </div>
          </div>
          <ServicesFooter onNavigate={closeAfterNavigation} />
        </div>
      </div>
    </div>
  );
}

export function MobileServicesAccordion({ onNavigate }: { onNavigate: () => void }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryId | null>(null);

  return (
    <div className="border-b border-slate-100 dark:border-slate-800">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded text-left text-base font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-cyan-400 ${focusRing}`}
        onClick={() => setOpen(!open)}
      >
        Services
        <ChevronDown aria-hidden="true" className={`size-4 shrink-0 motion-safe:transition-transform ${open ? `rotate-180 ${accent}` : ''}`} />
      </button>

      <div id={panelId} inert={!open} data-open={open} className="services-accordion-panel">
        <div className="min-h-0 overflow-hidden">
          <div className="md:hidden">
            {SERVICE_CATEGORIES.map((category) => {
              const expanded = activeCategory === category.id;
              const categoryId = `${panelId}-${category.id}`;
              return (
                <div key={category.id} className="border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={categoryId}
                    onClick={() => setActiveCategory(expanded ? null : category.id)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm font-semibold ${accent} ${focusRing}`}
                  >
                    {category.title}
                    <ChevronDown aria-hidden="true" className={`size-4 shrink-0 motion-safe:transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  <div id={categoryId} inert={!expanded} data-open={expanded} className="services-accordion-panel">
                    <div className="min-h-0 overflow-hidden">
                      <div className="mx-2 mb-2.5 border-l border-slate-200 px-2 dark:border-slate-800">
                        <ServiceLinks services={category.services} inDrawer onNavigate={onNavigate} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden grid-cols-2 gap-x-6 gap-y-4 p-1 pb-3 md:grid">
            {SERVICE_CATEGORIES.map((category) => (
              <div key={category.id} className="min-w-0">
                <p className={`mb-1 px-1.5 text-xs font-bold tracking-wider uppercase ${accent}`}>{category.title}</p>
                <ServiceLinks services={category.services} inDrawer onNavigate={onNavigate} />
              </div>
            ))}
          </div>
          <ServicesFooter onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
