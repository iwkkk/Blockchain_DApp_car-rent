import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { fetchStorage } from "../utils/tzkt";
import { useState, useEffect } from "react";


const columns = [
    { id: 'carNumber', label: 'Car Number', minWidth: 170, },
    { id: 'carName', label: 'Car Name', minWidth: 100, },
    { id: 'owner', label: 'Owner', minWidth: 100, },
    { id: 'renter', label: 'Renter', minWidth: 170, },
    { id: 'deposit', label: 'Deposit (tez)', minWidth: 170, },
    { id: 'rent', label: 'Rent (tez)', minWidth: 170, },
    { id: 'available', label: 'Available', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 170, },
    {id: 'comment', label: 'Comment', minWidth: 250,},
];

function createData(carNumber, carName, owner, renter, deposit, rent, available, description, comment) {
    deposit = deposit / 1000000;
    rent = rent / 1000000;
    return { carNumber, carName, owner, renter, deposit, rent, available, description, comment };
}

// function createData(data)
// {

//     data.carList.forEach(element => {
//         object.key(element) 

//     });
// }

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function StickyHeadTable() {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        // TODO 9 - Fetch players and tickets remaining from storage
        (async () => {
            const storage = await fetchStorage();
            var info = [];
            Object.keys(storage.carList).forEach(element => {
                var comm = "";
                var n = 1;
                storage.carList[element].comment.forEach(element => {
                    comm += "comment" + n.toString()+": [" + element.toString()+"]"+"        ";
                    n++;
                })
                info = info.concat([
                    createData(
                        element,
                        storage.carList[element].carName,
                        storage.owner,
                        storage.carList[element].renter,
                        storage.carList[element].deposit,
                        storage.carList[element].rent,
                        storage.carList[element].available.toString(),
                        storage.carList[element].description,
                        comm,
                    )]);
            })
            setRows(info);
        })();
    }, []);

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
