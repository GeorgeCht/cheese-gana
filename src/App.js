import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { easing } from 'maath'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

import {
  useGLTF,
  Center,
  Caustics,
  Environment,
  Lightformer,
  RandomizedLight,
  PerformanceMonitor,
  AccumulativeShadows,
  MeshTransmissionMaterial,
  Float
} from '@react-three/drei'

function Ganatsio(props) {
  const group = useRef()
  useFrame((state, delta) => {
    // Animate the environment as well as the camera
    if (!props.perfSucks) {
      easing.damp3(group.current.rotation, [0, state.clock.elapsedTime / 9 + state.pointer.x, 0], .5, delta)
    }
  })
  const { nodes, materials } = useGLTF('/Gana/ganatsioz-transformed.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="WEB">
        <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials.Material} />
      </group>
    </group>
  )
}

useGLTF.preload('/Gana/ganatsioz-transformed.glb')

const innerMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 1,
  color: 'black',
  roughness: 0,
  side: THREE.FrontSide,
  blending: THREE.AdditiveBlending,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  envMapIntensity: 2
})

export default function App() {
  const [perfSucks, degrade] = useState(false)
  return (
    <Canvas
      shadows
      dpr={[1, perfSucks ? 1.5 : 2]}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
      camera={{ position: [25, 0.9, 20], fov: 20 }}>
      {/** PerfMon will detect performance issues */}
      <PerformanceMonitor onDecline={() => degrade(true)} />

      
      <color attach="background" args={['#f0f0f0']} />
      {/* <Float> */}
        <Ganatsio perfSucks={perfSucks} rotation={[0, -2, 0]} scale={3.006} />
      {/* </Float> */}
      
      <Env perfSucks={perfSucks} />

      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={.12} bokehScale={10} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={600} />
        <Noise opacity={0.15} />
      </EffectComposer>

    </Canvas>
  )
}

/*
Kit-bash auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.3 scene.glb --transform
Licenses: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Authors:
  matousekfoto (https://sketchfab.com/matousekfoto) (Fruit Cake Slice)
    https://sketchfab.com/3d-models/fruit-cake-slice-7b9a33386eab4dd986aa0980054ead3c
  Felix Yadomi (https://sketchfab.com/felixyadomi) (Cute milkshake)
    https://sketchfab.com/3d-models/cute-milkshake-3ba52a41b4b248df953684861d9e7a20
  Second Studio (https://sketchfab.com/kayaaku) (Dry flower)
    https://sketchfab.com/3d-models/dry-flower-ff0005d6eb4d4077bd08b8992299c45c
  CDcruz (https://sketchfab.com/cdcruz) (Ikea - Pokal Glass Cups)
    https://sketchfab.com/3d-models/ikea-pokal-glass-cups-21837e54a14346aa900e1ae719779b86
*/

function Env({ perfSucks }) {
  const ref = useRef()
  useFrame((state, delta) => {
    // Animate the environment as well as the camera
    if (!perfSucks) {
      easing.damp3(ref.current.rotation, [Math.PI / 2, 0, state.clock.elapsedTime / 9 + state.pointer.x], 0.5, delta)
      //set intensity based on pointer position
      easing.damp3(ref.current.position, [0, 0, state.pointer.x / 2], 0.005, delta)
      easing.damp3(state.camera.position, [Math.sin(state.pointer.x / 4) * 9, 1.25 + state.pointer.y, Math.cos(state.pointer.x / 4) * 9], 0.5, delta)
      state.camera.lookAt(0, 0, 0)
    }
  })
  // Runtime environments can be too slow on some systems, better safe than sorry with PerfMon
  return (
    <Environment frames={perfSucks ? 1 : Infinity} preset="city" resolution={256} background blur={0.8}>
      <Lightformer intensity={10} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <group rotation={[Math.PI / 2, 1, 0]}>
        {[2, -2, 2, -4, 2, -5, 2, -9].map((x, i) => (
          <Lightformer key={i} intensity={1} rotation={[Math.PI / 4, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
        ))}
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
        <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
      </group>
      <group ref={ref}>
        <Lightformer intensity={1} form="ring" color="white" rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 10, 1]} />
      </group>
    </Environment>
  )
}
