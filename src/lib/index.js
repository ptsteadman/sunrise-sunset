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

