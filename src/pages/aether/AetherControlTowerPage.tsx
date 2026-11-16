import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  ExternalLink,
  MapPin,
  Package,
  RotateCcw,
  Search,
  ShieldAlert,
  Smartphone,
  ThermometerSnowflake,
  Truck,
  X,
} from 'lucide-react';
import { AetherBrandLogo, useAetherFavicon } from '../../components/aether/AetherBrandLogo';
import { AetherConfirmResetModal } from '../../components/aether/AetherConfirmResetModal';
import { OperationsOverviewModule } from '../../components/aether/modules/OperationsOverviewModule';
import { FleetMapModule } from '../../components/aether/modules/FleetMapModule';
import { ShipmentsModule } from '../../components/aether/modules/ShipmentsModule';
import { DispatchBoardModule } from '../../components/aether/modules/DispatchBoardModule';
import { IotDevicesModule } from '../../components/aether/modules/IotDevicesModule';
import { ColdChainMonitorModule } from '../../components/aether/modules/ColdChainMonitorModule';
import { IncidentCenterModule } from '../../components/aether/modules/IncidentCenterModule';
import { ReportingModule } from '../../components/aether/modules/ReportingModule';
import { useAetherStore } from '../../context/AetherStoreContext';
import { AetherRole, DepotId } from '../../data/aetherCatalog';

const MODULES = [
  { id: 'overview', label: 'Operations Overview', Icon: Activity },
  { id: 'map', label: 'Fleet Map', Icon: MapPin },
  { id: 'shipments', label: 'Shipments', Icon: Package },
  { id: 'dispatch', label: 'Dispatch Board', Icon: Truck },
  { id: 'devices', label: 'IoT Devices', Icon: Cpu },
  { id: 'cold-chain', label: 'Cold-Chain Monitor', Icon: ThermometerSnowflake },
  { id: 'incidents', label: 'Incident Center', Icon: ShieldAlert },
  { id: 'reporting', label: 'Reporting', Icon: BarChart3 },
] as const;

