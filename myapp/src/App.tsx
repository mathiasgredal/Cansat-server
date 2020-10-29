import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Nav, Navbar } from "react-bootstrap";
import { GraphPanel } from "./GraphView";
import { Graph } from "./Graph";
import { Line } from "react-chartjs-2";
import { BrowserRouter } from 'react-router-dom'

interface Sensor {
    time: number;
    temperature: number;
    pressure: number;
    accelX: number;
    accelY: number;
    accelZ: number;
}

interface Props {
  name: string;
}

interface State {
  sensorData: Sensor[];
}

class App extends React.Component<Props, State> {
  tempGraph: React.RefObject<Line> = React.createRef();
  trykGraph: React.RefObject<Line> = React.createRef();
  accelGraph: React.RefObject<Line> = React.createRef();

  startTime = Date.now()/1000;

  constructor(props: Props) {
    super(props);

    setInterval(()=>{
        let sensorData: Sensor = {
          time: Date.now()/1000-this.startTime,
          temperature: Math.random()*10,
          pressure: Math.random()*10,
          accelX: Math.random()*10,
          accelY: Math.random()*10,
          accelZ: Math.random()*10
        }

        this.updateGraphs(sensorData);
    }, 500)
  }

  updateGraphs(data: Sensor) {
    // Push new data to graphs
    var X_Time = Date.now()/1000-this.startTime;
    console.log(X_Time)
    console.log(data.time)

    // If we have too many elements, we should remove the last ones
    this.tempGraph.current?.chartInstance.data.datasets[0].data.push({x: data.time, y: data.temperature});
    this.trykGraph.current?.chartInstance.data.datasets[0].data.push({x: data.time, y: data.pressure});

    this.accelGraph.current?.chartInstance.data.datasets[0].data.push({x: X_Time, y: data.accelX});
    this.accelGraph.current?.chartInstance.data.datasets[1].data.push({x: X_Time, y: data.accelY});
    this.accelGraph.current?.chartInstance.data.datasets[2].data.push({x: X_Time, y: data.accelZ});

    if(X_Time > 50) {
      this.tempGraph.current?.chartInstance.data.datasets[0].data.shift();
      this.trykGraph.current?.chartInstance.data.datasets[0].data.shift();

      this.accelGraph.current?.chartInstance.data.datasets[0].data.shift();
      this.accelGraph.current?.chartInstance.data.datasets[1].data.shift();
      this.accelGraph.current?.chartInstance.data.datasets[2].data.shift();
    }

    // Redraw the graphs
    this.tempGraph.current?.chartInstance.update();
    this.trykGraph.current?.chartInstance.update();
    this.accelGraph.current?.chartInstance.update();
  }

  render() {
    const { name } = this.props;
    return (
      <BrowserRouter>
        {/* Top Navigation Bar */}
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">CanSat</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Ny session</Nav.Link>
            <Nav.Link href="#features">Gamle sessioner</Nav.Link>
          </Nav>
        </Navbar>

        {/* Main UI Content */}
        <div className="Container">
          <div className="Col item1">
            <GraphPanel>
              <Graph
                graphRef={this.tempGraph}
                title="Temp."
                graphTitle="Temperatur over tid"
                xAxis="Tid (sek)"
                yAxis="Temperatur (C)"
                graphs={["Temperatur"]}
              />
              <Graph
                graphRef={this.trykGraph}
                title="Tryk"
                graphTitle="Tryk over tid"
                xAxis="Tid (sek)"
                yAxis="Tryk (Pa)"
                graphs={["Tryk"]}
              />
              <Graph
                graphRef={this.accelGraph}
                title="Accel."
                graphTitle="Acceleration over tid"
                xAxis="Tid (sek)"
                yAxis="Acceleration (m/s^2)"
                graphs={["Accel X", "Accel Y", "Accel Z"]}
              />
              <div title="hello1">yee32t</div>
            </GraphPanel>
          </div>
          <div className="Col item2"></div>
          <div className="Col item3"></div>
          <div className="Col item4"></div>
          <div className="Col item5"></div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
