import axios from 'axios';
import { IPO_Header, IPO_Line } from '../types/interfaces'
const fetch = require('node-fetch');
import CreatePDF from './createPDF';
const fs = require('fs').promises
import * as path from 'path'



const generatePDF = ( data: IPO_Header, dataCallback, endCallback ) => {
    const fetchLines = () => {
        let id = data.id;
        const url = `http://localhost:5000/lines/${id}`;
        try{
            return fetch(url).then((res) => res.json()).then((data) => data);
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchLogo = () => {
        let newPath = path.join(__dirname, '../public/logos.png');
        const buffer64 = fs.readFile(newPath, { encoding: 'base64' })
        return buffer64
    }

    const fetchLocationInfo = () => {
        let id;
        if(data.company.includes("-")){
            id = data.company.split("-")[0];
        }
        else{
            id = data.company;
        }
        console.log(id, data);
        return fetch(`http://localhost:5000/locations/${id}`)
            .then((locations) => locations.json())
            .then((data) => data)
    }

    const generateHTML = (header, lines) => {

        const obj = new Object();
        fetchLogo()
            .then((buffer) => {
                obj["header"] = header;
                obj["lines"] = lines;
                let grandTotal = 0;
                for(let line of lines) {
                    let total = line.unit_price * line.qty;
                    grandTotal = grandTotal + total;
                }
                obj["grandTotal"] = grandTotal;
                fetchLocationInfo()
                    .then((location) => {
                        let pdf = new CreatePDF(obj, buffer, location);
                        return pdf.generate(dataCallback, endCallback);
                    })
            })

        
    }
    return fetchLines()
        .then((lines) => generateHTML(data, lines))

}

const execute = async (data, dataCallback, endcallback) => {
    return new Promise(resolve => {
        resolve(generatePDF(data, dataCallback, endcallback));
    })
}


module.exports = {
    execute: execute,
}