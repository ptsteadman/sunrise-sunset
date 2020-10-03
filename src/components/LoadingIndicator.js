import React from 'react';
import { Html, useProgress } from "drei";

export function LoadingIndicator () {
  const { progress, errors } = useProgress()
  if (errors.length) console.log(errors)
  return (
    <Html center>
      <div className='loading'>
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500">
          <title>TOMORROW WILL BE NOTHING LIKE TODAY WILL BE NOTHING LIKE</title>
          <defs>
            <path d="M50,250c0-110.5,89.5-200,200-200s200,89.5,200,200s-89.5,200-200,200S50,360.5,50,250" id="textcircle">
              <animateTransform
                attributeName="transform"
                begin="0s"
                dur="30s"
                type="rotate"
                from="0 250 250"
                to="360 250 250"
                repeatCount="indefinite" 
              />
              </path>
            </defs>
            <text className="progress" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
              {
                errors && errors.length 
                  ?  errors[0]
                  : `Loading ${Math.round(progress)}%`
              }
            </text>    
            <text dy="70" textLength="1220">
              <textPath className="circle-text" xlinkHref="#textcircle">TOMORROW WILL BE NOTHING LIKE TODAY WILL BE NOTHING LIKE</textPath>
            </text>
          </svg>
        </div>
      </Html>
  )

}
