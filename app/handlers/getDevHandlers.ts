const sql = require('mssql')
import dotenv from 'dotenv'
import { IConfig } from '../types/interfaces'

dotenv.config();

const dev_config: IConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    server: process.env.DATABASE_SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.DATABASE_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}


async function getHeader(id: string): Promise<any> {
    try{
        let pool: any = await sql.connect(dev_config);
        let result: any = await pool.request()
                                    .input('id_parameter', sql.Int, id)
                                    .query(`SELECT id, company, 
                                                po_num, vendor_name, 
                                                convert(nvarchar, po_date, 101) AS [po_date], 
                                                placed_by, 
                                                convert(nvarchar, ship_date, 101) AS [ship_date], 
                                                ship_via, 
                                                email 
                                            FROM WBT_PO_Header 
                                            WHERE id = @id_parameter`);
        pool.close()
        return result.recordsets;
        
    }
    catch(e){
        console.log(e)
    }
    
}
async function getLines(id: string): Promise<any> {
    try{
        let pool: any = await sql.connect(dev_config);
        let result: any = await pool.request()
                                    .input('id_parameter', sql.Int, id)
                                    .query(`SELECT qty, 
                                                    part_num, 
                                                    description, 
                                                    branch, 
                                                    unit_price 
                                            FROM WBT_PO_Line 
                                            WHERE header_id = @id_parameter`);
        pool.close();
        return result.recordsets;
    }
    catch(e){
        console.log(e)
    }
}

async function getHeaderSearch(id: string): Promise<any> {
    try{
        let pool: any = await sql.connect(dev_config);
        let result: any = await pool.request()
                                    .input('id_parameter', sql.NVarChar, id)
                                    .query(`SELECT id, 
                                                    company, 
                                                    po_num, 
                                                    vendor_name, 
                                                    convert(nvarchar, po_date, 101) AS [po_date], 
                                                    placed_by, 
                                                    convert(nvarchar, ship_date, 101) AS [ship_date], 
                                                    ship_via, 
                                                    email 
                                            FROM WBT_PO_Header 
                                            WHERE po_num like '%' + @id_parameter + '%'`);
        pool.close();
        return result.recordsets;
    }
    catch(e){
        console.log(e)
    }
}

module.exports = {
    getHeaderSearch: getHeaderSearch,
    getLines: getLines,
    getHeader: getHeader
}