import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './App';
import "./Styles/styles.scss";

import { Provider } from 'mobx-react';
import stores from './Stores';

var mountNode = document.getElementById("app");
ReactDOM.render(<Provider {...stores}><App/></Provider>, mountNode);
