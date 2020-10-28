import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Nav, Navbar } from "react-bootstrap";
import {GraphPanel, Graph} from "./GraphView";

interface Props {
  name: string;
}

class App extends React.Component<Props> {
  render() {
    const { name } = this.props;
    return (
      <>
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
              <div name="hello" >yeet</div>

            </GraphPanel>
          </div>
          <div className="Col item2"></div>
          <div className="Col item3"></div>
          <div className="Col item4"></div>
          <div className="Col item5"></div>
        </div>
      </>
    );
  }
}

export default App;
