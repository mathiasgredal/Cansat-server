import React from 'react'

import 'react-tabulator/css/tabulator_simple.css'
import { React15Tabulator, ReactTabulator } from 'react-tabulator'
import DataStore, { SensorData } from '../Stores/DataStore'
import { inject, observer } from 'mobx-react'
import { observe, reaction } from 'mobx'

export interface Props {
    title: string;
    data?: DataStore;
}

export interface State {}

@inject('data')
@observer
class Table extends React.Component<Props, State> {
    tableRef: React.RefObject<ReactTabulator> = React.createRef()

    columns = [
        { title: 'Tid', field: 'time', formatter:"money"},
        { title: 'Temperatur', field: 'temperature', formatter:"money", formatterParams:{symbol:"°C", symbolAfter: true}},
        { title: 'Tryk', field: 'pressure'},
        { title: 'Højde', field: 'height'}
    ]

    constructor(props: Props) {
        super(props)
        observe(this.props.data!.data, (change) => {
            this.tableRef.current?.table.setData(this.props.data!.data)
          });

    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    backgroundColor: 'white',
                }}>
                <ReactTabulator
                    ref={this.tableRef}
                    columns={this.columns}
                    data={this.props.data!.data}
                    options={{}}
                    data-custom-attr="test-custom-attribute"
                    className="DataTable"
                />
            </div>
        )
    }
}

export default Table
