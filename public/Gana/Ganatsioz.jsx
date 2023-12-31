/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 ganatsioz.glb --transform 
Files: ganatsioz.glb [69.25MB] > ganatsioz-transformed.glb [9.92MB] (86%)
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Ganatsio(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/ganatsioz-transformed.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="WEB">
        <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials.Material} />
      </group>
    </group>
  )
}

useGLTF.preload('/ganatsioz-transformed.glb')
