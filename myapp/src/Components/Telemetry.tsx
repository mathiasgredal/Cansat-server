import React from 'react'

import DataStore, { SensorData } from '../Stores/DataStore'
import { inject, observer } from 'mobx-react'

export interface Props {
    data?: DataStore
}

@inject('data')
@observer
class Telemetry extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return (
            <div style={{  display: "flex",
                flexDirection: "column"}}>
            <h4>Telemetri</h4>
            <h4>Telemetri</h4>

            </div>
        )
    }
}

export default Telemetry
