import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import SelectBox from '../SelectBox/index'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
import { fetchApi } from '../../Services/services'

const FORM_DATA = {
    vehicleType: '',
    serviceType: '',
    vehicleSubType: '',
    vendorMobileNum: '',
    vendorTime:''
}
const Form = () => {
    const [formData, setFormData] = useState(FORM_DATA);
    const [loader, setLoader] = useState(false);
    const [VEHICLE_LIST, setVEHICLE_LIST] = useState([]);
    const [VEHICLE_TYPES, setVEHICLE_TYPES] = useState([]);
    const [SERVICE_TYPES, setSERVICE_TYPES] = useState([]);
    const [VENDOR_LIST, setVENDOR_LIST] = useState([]);
    const [VENDORSLOT_LIST, setVENDORSLOT_LIST] = useState([]);
    const [SERVICE_SELECTED, setSERVICE_SELECTED] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const formHandler = e => {
        const { name, value } = e.target

        let updatedData = { ...formData, [name]: value }
        setFormData(updatedData)
        if (name === 'vehicleType' && value) {
            console.log("carType")
            fetchVehicleType(value)
        }
        if (name === 'vehicleSubType' && value) {
            fetchServiceList(value)
        }
        if (name === 'vendorMobileNum' && value) {
            fetchVendorSlots(value)
        }
    }
    const packageHandler = (item) => {
        setSERVICE_SELECTED(item)
    }
    useEffect(() => {
        if (VEHICLE_LIST.length === 0) {
            console.log("useEffect called")
            fetchAllVehicles()
            getAllVendors()
        }

    }, [VEHICLE_LIST])

    const fetchAllVehicles = () => {
        setLoader(true)
        fetchApi('vehicle/getAllVehicle', 'GET', null, allVehicleReturn)
    }
    const fetchVehicleType = (value) => {
        setLoader(true)
        fetchApi(`vehicle/getVehicleType/${value}`, 'GET', null, allVehicleTypeReturn)
    }
    const getAllVendors = () => {
        fetchApi(`user/getAllVendors/Wakad`, 'GET', null, allVendorReturn)
    }
    const fetchServiceList = (value) => {
        console.log(value)
        setLoader(true)
        console.log("FORM_DATA", formData)
        fetchApi(`booking/getPackageList/${formData.vehicleType}/${value}`, 'GET', null, serviceTypeReturn)
    }
    const fetchVendorSlots = (value) => {
        setLoader(true)
        fetchApi(`booking/getVendorSlot/${value}?date=02-06-2020`, 'GET', null, vendorSlotReturn)
    }

    const allVehicleReturn = (data) => {
        setLoader(false)
        if (data.status === 'SUCCESS') {
            let list = data.data.map(item => {
                return { "label": item, "value": item }
            })
            list.unshift({ "label": 'Select', "value": '' })
            setVEHICLE_LIST(list)
        }
    }
    const allVehicleTypeReturn = (data) => {
        console.log(JSON.stringify('allVehicleTypeReturn', data))
        setLoader(false)
        if (data.status === 'SUCCESS') {
            let list = data.data.map(item => {
                return { "label": item, "value": item }
            })
            list.unshift({ "label": 'Select', "value": '' })
            setVEHICLE_TYPES(list)
        }
    }
    const serviceTypeReturn = (data) => {
        console.log(JSON.stringify('serviceTypeReturn', data))
        setLoader(false)
        if (data.status === 'SUCCESS') {
            let list = _.sortBy(data.data, ['price'])
            setSERVICE_TYPES(list)
        }
    }

    const allVendorReturn = (data) => {
        console.log("allVendorReturn", data)
        if (data.status === 'SUCCESS') {
            let list = data.data.map(item => {
                return { "label": item.firstName, "value": item.mobileNum }
            })
            list.unshift({ "label": 'Select', "value": '' })
            // let list = _.sortBy(data.data, ['price'])
            setVENDOR_LIST(list)
        }
    }

    const vendorSlotReturn = (data) => {
        console.log("vendorSlotReturn", data)
        setLoader(false)
        if (data.status === 'SUCCESS') {
            let list = data.data.map(item => {
                return { "label": item, "value": item }
            })
            list.unshift({ "label": 'Select', "value": '' })
            // let list = _.sortBy(data.data, ['price'])
            setVENDORSLOT_LIST(list)
        }
    }
    const submitHandler = (event) => {
        event.preventDefault()
        console.log(formData)
        console.log(startDate)
    }
    console.log(startDate)
    const getPackageService = () => {
        return (
            SERVICE_TYPES.map(item => {
                return <div className="col-12 col-sm-4" key={item.packageId}>
                    <label className="radiolabel">
                        <input type="radio" name="product" className="card-input-element" onChange={() => packageHandler(item)} />
                        <div className="panel panel-default card-input">
                            <div className="row">
                                <div class="col-12"><strong className="yellow">{item.description}</strong></div>
                                <div class="col-12"><strong className="yellow">Price: </strong>{item.price}</div>
                                <div class="col-12"><strong className="yellow">Include: </strong>{item.name}</div>
                            </div>
                        </div>
                    </label>
                </div>
            }))
    }
    return (
        <>
            {loader && <div className="loading">Loading&#8230;</div>}
            {/* <div className="row">
                <div className="col-12 col-sm-6">

                </div>
                <div className="col-12 col-sm-6">

                </div>
            </div> */}

            <form className="form" role="form" onSubmit={submitHandler} autoComplete="off" >
                <div className="row">
                    <div className="col-12 col-sm-6 m-auto">
                        {VEHICLE_LIST.length > 0 && <SelectBox id="vehicleType"
                            name="vehicleType"
                            options={VEHICLE_LIST}
                            changeHandler={formHandler}
                            label="Select Your Vehicle Type" />}
                    </div>

                    {VEHICLE_TYPES.length > 0 &&
                        <div className="col-12 col-sm-6  m-auto">
                            <SelectBox id="vehicleSubType"
                                name="vehicleSubType"
                                options={VEHICLE_TYPES}
                                changeHandler={formHandler}
                                label="Select Your Car Type" />
                        </div>}
                </div>
                <div className="row">
                    {formData.vehicleSubType &&
                        <div className="col-12 col-sm-6 m-auto">
                            <div className="form-group">
                                <label htmlFor="location">Available Location</label>
                                <input className="form-control" value="Wakad, Pune" name="location" disabled />
                            </div>
                        </div>}
                    {formData.vehicleSubType &&
                        <div className="col-12 col-sm-6  m-auto">
                            <SelectBox id="vendorMobileNum"
                                name="vendorMobileNum"
                                options={VENDOR_LIST}
                                changeHandler={formHandler}
                                label="Select Your Vendor" />
                        </div>}
                </div>
                {formData.vendorMobileNum && SERVICE_TYPES.length > 0 && <label htmlFor="Package">Choose your service</label>}

                {formData.vendorMobileNum &&  SERVICE_TYPES.length > 0 &&
                    <div className="row">
                        {getPackageService()}
                    </div>
                }

                {SERVICE_SELECTED && SERVICE_SELECTED.price && <div className="row">
                    <div className="col-12 col-sm-6">
                        <label htmlFor="Select Date" className="d-block">Select Date</label>
                        <DatePicker selected={startDate} minDate={new Date()} className="form-control  w-100" onChange={date => setStartDate(date)} />
                    </div>
                    <div className="col-12 col-sm-6">
                        {VENDORSLOT_LIST && VENDORSLOT_LIST.length &&
                            <SelectBox id="vendorTime"
                                    name="vendorTime"
                            options={VENDORSLOT_LIST}
                                    changeHandler={formHandler}
                            label="Select Time" />
                            }
                    </div>
                </div>}
                {/* <div className="form-group d-flex">
                    <button type="submit" disabled className="btn btn-default btn-lg btn-block text-center text-uppercase text-white bg-yellow">Book Now</button>
                </div> */}

            </form>
        </>
    )
}

export default Form