import React, { useState, useEffect } from "react"
import * as dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useParams, useNavigate } from "react-router-dom"
import {
    Paper,
    Container,
    Button,
    TextField,
    FormGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material"
import { BackendApi } from "C:\Users\studb\OneDrive\Desktop\lab\frontend\src\backend"
import classes from "./styles.module.css"

dayjs.extend(utc)

export const deviceForm = () => {
    const { deviceIsbn } = useParams()
    const navigate = useNavigate()
    const [device, setdevice] = useState({
        name: "",
        isbn: deviceIsbn || "",
        category: "",
        price: 0,
        quantity: 0,
        priceHistory: [],
        quantityHistory: [],
    })
    const [errors, setErrors] = useState({
        name: "",
        isbn: "",
        category: "",
        price: "",
        quantity: "",
    })

    const isInvalid =
        device.name.trim() === "" || device.isbn.trim() === "" || device.category.trim() === ""

    const formSubmit = (event) => {
        event.preventDefault()
        if (!isInvalid) {
            if (deviceIsbn) {
                const newPrice = parseInt(device.price, 10)
                const newQuantity = parseInt(device.quantity, 10)
                let newPriceHistory = device.priceHistory.slice()
                let newQuantityHistory = device.quantityHistory.slice()
                if (
                    newPriceHistory.length === 0 ||
                    newPriceHistory[newPriceHistory.length - 1].price !== newPrice
                ) {
                    newPriceHistory.push({ price: newPrice, modifiedAt: dayjs().utc().format() })
                }
                if (
                    newQuantityHistory.length === 0 ||
                    newQuantityHistory[newQuantityHistory.length - 1].quantity !== newQuantity
                ) {
                    newQuantityHistory.push({ quantity: newQuantity, modifiedAt: dayjs().utc().format() })
                }
                BackendApi.device
                    .patchdeviceByIsbn(deviceIsbn, {
                        ...device,
                        priceHistory: newPriceHistory,
                        quantityHistory: newQuantityHistory,
                    })
                    .then(() => navigate(-1))
            } else {
                BackendApi.device
                    .adddevice({
                        ...device,
                        priceHistory: [{ price: device.price, modifiedAt: dayjs().utc().format() }],
                        quantityHistory: [{ quantity: device.quantity, modifiedAt: dayjs().utc().format() }],
                    })
                    .then(() => navigate("/"))
            }
        }
    }

    const updatedeviceField = (event) => {
        const field = event.target
        setdevice((device) => ({ ...device, [field.name]: field.value }))
    }

    const validateForm = (event) => {
        const { name, value } = event.target
        if (["name", "isbn", "price", "quantity"].includes(name)) {
            setdevice((prevProd) => ({ ...prevProd, [name]: value.trim() }))
            if (!value.trim().length) {
                setErrors({ ...errors, [name]: `${name} can't be empty` })
            } else {
                setErrors({ ...errors, [name]: "" })
            }
        }
        if (["price", "quantity"].includes(name)) {
            if (isNaN(Number(value))) {
                setErrors({ ...errors, [name]: "Only numbers are allowed" })
            } else {
                setErrors({ ...errors, [name]: "" })
            }
        }
    }

    useEffect(() => {
        if (deviceIsbn) {
            BackendApi.device.getdeviceByIsbn(deviceIsbn).then(({ device, error }) => {
                if (error) {
                    navigate("/")
                } else {
                    setdevice(device)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceIsbn])

    return (
        <>
            <Container component={Paper} className={classes.wrapper}>
                <Typography className={classes.pageHeader} variant="h5">
                    {deviceIsbn ? "Update device" : "Add device"}
                </Typography>
                <form noValidate autoComplete="off" onSubmit={formSubmit}>
                    <FormGroup>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Name"
                                name="name"
                                required
                                value={device.name}
                                onChange={updatedeviceField}
                                onBlur={validateForm}
                                error={errors.name.length > 0}
                                helperText={errors.name}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="ISBN"
                                name="isbn"
                                required
                                value={device.isbn}
                                onChange={updatedeviceField}
                                onBlur={validateForm}
                                error={errors.isbn.length > 0}
                                helperText={errors.isbn}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <InputLabel>Category</InputLabel>
                            <Select name="category" value={device.category} onChange={updatedeviceField} required>
                                <MenuItem value="Storage">Sci-Fi</MenuItem>
                                <MenuItem value="Display">Action</MenuItem>
                                <MenuItem value="PC">Adventure</MenuItem>
                                
                            </Select>
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Price"
                                name="price"
                                required
                                value={device.price}
                                onChange={updatedeviceField}
                                onBlur={validateForm}
                                error={errors.price.length > 0}
                                helperText={errors.price}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={device.quantity}
                                onChange={updatedeviceField}
                                onBlur={validateForm}
                                error={errors.quantity.length > 0}
                                helperText={errors.quantity}
                            />
                        </FormControl>
                    </FormGroup>
                    <div className={classes.btnContainer}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                navigate(-1)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isInvalid}>
                            {deviceIsbn ? "Update device" : "Add device"}
                        </Button>
                    </div>
                </form>
            </Container>
        </>
    )
}