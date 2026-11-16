import React, { useState } from 'react';
import { Battery, Cpu, Plus, Radio } from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { IotDevice } from '../../../data/aetherCatalog';
import { deriveDeviceState, formatLastSeen } from '../../../utils/aetherEngine';
import { AetherStatusBadge } from '../AetherStatusBadge';

export const IotDevicesModule: React.FC = () => {
  const { dataset, registerIotDevice, activeRole } = useAetherStore();

  const [deviceType, setDeviceType] = useState<IotDevice['type']>('Temperature Probe');
  const [vehicleId, setVehicleId] = useState<string>('VEH-01');
  const [notice, setNotice] = useState<string | null>(null);

  const onlineCount = dataset.devices.filter((d) => deriveDeviceState(d.lastSeenSecAgo) === 'online').length;
  const staleCount = dataset.devices.filter((d) => deriveDeviceState(d.lastSeenSecAgo) === 'stale').length;
  const offlineCount = dataset.devices.filter((d) => deriveDeviceState(d.lastSeenSecAgo) === 'offline').length;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'ops_viewer') {
      setNotice('Read-Only Viewer role cannot provision IoT sensors.');
      return;
    }
    const res = registerIotDevice({ type: deviceType, vehicleId });
    if (res.ok && res.data) {
      setNotice(
        `Registered & paired ${res.data.id} (${res.data.type}) to ${
          vehicleId || 'Spare Pool'
        }.`
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Online (&le; 120s)
          </span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 af-tabular">{onlineCount}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Stale (121s – 600s)
          </span>
          <p className="text-2xl font-bold text-amber-700 mt-1 af-tabular">{staleCount}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Offline (&gt; 600s)
          </span>
          <p className="text-2xl font-bold text-rose-700 mt-1 af-tabular">{offlineCount}</p>
        </div>
      </div>

      {/* Register & Assign Sample Device */}
      <form
        onSubmit={handleRegister}
        className="bg-white border border-slate-200 p-4 flex flex-wrap items-end gap-3 text-xs"
      >
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Sensor Type</label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value as IotDevice['type'])}
            className="px-3 py-2 border border-slate-300 bg-slate-50 cursor-pointer"
          >
            <option value="Temperature Probe">Temperature Probe</option>
            <option value="GPS Tracker">GPS Tracker</option>
            <option value="Door Sensor">Door Sensor</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Assign Vehicle</label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="px-3 py-2 border border-slate-300 bg-slate-50 cursor-pointer"
          >
            {dataset.vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} ({v.driverName})
              </option>
            ))}
            <option value="">Unassigned Spare Pool</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-[#0C131F] text-white font-bold hover:bg-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>Register & Assign Sample Device</span>
        </button>

        {notice && (
          <div className="w-full p-2.5 bg-cyan-50 border border-cyan-200 text-cyan-950 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </form>

      {/* Devices Table */}
      <div className="bg-white border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Device ID</th>
              <th className="py-3 px-4">Sensor Class</th>
              <th className="py-3 px-4">Assigned Vehicle</th>
              <th className="py-3 px-4">Battery</th>
              <th className="py-3 px-4">Last Packet</th>
              <th className="py-3 px-4">Derived Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dataset.devices.map((dev) => {
              const veh = dataset.vehicles.find((v) => v.id === dev.vehicleId);
              const derived = deriveDeviceState(dev.lastSeenSecAgo);
              return (
                <tr key={dev.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-[#0C131F]">
                    {dev.id}
                    <div className="text-[10px] font-normal text-slate-500">{dev.firmware}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                      <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{dev.type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                    {veh ? `${veh.plate} (${veh.id})` : 'Spare Pool'}
                  </td>
                  <td className="py-3 px-4 af-tabular">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        dev.batteryPct < 20
                          ? 'text-rose-700'
                          : dev.batteryPct < 45
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      <Battery className="w-3.5 h-3.5" />
                      <span>{dev.batteryPct}%</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 af-tabular">
                    {formatLastSeen(dev.lastSeenSecAgo)}
                  </td>
                  <td className="py-3 px-4">
                    <AetherStatusBadge status={derived} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
