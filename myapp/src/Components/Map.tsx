
import React from 'react'
import ReactMapGL from 'react-map-gl';
import {SVGOverlay} from 'react-map-gl';


import 'react-tabulator/css/tabulator_simple.css'
import { React15Tabulator, ReactTabulator } from 'react-tabulator'
import DataStore, { SensorData } from '../Stores/DataStore'
import { inject, observer } from 'mobx-react'
import { observe, reaction } from 'mobx'

export interface Props {
    title: string;
    data?: DataStore;
}

export interface State { }

function redraw({project}) {
    const [cx, cy] = project([11.332610,55.400980]);
    return <circle cx={cx} cy={cy} r={4} fill="blue" />;
  }
  

@inject('data')
@observer
class Kort extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props)

    }
    state = {
        viewport: {
            width: 400,
            height: 325,
          latitude: 55.400980,
          longitude: 11.332610,
          zoom: 10
        }
      };
    render() {
        return (
            <div >
                <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
        mapStyle="https://s3.amazonaws.com/cdn.brianbancroft.io/assets/osmstyle.json"
      >
          <SVGOverlay redraw={redraw} />


      </ReactMapGL>
            </div>
        )
    }
}

export default Kort
