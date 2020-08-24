import { sphericalCoordsToCartesian, latlngToSphericalCoords } from './index'

it('converts spherical coordinates to cartesian', () => {
  expect(sphericalCoordsToCartesian(1, 0, 0)).toEqual([-0, 1, 0]);
  expect(sphericalCoordsToCartesian(1, Math.PI, 0)[1]).toEqual(-1); // the x coord is very close to but not exactly 0
})

it('converts latitude and longitude to spherical coordinates', () => {
  expect(latlngToSphericalCoords(90, 0)).toEqual([0, 0]);
  expect(latlngToSphericalCoords(0, 180)).toEqual([Math.PI / 2, Math.PI]);
  expect(latlngToSphericalCoords(0, -90)).toEqual([Math.PI / 2, 3 * Math.PI / 2]);
  expect(latlngToSphericalCoords(-90, -60)).toEqual([Math.PI, 5 * Math.PI / 3]);
})