export const AetherControlTowerPage: React.FC = () => {
  useAetherFavicon(true);
  const { module } = useParams<{ module?: string }>();
  const navigate = useNavigate();

  const {
    dataset,
    activeRole,
    setActiveRole,
    activeDepotFilter,
    setActiveDepotFilter,
    guidedDemoActive,
    setGuidedDemoActive,
    triggerColdChainIncidentReplay,
    setSelectedShipmentId,
    setSelectedVehicleId,
    resetDemoData,
    lastEngineMessage,
  } = useAetherStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const activeModule =
    MODULES.some((m) => m.id === module) ? (module as string) : 'overview';

  const openIncidents = dataset.incidents.filter((i) => i.status !== 'resolved');

  const navigateModule = (modId: string) => {
    navigate(`/showcase/aether-fleet/app/${modId}`);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'map':
        return <FleetMapModule />;
      case 'shipments':
        return <ShipmentsModule globalSearch={searchQuery} />;
      case 'dispatch':
        return <DispatchBoardModule />;
      case 'devices':
        return <IotDevicesModule />;
      case 'cold-chain':
        return <ColdChainMonitorModule />;
      case 'incidents':
        return <IncidentCenterModule />;
      case 'reporting':
        return <ReportingModule />;
      default:
        return (
          <OperationsOverviewModule
            onNavigateModule={navigateModule}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <div className="aether-showcase min-h-screen bg-slate-100 text-[#0C131F] flex flex-col lg:flex-row">
      {/* Collapsible Operations Sidebar */}
      <aside
        className={`bg-[#0C131F] text-white border-r border-[#223047] flex flex-col shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        <div className="h-16 px-4 border-b border-[#223047] flex items-center justify-between gap-2">
          <Link to="/showcase/aether-fleet" aria-label="Aether Fleet Public Page">
            <AetherBrandLogo
              variant={sidebarCollapsed ? 'emblem' : 'full'}
              tone="light"
              size="sm"
            />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:inline-flex p-1.5 text-slate-400 hover:text-cyan-300 cursor-pointer"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-2.5 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible flex-1">
          {MODULES.map(({ id, label, Icon }) => {
            const isCurrent = activeModule === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigateModule(id)}
                className={`flex items-center justify-between gap-2.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-[#131D2E] hover:text-white'
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </span>
                {!sidebarCollapsed && id === 'incidents' && openIncidents.length > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                      isCurrent ? 'bg-slate-950 text-cyan-300' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {openIncidents.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cross-Experience Switchers & Portfolio Exit */}
        <div className="p-3 border-t border-[#223047] space-y-1.5 text-xs hidden lg:block">
          <Link
            to="/showcase/aether-fleet/driver"
            className="flex items-center gap-2 px-3 py-2 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 text-slate-200"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {!sidebarCollapsed && <span>Driver Workspace</span>}
          </Link>
          <Link
            to="/showcase/aether-fleet/track/AFL-2048"
            className="flex items-center gap-2 px-3 py-2 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 text-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {!sidebarCollapsed && <span>Customer Portal</span>}
          </Link>
          <Link
            to="/portfolio"
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-cyan-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {!sidebarCollapsed && <span>Back to Genmax Portfolio</span>}
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Control Tower Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2 py-0.5 bg-[#0C131F] text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
              Interactive Concept Demo
            </span>

            <select
              value={activeDepotFilter}
              onChange={(e) => setActiveDepotFilter(e.target.value as 'ALL' | DepotId)}
              aria-label="Filter facility or corridor depot"
              className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="ALL">All Corridors (Pune · NCR · Bengaluru)</option>
              {dataset.depots.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AFL-2048, customer..."
                className="pl-8 pr-3 py-1.5 border border-slate-300 bg-slate-50 text-xs w-48 focus:outline-none focus:border-cyan-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Connection + Last Updated */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="af-tabular">{dataset.sensorCheckLabel}</span>
            </div>

            {/* Alerts Inbox Quick Button */}
            <button
              type="button"
              onClick={() => navigateModule('incidents')}
              className="px-2.5 py-1.5 border border-slate-300 bg-white hover:border-rose-500 text-slate-800 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-rose-600" />
              <span>Alerts ({openIncidents.length})</span>
            </button>

            {/* Switch Demo Role */}
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as AetherRole)}
              aria-label="Switch Demo Role"
              className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="dispatcher">Role: Dispatcher</option>
              <option value="cold_chain_lead">Role: Cold-Chain Lead</option>
              <option value="fleet_tech">Role: Fleet Technician</option>
              <option value="ops_viewer">Role: Operations Read-Only</option>
            </select>

            <button
              type="button"
              onClick={() => setGuidedDemoActive(!guidedDemoActive)}
              className={`px-2.5 py-1.5 border font-semibold inline-flex items-center gap-1 cursor-pointer ${
                guidedDemoActive
                  ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                  : 'border-slate-300 text-slate-700 hover:border-cyan-600'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Walkthrough</span>
            </button>

            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="px-2.5 py-1.5 border border-slate-300 hover:border-rose-500 text-slate-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </header>

        {/* Read-Only Role Guard Banner */}
        {activeRole === 'ops_viewer' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 text-xs text-amber-950">
            <strong>Operations Read-Only Role Active:</strong> Inspections, map telemetry, and CSV exports are enabled; dispatching, incident resolution, and telemetry injection are locked until you switch back to Dispatcher or Cold-Chain Lead.
          </div>
        )}

        {/* Dismissible 6-Step Guided Demo Bar Centered on AFL-2048 */}
        {guidedDemoActive && (
          <div className="bg-[#0C131F] text-white border-b border-cyan-500/40 px-4 sm:px-6 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                6-Step Flagship Walkthrough · AFL-2048 (Pune → Mumbai Biopharma)
              </span>
              <button
                type="button"
                onClick={() => setGuidedDemoActive(false)}
                className="text-slate-400 hover:text-white inline-flex items-center gap-1 text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setSelectedShipmentId('SHP-2048');
                  setSelectedVehicleId('VEH-01');
                  navigateModule('map');
                }}
                className="px-2.5 py-1.5 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 cursor-pointer"
              >
                1. Focus AFL-2048 on Map
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerColdChainIncidentReplay();
                  navigateModule('cold-chain');
                }}
                className="px-2.5 py-1.5 bg-rose-950/70 border border-rose-500/60 hover:bg-rose-900 cursor-pointer"
              >
                2. Replay Cold-Chain Incident
              </button>
              <button
                type="button"
                onClick={() => navigateModule('incidents')}
                className="px-2.5 py-1.5 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 cursor-pointer"
              >
                3. Acknowledge &amp; Instruct Driver
              </button>
              <Link
                to="/showcase/aether-fleet/driver"
                className="px-2.5 py-1.5 bg-[#131D2E] border border-[#223047] hover:border-cyan-400"
              >
                4. Driver Reply &amp; Recovery →
              </Link>
              <button
                type="button"
                onClick={() => navigateModule('incidents')}
                className="px-2.5 py-1.5 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 cursor-pointer"
              >
                5. Resolve INC-2048
              </button>
              <Link
                to="/showcase/aether-fleet/track/AFL-2048"
                className="px-2.5 py-1.5 bg-cyan-500 text-slate-950 font-bold"
              >
                6. Capture POD &amp; Customer Portal →
              </Link>
            </div>
          </div>
        )}

        {/* Engine Notification Line */}
        {lastEngineMessage && (
          <div className="bg-cyan-50 border-b border-cyan-200 px-4 sm:px-6 py-1.5 text-[11px] text-cyan-950 flex items-center justify-between gap-2">
            <span>
              <strong>Telemetry Engine:</strong> {lastEngineMessage}
            </span>
          </div>
        )}

        {/* Active Module Title & Body */}
        <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-5 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0C131F]">
              {MODULES.find((m) => m.id === activeModule)?.label || 'Operations Overview'}
            </h1>
            <div className="flex items-center gap-3 text-xs lg:hidden">
              <Link to="/showcase/aether-fleet/driver" className="text-cyan-700 font-semibold">
                Driver View
              </Link>
              <Link to="/showcase/aether-fleet/track/AFL-2048" className="text-cyan-700 font-semibold">
                Customer Portal
              </Link>
              <Link to="/portfolio" className="text-slate-600 font-semibold">
                Genmax Portfolio
              </Link>
            </div>
          </div>

          {renderModule()}
        </main>
      </div>

      <AetherConfirmResetModal
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setResetModalOpen(false);
        }}
      />
    </div>
  );
};
