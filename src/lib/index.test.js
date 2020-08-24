import { sphericalCoordinatesToCartesian } from './index'

it('converts spherical coordinates to cartesian', () => {
  expect(sphericalCoordinatesToCartesian(1, 0, 0)).toEqual([0, 0, 1]);
  expect(sphericalCoordinatesToCartesian(1, Math.PI, 0)[2]).toEqual(-1); // the x coord is very close to but not exactly 0
})
