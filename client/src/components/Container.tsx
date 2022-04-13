import React from 'react';
import HeaderForm from './forms/Header';
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import LineArray from './forms/LineArray';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

  interface FormValues {
  id: number,
  location: string,
  poNumber: string,
  vendorName: string,
  poDate: string,
  placedBy: string,
  shipDate: string,
  shipVia: string,
  emailTo: string,
  lines?: {
      qty: number
      part_num: string,
      description: string,
      branch: string,
      unit_price: number,
  }[];
}

interface DBHeader {
  header: {
    id: number,
    company: string,
    po_num: string,
    vendor_name: string,
    po_date: string,
    placed_by: string,
    ship_date: string,
    ship_via: string,
    email: string,
  }
}

let schema = yup.object().shape({
  location: yup.string().required("Location is required."),
  emailTo: yup.string().email(""),
  poNumber: yup.string().required("PO Number is required."),
  vendorName: yup.string().required("Vendor Name is required."),
  poDate: yup.date().required("PO Date is required."),
  placedBy: yup.string().required("Placed By is required."),
  shipDate: yup.date().required("ship Date is required."),
  shipVia: yup.string(),
  lines: yup.array().of(
    yup.object().shape({
      qty: yup.number().positive().required("Quantity is required."),
      part_num: yup.string().required("Part Number is required."),
      description: yup.string().max(100).required("Description is required."),
      branch: yup.string().required("Branch is required."),
      unit_price: yup.number().required("Unit Price is required.")
    })
  )
}).required();


const POContainer: React.FC = () => {

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const handlePrint: SubmitHandler<FormValues> = async (data) => {
      const lines = data.lines;
      
      let header: any = {};
      header["company"] = data.location
      header["po_num"] = data.poNumber
      header["vendor_name"] = data.vendorName
      header["po_date"] = data.poDate
      header["placed_by"] = data.placedBy
      header["ship_date"] = data.shipDate
      header["ship_via"] = data.shipVia
      header["email"] = data.emailTo
      axios.post('/header', header)
        .then((res) => {
          let id = res.data.id;
          header["id"] = id;
          let lines: any = data.lines;
          for(let i = 0; i < lines.length; i++){
            lines[i].header_id = id;
          }
          axios.post('/lines', lines)
            .then((res2) => {
              axios.post('/print', header, {responseType: 'blob'})
                .then((res3) => {
                    const file = new Blob([res3.data], {type: 'application/pdf'});
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                })
            })
        })
  }

  const handleEmail: SubmitHandler<FormValues> = async (data) => {
      if(data.emailTo === "") {
        toast.error("Looks like you forgot to add a valid email address.", {
          position: "top-center",
        });
        return;
      }
      const lines = data.lines;
      
      let header: any = {};
      header["company"] = data.location
      header["po_num"] = data.poNumber
      header["vendor_name"] = data.vendorName
      header["po_date"] = data.poDate
      header["placed_by"] = data.placedBy
      header["ship_date"] = data.shipDate
      header["ship_via"] = data.shipVia
      header["email"] = data.emailTo
      axios.post('/header', header)
        .then((res) => {
          let id = res.data.id;
          header["id"] = id;
          let lines: any = data.lines;
          for(let i = 0; i < lines.length; i++){
            lines[i].header_id = id;
          }
          axios.post('/lines', lines)
            .then((res2) => {
              axios.post('/print', header, {responseType: 'blob'})
                .then(printRes => {
                  const file = new Blob([printRes.data], {type: 'application/pdf'});
                  axios.post('/email', header)
                    .then((res3) => {
                        toast.success("Success, email has been sent!", {
                          position: "bottom-center"
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      toast.error("Oops, failed to send email. Contact helpdesk.")
                    })               
                })
              
            })
        })
    }

  return (
    <>
      <FormProvider {...methods}>
        <div className="p-6 shadow-lg rounded-lg bg-gray-300 text-gray-700">
          <h2 className="font-semibold text-3xl mb-5">New Non-Inventory Purchase Order</h2>
          <form className="space-y-4 text-gray-700" >
            <HeaderForm />
            <h3 className="font-semibold text-3xl mb-5">PO Lines</h3>
            <LineArray />
            <button type="submit" className="inline-block px-6 py-2.5 mt-4 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out mr-2"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={methods.handleSubmit(handlePrint)}>Print PO</button>
            <button type="submit" className="inline-block px-6 py-2.5 mt-4 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={methods.handleSubmit(handleEmail)}>Email PO</button>
          </form>
          <ToastContainer />
        </div>
      </FormProvider>
    </>
  )
};

export default POContainer;