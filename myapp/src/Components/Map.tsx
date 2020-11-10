import React from 'react'
import Map from 'pigeon-maps'
import Overlay from 'pigeon-overlay'

import DataStore, { SensorData } from '../Stores/DataStore'
import { inject, observer } from 'mobx-react'

export interface Props {
    data?: DataStore
}

function mapTilerProvider(x: number, y: number, z: number, dpr?: number) {
    return `https://tile.osmand.net/hd/${z}/${x}/${y}.png`
}

function RedDot() {
    return (
        <div
            style={{
                width: 10,
                height: 10,
                backgroundColor: 'red',
                borderRadius: 5,
            }}></div>
    )
}

@inject('data')
@observer
class Kort extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    getLocation(data?: SensorData): [number, number] {
      if(data?.latitude === undefined || data.longitude === undefined)
        return [0, 0];
      
        return [Number(data.latitude), Number(data.longitude)];
    }

    render() {
        return (
            <Map
                center={this.getLocation(this.props.data!.data.slice(-1)[0])}
                zoom={12}
                provider={mapTilerProvider}>
                <Overlay anchor={this.getLocation(this.props.data!.data.slice(-1)[0])}>
                    <RedDot />
                </Overlay>
            </Map>
        )
    }
}

export default Kort
