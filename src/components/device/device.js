import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import {
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@mui/material"
import { NotificationManager } from "react-notifications"
import { BackendApi } from "C:\Users\studb\OneDrive\Desktop\lab\frontend\src\backend"
import { useUser } from "../../context/user-context"
import { TabPanel } from "../tabs/tab"
import { makeChartOptions } from "./chart-options"
import classes from "./styles.module.css"

export const device = () => {
    const { deviceIsbn } = useParams()
    const { user, isAdmin } = useUser()
    const navigate = useNavigate()
    const [device, setdevice] = useState(null)
    const [chartOptions, setChartOptions] = useState(null)
    const [openTab, setOpenTab] = useState(0)

    const borrowdevice = () => {
        if (device && user) {
            BackendApi.user
                .borrowdevice(device.isbn, user._id)
                .then(({ device, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setdevice(device)
                    }
                })
                .catch(console.error)
        }
    }

    const returndevice = () => {
        if (device && user) {
            BackendApi.user
                .returndevice(device.isbn, user._id)
                .then(({ device, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setdevice(device)
                    }
                })
                .catch(console.error)
        }
    }

    useEffect(() => {
        if (deviceIsbn) {
            BackendApi.device
                .getdeviceByIsbn(deviceIsbn)
                .then(({ device, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setdevice(device)
                    }
                })
                .catch(console.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceIsbn])

    return (
        device && (
            <div className={classes.wrapper}>
                <Typography variant="h5" align="center" style={{ marginBottom: 20 }}>
                    device Details
                </Typography>
                <Card>
                    <Tabs
                        value={openTab}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={(e, tabIndex) => {
                            setOpenTab(tabIndex)
                            if (device && tabIndex > 0) {
                                setChartOptions(
                                    makeChartOptions(
                                        tabIndex,
                                        tabIndex === 1 ? device.priceHistory : device.quantityHistory
                                    )
                                )
                            }
                        }}
                        centered
                    >
                        <Tab label="device Details" tabIndex={0} />
                        <Tab label="Price History" tabIndex={1} />
                        <Tab label="Quantity History" tabIndex={2} />
                    </Tabs>

                    <TabPanel value={openTab} index={0}>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant="head" component="th" width="200">
                                            Name
                                        </TableCell>
                                        <TableCell>{device.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            ISBN
                                        </TableCell>
                                        <TableCell>{device.isbn}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Category
                                        </TableCell>
                                        <TableCell>{device.category}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Quantity
                                        </TableCell>
                                        <TableCell>{device.quantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Available
                                        </TableCell>
                                        <TableCell>{device.availableQuantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Price
                                        </TableCell>
                                        <TableCell>${device.price}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </TabPanel>

                    <TabPanel value={openTab} index={1}>
                        <CardContent>
                            {device && device.priceHistory.length > 0 ? (
                                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                            ) : (
                                <h3>No history found!</h3>
                            )}
                        </CardContent>
                    </TabPanel>

                    <TabPanel value={openTab} index={2}>
                        <CardContent>
                            {device && device.quantityHistory.length > 0 ? (
                                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                            ) : (
                                <h3>No history found!</h3>
                            )}
                        </CardContent>
                    </TabPanel>

                    <CardActions disableSpacing>
                        <div className={classes.btnContainer}>
                            {isAdmin ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component={RouterLink}
                                    to={`/admin/devices/${deviceIsbn}/edit`}
                                >
                                    Edit device
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={borrowdevice}
                                        disabled={device && user && device.borrowedBy.includes(user._id)}
                                    >
                                        Borrow
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={returndevice}
                                        disabled={device && user && !device.borrowedBy.includes(user._id)}
                                    >
                                        Return
                                    </Button>
                                </>
                            )}
                            <Button type="submit" variant="text" color="primary" onClick={() => navigate(-1)}>
                                Go Back
                            </Button>
                        </div>
                    </CardActions>
                </Card>
            </div>
        )
    )
}