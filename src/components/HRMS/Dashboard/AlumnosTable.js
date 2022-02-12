import React from 'react';
//import ReactTable from "react-table";
//import "react-table/react-table.css";
import { useTable, useFilters, useGlobalFilter, useBlockLayout, useAsyncDebounce, useResizeColumns, usePagination } from 'react-table'
import matchSorter from 'match-sorter'


class AlumnosTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			columns: props.columns,
			data: props.data,
			emptyTitulo: (props.data.length === 0),
			titulo: " "
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
		state,
		visibleColumns,
		preGlobalFilteredRows,
		setGlobalFilter,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			defaultColumn, // Be sure to pass the defaultColumn option
			filterTypes,
		},
		useFilters, // useFilters!
		useGlobalFilter, // useGlobalFilter!
		useResizeColumns,
		useBlockLayout,
		usePagination
	)

	// Render the UI for your table
	return (
		<>
			<table {...getTableProps()} className="table table-hover table-striped table-vcenter text-nowrap mb-0">
				<thead>
					<tr>
						<th
							colSpan={visibleColumns.length}
							style={{ textAlign: 'left', }}>
							<GlobalFilter
								preGlobalFilteredRows={preGlobalFilteredRows}
								globalFilter={state.globalFilter}
								setGlobalFilter={setGlobalFilter}
								titulo={titulo} />
						</th>
					</tr>
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

			<div className="card-body">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className="page-item">
                                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="page-link"  aria-label="Previous">
                                    <span aria-hidden="true">«</span>
                                    <span className="sr-only">Previous</span>
                                </button>
                            </li>
                            <li className="page-item"><button onClick={() => previousPage()} disabled={!canPreviousPage} className="page-link">{'<'}</button></li>
                            <li className="page-item"><button onClick={() => nextPage()} disabled={!canNextPage} className="page-link">{'>'}</button></li>
                            <li className="page-item">
                                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="page-link" aria-label="Next">
                                    <span aria-hidden="true">»</span>
                                    <span className="sr-only">Next</span>
                                </button>
                            </li>
							<li className="page-item p-2"> 
								<span className="page-item pl-2">
									Página{' '}
									<strong>
										{pageIndex + 1} de {pageOptions.length}
									</strong>{' '}
								</span>
								<span className="page-item pl-2">
									Ir a:{' '}

								</span>{' '} 
							</li>
							<li >
							<input
										className="form-control"
										type="number"
										defaultValue={pageIndex + 1}
										onChange={e => {
											const page = e.target.value ? Number(e.target.value) - 1 : 0
											gotoPage(page)
										}}
										style={{ width: '100px' }}
									/>
							</li>
							<li className="page-item pl-2">
							<select
									className="custom-select"
									value={pageSize}
									onChange={e => {
										setPageSize(Number(e.target.value))
									}}
								> 
									{[5,10, 20, 30, 40, 50].map(pageSize => (
										<option key={pageSize} value={pageSize}>Mostrar {pageSize}</option>
									))}
							</select>
							</li>
                        </ul>
                    </nav>
			</div>
		</>
	)
}

function GlobalFilter({
	preGlobalFilteredRows,
	globalFilter,
	setGlobalFilter,
	titulo
}) {
	const count = preGlobalFilteredRows.length
	const [value, setValue] = React.useState(globalFilter)
	const onChange = useAsyncDebounce(value => { setGlobalFilter(value || undefined) }, 200)
	return (
		<div className="card-header">
			<h3 className="card-title">{titulo}</h3>
			<div className="card-options">
				<form>
					<div className="input-group">
						<input
							value={value || ""}
							onChange={e => {
								setValue(e.target.value);
								onChange(e.target.value);
							}}
							type="text"
							className="form-control form-control-sm"
							placeholder={`Buscar en ${count} registros...`}
							name="s" />
						<span className="input-group-btn ml-2">
							<button className="btn btn-icon btn-sm" type="submit">
								<span className="fe fe-search" />
							</button>
						</span>
					</div>
				</form>
			</div>
		</div>
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

export default AlumnosTable;