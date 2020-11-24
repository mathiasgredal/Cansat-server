import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'
import monkey from '../Resources/monkey.stl'


import DataStore, { SensorData } from '../Stores/DataStore'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'

export interface Props {
    data?: DataStore
}

interface ModelProps {
    roll: number;
    pitch: number;
}

function Model(props: ModelProps) {
    const model = useLoader(STLLoader, monkey)
    return (
        <mesh geometry={model} rotation={[props.roll, props.pitch, 0]} scale={[0.1, 0.1, 0.1]} position={[0, -5, -10]}>
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
    @observable roll = 20
    @observable pitch = 20

    constructor(props: Props) {
        super(props)
        setInterval(() => {
            this.roll += Math.PI / 40
            // this.pitch++;
        }, 100)
    }

    calcRoll = (data?: SensorData): number => {
        if (
            data == undefined ||
            data.accelY == undefined ||
            data.accelZ == undefined
        )
            return Math.PI/4

        return Math.atan2(data.accelY, data.accelZ)
    }

    calcPitch = (data?: SensorData): number => {
        if (
            data == undefined ||
            data.accelY == undefined ||
            data.accelZ == undefined || 
            data.accelX == undefined
        )
            return 0        
        return (
            Math.atan2(
                -data.accelX,
                Math.sqrt(data.accelY * data.accelY + data.accelZ * data.accelZ)
            
        )
    }

    render() {
        return (
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} intensity={10.8} />
                <Suspense fallback={<Box position={[-1.2, 0, 0]} />}>
                    <Model
                        roll={this.calcRoll(
                            this.props.data!.data.slice(-1)[0]
                        )}
                        pitch={this.calcPitch(

                            this.props.data!.data.slice(-1)[0]
                        )}
                    />
                </Suspense>
            </Canvas>
        )
    }
}

export default CanSat3D
