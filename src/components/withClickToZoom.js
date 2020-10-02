import React, { useCallback } from 'react'

export function withClickToZoom(WrappedComponent) {
  return function WithClickToZoomComponent(props) {

    const handleClick = useCallback((e) => {
      console.log('e:', e);
      e.stopPropagation();

    }, [])


    return (
      <WrappedComponent handleClick={handleClick} { ...props } />
    )
  }
}
