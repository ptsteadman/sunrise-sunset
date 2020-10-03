import create from 'zustand'
import { Vector3 } from "three"

export const useStore = create(set => ({
  zoomTarget: null,
  zoomStartTime: null,
  zoomStartPosition: null,
  setZoomTarget: (zoomTarget) => set(state => ({ zoomTarget })),
  setZoomStartTime: (zoomStartTime) => set(state => ({ zoomStartTime })),
  setZoomStartPosition: (zoomStartPosition) => set(state => ({ zoomStartPosition })),
  zoomToMesh: (e) => {
    e.stopPropagation();
    const worldPos = new Vector3()
    const headlightPos = e.object.getWorldPosition(worldPos)
    return set(state => ({
      zoomTarget: headlightPos.multiplyScalar(1.1)
    }))
  },
  handleHoverMesh: (e) => {
    document.getElementById('cursor-style').innerHTML = 'body { cursor: pointer }'
  },
  handleUnhoverMesh: (e) => {
    document.getElementById('cursor-style').innerHTML = ''
  },

}))
