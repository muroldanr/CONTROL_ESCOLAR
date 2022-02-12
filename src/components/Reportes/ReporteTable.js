import React from 'react';
//import ReactTable from "react-table";
//import "react-table/react-table.css";
import { useTable, useFilters, useGlobalFilter, useResizeColumns, usePagination } from 'react-table'
import matchSorter from 'match-sorter';

class ReporteTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			columns: props.columns,
			data: props.data,
			emptyTitulo: (props.data.length === 0),
			titulo: "Lista Alumnos",
		}
	}

	componentWillReceiveProps(props) {

		const { columns, data, titulo } = props;
		this.setState({
			columns: columns,
			data: data,
			titulo: titulo,
		});

		if (props.data.length === 0) {
			this.setState({ emptyTitulo: true });
		} else {
			this.setState({ emptyTitulo: false });
		}
	}



	render() {
		return (
			<React.Fragment>
				<div className="table-responsive">
					<Table columns={this.state.columns} data={this.state.data} titulo={this.state.titulo}></Table>
				</div>
			</React.Fragment>
		);
	}


}


function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

function Table({ columns, data, titulo }) {

	const filterTypes = React.useMemo(
		() => ({
			fuzzyText: fuzzyTextFilterFn,
			text: (rows, id, filterValue) => {
				return rows.filter(row => {
					const rowValue = row.values[id]
					return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true
				})
			},
		}),
		[]
	)

	const defaultColumn = React.useMemo(
		() => ({
			// Let's set up our default Filter UI
			Filter: DefaultColumnFilter,
			minWidth: 30,
			width: 100,
			maxWidth: 400,
		}),
		[]
	)


	// Use the state and functions returned from useTable to build your UI
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
	} = useTable(
		{
			columns,
			data,
			defaultColumn, // Be sure to pass the defaultColumn option
			filterTypes,
			initialState: {  pageSize:50 }
		},
		useFilters, // useFilters!
		useGlobalFilter, // useGlobalFilter!
		useResizeColumns,
		usePagination,
	
	)

	// Render the UI for your table
	return (	
		<>			
			<table {...getTableProps()} className="table table-hover table-striped  mb-0">
				<thead>
					{/*<tr>
						<th
							colSpan={visibleColumns.length}
							style={{ textAlign: 'left', }}>
							<GlobalFilter
								preGlobalFilteredRows={preGlobalFilteredRows}
								globalFilter={state.globalFilter}
								setGlobalFilter={setGlobalFilter}
								titulo={titulo} />
						</th>
					</tr>*/}
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()} >
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()} >
									{column.render('Header')}
									{/* Render the columns filter UI */}
									<div
										{...column.getResizerProps()}
										className={`resizer ${column.isResizing ? 'isResizing' : ''
											}`}
									/>
									<div>{column.canFilter ? column.render('Filter') : null}</div>
								</th>

							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</>	

	)
}



function DefaultColumnFilter({
	column: { filterValue, preFilteredRows, setFilter },
}) {
	const count = preFilteredRows.length

	return (
		<input
			value={filterValue || ''}
			onChange={e => {
				setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
			}}
			placeholder={`Buscar en ${count} registros...`}
			className="form-control form-control-sm"
		/>
	)
}

export default ReporteTable;