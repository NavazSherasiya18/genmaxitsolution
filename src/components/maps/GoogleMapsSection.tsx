// Source: Google Maps Platform Code Assist
import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Clock, Phone, Mail, ExternalLink, Copy, Check, Compass, Car, Train, Building2 } from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/websiteContent';

// Headquarters coordinates for Genmax IT Solution, Noida
const NOIDA_HQ_COORDS = { lat: 28.5521, lng: 77.3486 };
const MAPS_ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

interface GoogleMapsSectionProps {
  className?: string;
  compact?: boolean;
}

const MapContent: React.FC<{
  apiKey: string;
  onOpenDirections: () => void;
}> = ({ apiKey, onOpenDirections }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <APIProvider apiKey={apiKey} libraries={['marker']}>
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={NOIDA_HQ_COORDS}
        defaultZoom={15}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        internalUsageAttributionIds={[MAPS_ATTRIBUTION_ID]}
        style={{ width: '100%', height: '100%', minHeight: '440px' }}
      >
        <AdvancedMarker
          ref={markerRef}
          position={NOIDA_HQ_COORDS}
          onClick={() => setInfoOpen(!infoOpen)}
          title="Genmax IT Solution Headquarters - Noida"
        >
          <Pin
            background="#4F46E5"
            borderColor="#312E81"
            glyphColor="#FFFFFF"
            scale={1.25}
          />
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={320}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-2 text-slate-900">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Genmax IT Solution HQ</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Engineering & SEO Studio
              </h4>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                C3M Aneja Market, Sadarpur, Sec-45, Noida, Delhi NCR - 201301
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open Mon–Sat: 9:30 AM
                </span>
                <button
                  onClick={onOpenDirections}
                  className="text-indigo-600 hover:text-indigo-800 font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ className = '', compact = false }) => {
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  });

  // Check backend maps config if not directly injected in vite env
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/maps-config')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.apiKey) {
            setApiKey(data.apiKey);
          }
        })
        .catch(() => {});
    }
  }, [apiKey]);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${NOIDA_HQ_COORDS.lat},${NOIDA_HQ_COORDS.lng}&destination_place_id=Genmax+IT+Solution+Noida`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(COMPANY_DETAILS.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDirections = () => {
    window.open(googleMapsDirectionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl">
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-1.5">
              <Compass className="w-4 h-4" />
              <span>Noida Tech Corridor Headquarters</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Visit Our Engineering & SEO Office
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Conveniently situated in Sector-45 Noida, directly connected to Delhi NCR metro networks and the Expressway.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyAddress}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy office address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Address Copied' : 'Copy Address'}</span>
            </button>

            <button
              onClick={handleOpenDirections}
              className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Live Directions</span>
            </button>
          </div>
        </div>

        {/* Map + Commute Grid */}
        <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-0`}>
          
          {/* Main Map Canvas */}
          <div className={`${compact ? 'w-full' : 'lg:col-span-8'} relative min-h-[440px] bg-slate-100 dark:bg-slate-950`}>
            {apiKey ? (
              <MapContent apiKey={apiKey} onOpenDirections={handleOpenDirections} />
            ) : (
              // High-fidelity fallback interactive Google Map embed centered on exact Noida Sector-45 coordinates
              <div className="relative w-full h-full min-h-[440px]">
                <iframe
                  title="Genmax IT Solution Headquarters Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '440px' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${NOIDA_HQ_COORDS.lat},${NOIDA_HQ_COORDS.lng}&hl=en&z=15&output=embed`}
                />
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Genmax IT Solution • Noida HQ</span>
                </div>
              </div>
            )}
          </div>

          {/* Location & Commute Details Sidebar */}
          {!compact && (
            <div className="lg:col-span-4 p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-900/40 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 mb-2">
                    Office Location
                  </h4>
                  <div className="flex items-start gap-3 text-slate-800 dark:text-slate-200">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-heading text-slate-900 dark:text-white">
                        C3M Aneja Market, Sadarpur
                      </strong>
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed block mt-0.5">
                        Sector-45, Noida, Delhi NCR, India - 201301
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 mb-2.5">
                    Commute & Connectivity
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Train className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span><strong>Noida Botanical / City Centre:</strong> 6–8 mins drive</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span><strong>DND Flyway & Expressway:</strong> 10–12 mins</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                      <span><strong>Connaught Place, Central Delhi:</strong> 25–30 mins</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                    <span><strong>Visiting Hours:</strong> {COMPANY_DETAILS.workingHours}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                    <a href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, '')}`} className="hover:text-indigo-600 dark:hover:text-cyan-400 underline font-medium">
                      {COMPANY_DETAILS.phoneDisplay}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                    <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-indigo-600 dark:hover:text-cyan-400 underline font-medium">
                      {COMPANY_DETAILS.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps App</span>
                </a>

                <a
                  href={COMPANY_DETAILS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs text-center hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Schedule In-Person Consultation</span>
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
