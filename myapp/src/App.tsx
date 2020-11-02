import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Nav, Navbar } from "react-bootstrap";
import { GraphPanel } from "./GraphView";
import { Graph } from "./Graph";
import { Line, defaults } from "react-chartjs-2";
import { Modal } from "./Modal";
import OldSessionList, {Session} from "./OldSessionList";

enum ViewState {
  Recording,
  Viewing,
}

interface Sensor {
  time: number;
  temperature: number;
  pressure: number;
  height: number;
  accelX: number;
  accelY: number;
  accelZ: number;
}

interface Props {
  name: string;
}

interface State {
  sensorData: Sensor[];
  viewState: ViewState;
  interactable: boolean;
  oldSessionModal: boolean;
  newSessionModal: boolean;
}

class App extends React.Component<Props, State> {
  tempGraph: React.RefObject<Line> = React.createRef();
  trykGraph: React.RefObject<Line> = React.createRef();
  højdeGraph: React.RefObject<Line> = React.createRef();
  accelGraph: React.RefObject<Line> = React.createRef();

  startTime = Date.now() / 1000;
  data: Sensor[] = [];

  currentSession = -1;

  constructor(props: Props) {
    super(props);
    this.state = {
      sensorData: [],
      interactable: false,
      viewState: ViewState.Recording,
      oldSessionModal: false,
      newSessionModal: false,
    };

    // Poll server every 1/2 second for new data
    setInterval(() => {
      if(this.state.viewState != ViewState.Recording)
        return;

      let sensorData: Sensor = {
        time: Date.now() / 1000 - this.startTime,
        temperature: Math.random() * 10,
        pressure: Math.random() * 10,
        height: Math.random() * 10,
        accelX: Math.random() * 10,
        accelY: Math.random() * 10,
        accelZ: Math.random() * 10,
      };

      this.data.push(sensorData);
      this.updateGraphs(sensorData);
    }, 500);
  }

  // Adds the passed data to all the graphs
  updateGraphs(data: Sensor) {
    // Push new data to graphs
    this.tempGraph.current?.chartInstance.data.datasets[0].data.push({
      x: data.time,
      y: data.temperature,
    });
    this.trykGraph.current?.chartInstance.data.datasets[0].data.push({
      x: data.time,
      y: data.pressure,
    });
    this.højdeGraph.current?.chartInstance.data.datasets[0].data.push({
      x: data.time,
      y: data.height,
    });
    this.accelGraph.current?.chartInstance.data.datasets[0].data.push({
      x: data.time,
      y: data.accelX,
    });
    this.accelGraph.current?.chartInstance.data.datasets[1].data.push({
      x: data.time,
      y: data.accelY,
    });
    this.accelGraph.current?.chartInstance.data.datasets[2].data.push({
      x: data.time,
      y: data.accelZ,
    });

    // If we have too many elements, we should remove the last ones
    if (this.data.length > 50) {
      this.tempGraph.current?.chartInstance.data.datasets[0].data.shift();
      this.trykGraph.current?.chartInstance.data.datasets[0].data.shift();
      this.højdeGraph.current?.chartInstance.data.datasets[0].data.shift();

      this.accelGraph.current?.chartInstance.data.datasets[0].data.shift();
      this.accelGraph.current?.chartInstance.data.datasets[1].data.shift();
      this.accelGraph.current?.chartInstance.data.datasets[2].data.shift();
    }

    // Redraw the graphs
    this.tempGraph.current?.chartInstance.update();
    this.trykGraph.current?.chartInstance.update();
    this.højdeGraph.current?.chartInstance.update();
    this.accelGraph.current?.chartInstance.update();
  }

  // Set the current session on the server, so that it can assign the incoming data the correct session id
  createNewSession() {}


  viewOldSession = (session: Session) => {
    // We start by dismissing the modal
    this.setState({
      oldSessionModal: false,
      viewState: ViewState.Viewing,
      interactable: true
    })

    // We have to update a bunch of stuff
    console.log("Selected: " + session.id)
    this.currentSession = session.id;
    // @ts-ignore
    this.tempGraph.current?.chartInstance.options.plugins.zoom.pan.enabled = true;
    // @ts-ignore
    this.tempGraph.current?.chartInstance.options.plugins.zoom.zoom.enabled = true;
    // @ts-ignore
    this.trykGraph.current?.chartInstance.options.plugins.zoom.pan.enabled = true;
    // @ts-ignore
    this.trykGraph.current?.chartInstance.options.plugins.zoom.zoom.enabled = true;
    // @ts-ignore
    this.højdeGraph.current?.chartInstance.options.plugins.zoom.pan.enabled = true;
    // @ts-ignore
    this.højdeGraph.current?.chartInstance.options.plugins.zoom.zoom.enabled = true;
    // @ts-ignore
    this.accelGraph.current?.chartInstance.options.plugins.zoom.pan.enabled = true;
    // @ts-ignore
    this.accelGraph.current?.chartInstance.options.plugins.zoom.zoom.enabled = true;

    
    this.tempGraph.current?.chartInstance.update();
    this.trykGraph.current?.chartInstance.update();
    this.højdeGraph.current?.chartInstance.update();
    this.accelGraph.current?.chartInstance.update();
  }

  render() {
    return (
      <>
        {/* Top Navigation Bar */}
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">CanSat</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link onClick={() => this.setState({ newSessionModal: true })}>
              Ny session
            </Nav.Link>
            <Nav.Link onClick={() => this.setState({ oldSessionModal: true })}>
              Gamle sessioner
            </Nav.Link>
          </Nav>
        </Navbar>

        {/* The various modals */}
        <Modal
          title="Bekræft ny session!"
          show={this.state.newSessionModal}
          buttons={[
            {
              name: "Annuller",
              onClick: () => this.setState({ newSessionModal: false }),
            },
            { name: "Bekræft", onClick: this.createNewSession },
          ]}
          onShow={(show) => this.setState({ newSessionModal: show })}
        >
          Klik bekræft hvis du vil starte en ny session. (Det er ikke muligt at
          genstarte en tidligere session)
        </Modal>

        <Modal
          title="Vælg gammel session"
          show={this.state.oldSessionModal}
          buttons={[
            {
              name: "Fortsæt",
              onClick: () => this.setState({ oldSessionModal: false }),
            }
          ]}
          onShow={(show) => this.setState({ oldSessionModal: show })}
        >
          <OldSessionList onSelectSession={this.viewOldSession}></OldSessionList>
        </Modal>

        {/* Main UI Content */}
        <div className="Container">
          <div className="Col item1"></div>
          <div className="Col item2"></div>
          <div className="Col item3">
            <GraphPanel>
              <Graph
                graphRef={this.tempGraph}
                title="Temp."
                graphTitle="Temperatur over tid"
                xAxis="Tid (sek)"
                yAxis="Temperatur (°C)"
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
                graphRef={this.højdeGraph}
                title="Højde"
                graphTitle="Højde over tid"
                xAxis="Tid (sek)"
                yAxis="Højde (m)"
                graphs={["Højde"]}
              />
              <Graph
                graphRef={this.accelGraph}
                title="Accel."
                graphTitle="Acceleration over tid"
                xAxis="Tid (sek)"
                yAxis="Acceleration (m/s²)"
                graphs={["Accel X", "Accel Y", "Accel Z"]}
              />
              <div title="Data">Tabel med alt data</div>
            </GraphPanel>
          </div>
          <div className="Col item4"></div>
          <div className="Col item5"></div>
        </div>
      </>
    );
  }
}

export default App;
