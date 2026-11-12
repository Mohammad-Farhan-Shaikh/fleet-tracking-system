// src/composables/useFormatters.js - Centralized Fleet Data Formatters

export function useFormatters() {
  // Format driver name (e.g. "Marcus Vance" -> full "Marcus Vance" or short "Marcus")
  const formatDriver = (driver, format = 'full') => {
    if (!driver || driver === 'Unassigned') {
      return {
        name: 'Unassigned',
        shortName: 'Unassigned',
        initials: 'UN',
        isAssigned: false,
      }
    }

    const parts = driver.trim().split(/\s+/)
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0]

    return {
      name: driver,
      shortName: parts[0],
      initials: initials.toUpperCase(),
      isAssigned: true,
    }
  }

  // Format telematics energy metric (Fuel vs EV Battery vs Alert)
  const formatEnergyMetric = (vehicle) => {
    if (!vehicle) return { text: '--', icon: 'help', isAlert: false, colorClass: 'text-outline' }

    if (vehicle.hasAlert && vehicle.alertText) {
      return {
        text: vehicle.alertText,
        icon: 'warning',
        isAlert: true,
        colorClass: 'text-error font-semibold',
      }
    }

    if (vehicle.battery !== null && vehicle.battery !== undefined) {
      return {
        text: `${vehicle.battery}% Batt (SoC)`,
        icon: 'battery_charging_full',
        isAlert: false,
        colorClass: 'text-tertiary font-semibold',
      }
    }

    if (vehicle.fuel !== null && vehicle.fuel !== undefined) {
      const isLow = vehicle.fuel < 20
      return {
        text: `Fuel: ${vehicle.fuel}%`,
        icon: 'local_gas_station',
        isAlert: isLow,
        colorClass: isLow ? 'text-error font-semibold' : 'text-on-surface-variant font-medium',
      }
    }

    return {
      text: '--',
      icon: 'signal_disconnected',
      isAlert: false,
      colorClass: 'text-outline',
    }
  }

  return {
    formatDriver,
    formatEnergyMetric,
    // Aliases & helpers for gauges and cards
    getDriverInitials: (driver) => formatDriver(driver).initials,
    getEnergyMetrics: (vehicle) => {
      if (!vehicle) return { title: 'Energy', value: 0, unit: '%', isBattery: false, color: '#3b82f6', icon: 'local_gas_station' }
      if (vehicle.battery !== null && vehicle.battery !== undefined) {
        return {
          title: 'Battery SoC',
          value: vehicle.battery,
          unit: '%',
          isBattery: true,
          color: '#10b981',
          icon: 'battery_charging_full',
        }
      }
      const fuel = vehicle.fuel !== null && vehicle.fuel !== undefined ? vehicle.fuel : 0
      return {
        title: 'Fuel Level',
        value: fuel,
        unit: '%',
        isBattery: false,
        color: fuel < 20 ? '#f43f5e' : '#3b82f6',
        icon: 'local_gas_station',
      }
    },
  }
}

