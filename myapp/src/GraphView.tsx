import * as React from "react";
import { Component } from "react";
import { Nav } from "react-bootstrap";

export interface GraphProps {
    
}
 
export interface GraphState {
    
}
 
export class Graph extends React.Component<GraphProps, GraphState> {
    constructor(props: GraphProps) {
        super(props);
        this.state = { test: 1 };
    }
    render() { 
        return ( <div>test</div> );
    }
}
 


export class GraphPanel extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { test: 1 };
    React.Children.forEach(this.props.children, (child: React.ReactNode) => {
        // Simple typecasting
        let elem = child as React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;

        console.log(elem.props);
    })
  }
  render() {
    return (
      <>
        <Nav variant="pills" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link href="/home">Active</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Option 2</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Disabled
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div
          style={{
            display: "flex",
            flex: 1,
            height: "100%",
            width: "100%",
            backgroundColor: "green",
          }}
        >
          dasd
        </div>
      </>
    );
  }
}
