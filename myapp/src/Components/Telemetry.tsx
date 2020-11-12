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
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    padding: 10,
                }}>
                <h4>Telemetri</h4>
                <br></br>
                <div>
                    <b>Battery:</b> dsadsa
                </div>
                <div>
                    <b>Battery:</b> dsadsa
                </div>
            </div>
        )
    }
}

export default Telemetry
