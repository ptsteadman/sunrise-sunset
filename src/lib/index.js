import cities from "./cities.json"
export function sphericalCoordsToCartesian (radius, inclination, azimuth) {
  /*
   * Inclination is in the range [0, pi], from straight up (the zenith)
   * Azimuth is in the range [0, 2pi], from the x axis
   * See: https://en.wikipedia.org/wiki/Spherical_coordinate_system#Cartesian_coordinates
   */
  const x = radius * Math.sin(inclination) * Math.cos(azimuth);
  const z = radius * Math.sin(inclination) * Math.sin(azimuth);
  const y = radius * Math.cos(inclination);
  return [-x, y, z];
}

export function latlngToSphericalCoords (lat, lng) {
  const inclination = Math.PI * (lat > 0 ? 90 - lat : 90 + Math.abs(lat)) / 180;
  const azimuth = 2 * Math.PI * (lng >= 0 ? lng : 360 - Math.abs(lng)) / 360; 
  return [inclination, azimuth];
}

const SECONDS_IN_DAY = 24 * 60 * 60;

export function calculateAngleForTime () {
  const unixEraSeconds = Math.floor(new Date().valueOf() / 1000);
  const secondsElapsedInDay = unixEraSeconds % SECONDS_IN_DAY;
  const dayProgress = secondsElapsedInDay / SECONDS_IN_DAY;
  return dayProgress * 2 * Math.PI + Math.PI;
}

export function isIntervalActive (periodLength, intervalStart, intervalEnd, offset) {
  const t = (new Date().getTime() + offset) % (periodLength)
  return t < intervalEnd && t >= intervalStart;
}

const OFFSETS = Array.from(Array(cities.length)).map(() => Math.random() * 120 * 1000)

export function getLightState (i) {
  const offset = OFFSETS[i]
  const lightLow = isIntervalActive(120 * 1000, 0, 40 * 1000, offset)
  const lightHigh = isIntervalActive(120 * 1000, 40 * 1000, 70 * 1000, offset)
  const lightLaser = isIntervalActive(120 * 1000, 70 * 1000, 120 * 1000, offset)
  const turnLightOn = isIntervalActive(60 * 1000, 0, 20 * 1000, offset) && isIntervalActive(1 * 1500, 0, 750, offset)
  return {
    lightLow,
    lightHigh,
    lightLaser,
    turnLightOn
  }
}
