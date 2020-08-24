function sphericalCoordinatesToCartesian (radius, inclination, azimuth) {
  /*
   * Inclination is in the range [0, pi], from straight up (the zenith)
   * Azimuth is in the range [0, 2pi], from the x axis
   * See: https://en.wikipedia.org/wiki/Spherical_coordinate_system#Cartesian_coordinates
   */
  const x = radius * Math.sin(inclination) * Math.cos(azimuth);
  const y = radius * Math.sin(inclination) * Math.sin(azimuth);
  const z = radius * Math.cos(inclination);
  return [x, y, z];
}

export {
  sphericalCoordinatesToCartesian
}
