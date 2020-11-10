import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'
import monkey from '../Resources/monkey.stl'


import DataStore, { SensorData } from '../Stores/DataStore'
import { inject, observer } from 'mobx-react'

export interface Props {
    data?: DataStore
}

function Model() {
    const model = useLoader(STLLoader, monkey)
    const mesh = useRef()
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))


    return (
    <mesh ref={mesh} geometry={model} rotation={[-Math.PI / 3, 0, 0]}>
        <meshPhysicalMaterial
            attach="material"
            roughness={0.8}
            metalness={0.6}
            color="#1c1c1c"
        />
        </mesh>
    )
  }
  

function Box(props: any) {
    return (
        <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" transparent opacity={0.5} />
      </mesh>
    )
}

@inject('data')
@observer
class CanSat3D extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return (
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} intensity={10.8}/>
                <Suspense fallback={<Box position={[-1.2, 0, 0]} />}>{<Model />}</Suspense>
            </Canvas>
        )
    }
}

export default CanSat3D
