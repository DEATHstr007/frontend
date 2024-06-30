import { useState, useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    Card,
    CardContent,
    CardActions,
    Typography,
    TablePagination,
} from "@mui/material"
import { BackendApi } from "../../client/backend-api"
import { useUser } from "../../context/user-context"
import classes from "./styles.module.css"

export const DeviceList = () => {

    const [Device, setDevice] = useState([]);
    const [borrowedDevice, setBorrowedDevice] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [activeDeviceIsbn, setActiveDeviceIsbn] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const { isAdmin, user } = useUser()


    const fetchDevice = async () => {
        const { Device } = await BackendApi.Device.getAllDevice()
        setDevice(Device)
    }

    const fetchUserDevice = async () => {
        const { Device } = await BackendApi.user.getBorrowDevice()
        setBorrowedDevice(Device)
    }

    const deleteDevice = () => {
        if (activeDeviceIsbn && Device.length) {
            BackendApi.Device.deleteDevice(activeDeviceIsbn).then(({ success }) => {
                fetchDevice().catch(console.error)
                setOpenModal(false)
                setActiveDeviceIsbn("")
            })
        }
    }

    useEffect(() => {
        fetchDevice().catch(console.error)
        fetchUserDevice().catch(console.error)
    }, [user])

    return (
        <>
            <div className={`${classes.pageHeader} ${classes.mb2}`}>
                <Typography variant="h5">Device List</Typography>
                {isAdmin && (
                    <Button variant="contained" color="primary" component={RouterLink} to="/admin/Device/add">
                        Add Device
                    </Button>
                )}
            </div>
            {Device.length > 0 ? (
                <>
                    <div className={classes.tableContainer}>
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">ISBN</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Available</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? Device.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : Device
                                    ).map((Device) => (
                                        <TableRow key={Device.isbn}>
                                            <TableCell component="th" scope="row">
                                                {Device.name}
                                            </TableCell>
                                            <TableCell align="right">{Device.isbn}</TableCell>
                                            <TableCell>{Device.category}</TableCell>
                                            <TableCell align="right">{Device.quantity}</TableCell>
                                            <TableCell align="right">{Device.availableQuantity}</TableCell>
                                            <TableCell align="right">{`$${Device.price}`}</TableCell>
                                            <TableCell>
                                                <div className={classes.actionsContainer}>
                                                    <Button
                                                        variant="contained"
                                                        component={RouterLink}
                                                        size="small"
                                                        to={`/Device/${Device.isbn}`}
                                                    >
                                                        View
                                                    </Button>
                                                    {isAdmin && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                component={RouterLink}
                                                                size="small"
                                                                to={`/admin/Device/${Device.isbn}/edit`}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                onClick={(e) => {
                                                                    setActiveDeviceIsbn(Device.isbn)
                                                                    setOpenModal(true)
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10))
                                setPage(0)
                            }}
                            component="div"
                            count={Device.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                        />
                        <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
                            <Card className={classes.conf_modal}>
                                <CardContent>
                                    <h2>Are you sure?</h2>
                                </CardContent>
                                <CardActions className={classes.conf_modal_actions}>
                                    <Button variant="contained" onClick={() => setOpenModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={deleteDevice}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Modal>
                    </div>
                </>
            ) : (
                <Typography variant="h5">No Devices found!</Typography>
            )}

            {
                user && !isAdmin && (
                    <>
                        <div className={`${classes.pageHeader} ${classes.mb2}`}>
                            <Typography variant="h5">Borrowed Devices</Typography>
                        </div>
                        {borrowedDevice.length > 0 ? (
                            <>
                                <div className={classes.tableContainer}>
                                    <TableContainer component={Paper}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell align="right">ISBN</TableCell>
                                                    <TableCell>Category</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {borrowedDevice.map((Device) => (
                                                    <TableRow key={Device.isbn}>
                                                        <TableCell component="th" scope="row">
                                                            {Device.name}
                                                        </TableCell>
                                                        <TableCell align="right">{Device.isbn}</TableCell>
                                                        <TableCell>{Device.category}</TableCell>
                                                        <TableCell align="right">{`$${Device.price}`}</TableCell>
                                                        <TableCell>
                                                            <div className={classes.actionsContainer}>
                                                                <Button
                                                                    variant="contained"
                                                                    component={RouterLink}
                                                                    size="small"
                                                                    to={`/Device/${Device.isbn}`}
                                                                >
                                                                    View
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </>
                        ) : (
                            <Typography variant="h5">No Device issued!</Typography>
                        )}
                    </>
                )
            }
        </>
    )
}