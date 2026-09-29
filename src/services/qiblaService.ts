export interface QiblaResult {
  qiblaBearingDegrees: number; // 0 to 360 relative to True North
  distanceKm: number;
  latitude: number;
  longitude: number;
  userFacingDegrees?: number; // Device heading from sensor if available
}

export class QiblaService {
  // Exact coordinates of the Holy Kaaba in Makkah
  static readonly KAABA_LAT = 21.422487;
  static readonly KAABA_LNG = 39.826206;

  // Calculates bearing from user lat/lng to Kaaba using Great-Circle Spherical Trigonometry
  static calculateQibla(userLat: number, userLng: number): QiblaResult {
    const phi1 = (userLat * Math.PI) / 180;
    const phi2 = (this.KAABA_LAT * Math.PI) / 180;
    const deltaLambda = ((this.KAABA_LNG - userLng) * Math.PI) / 180;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

    let qiblaRad = Math.atan2(y, x);
    let qiblaDeg = (qiblaRad * 180) / Math.PI;
    qiblaDeg = (qiblaDeg + 360) % 360;

    // Haversine formula for distance
    const R = 6371; // Earth radius in km
    const dLat = ((this.KAABA_LAT - userLat) * Math.PI) / 180;
    const dLon = ((this.KAABA_LNG - userLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);

    return {
      qiblaBearingDegrees: Math.round(qiblaDeg * 10) / 10,
      distanceKm,
      latitude: userLat,
      longitude: userLng
    };
  }

  // Request device orientation sensor permission (required for iOS Safari 13+)
  static async requestOrientationPermission(): Promise<boolean> {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        return response === 'granted';
      } catch (err) {
        console.warn('Orientation permission denied or error', err);
        return false;
      }
    }
    return true; // standard Android / desktop Chrome
  }
}
