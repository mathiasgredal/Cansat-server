
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

let mapStyle = {
    "version": 8,
    "name": "OSM",
    "metadata": {
  
    },
    "sources": {
      "openmaptiles": {
        "type": "vector",
        "url": "https://free.tilehosting.com/data/v3.json?key={key}"
      },
      "osm": {
        "type": "raster",
        "tiles": [
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        "minzoom": 0,
        "maxzoom": 14
      },
      "91y5159eg": {
        "type": "vector",
        "url": "https://localhost:3000/tilejson.json"
      }
    },
    "sprite": "https://openmaptiles.github.io/klokantech-basic-gl-style/sprite",
    "glyphs": "https://free.tilehosting.com/fonts/{fontstack}/{range}.pbf?key=undefined",
    "layers": [
      {
        "id": "osm",
        "type": "raster",
        "source": "osm"
      }
    ],
    "id": "klokantech-basic"
  }
  

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
        mapStyle={mapStyle}
      >
          <SVGOverlay redraw={redraw} />


      </ReactMapGL>
            </div>
        )
    }
}

export default Kort
