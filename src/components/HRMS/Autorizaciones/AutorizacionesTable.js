import React from 'react';
import { useTable, useFilters, useGlobalFilter, useResizeColumns, usePagination } from 'react-table'
import matchSorter from 'match-sorter'
import '../../../assets/css/table.css'

class AutorizacionesTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: props.data,
			emptyTitulo: (props.data.length === 0),
			titulo: " ",
			columns : 
			[{
				Header: ' ',
				columns: 
					[
					{
						Header: ' ',
						accessor: 'detalle',
						filter: 'fuzzyText',
					},
					]
			}],
		}
	}

	componentWillReceiveProps(props) {

		const {  data, titulo } = props;
		this.setState({
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
				<div >
					<Table columns={this.state.columns} data={this.state.data} titulo={this.state.titulo}></Table>
				</div>
			</React.Fragment>
		);
	}


}


function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id].key] })
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
		},
		useFilters, // useFilters!
		useGlobalFilter, // useGlobalFilter!
		useResizeColumns,
		usePagination
	)

	// Render the UI for your table
	return (
		<div className='tableWrap'>
			<table {...getTableProps()} className="mt-1 mb-0">
				<thead >
					<tr>
					</tr>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()} >
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()} >
									{column.render('Header')}
									{/* Render the columns filter UI */}
									<div
										{...column.getResizerProps()}
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
			className="form-control form-control-sm mb-3"
		/>
	)
}

export default AutorizacionesTable;