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

interface DBHeader {
      id: number,
      company: string,
      po_num: string,
      vendor_name: string,
      po_date: Date,
      placed_by: string,
      ship_date: Date,
      ship_via: string,
      email: string,
  }

async function addHeader(header: DBHeader): Promise<any> {
    try{
        console.log("HEADER => ", header)
        let pool: any = await sql.connect(dev_config);
        let result: any = await pool.request()
                                    .input('company_p', sql.NVarChar, header.company.split("-")[0])
                                    .input('po_num_p', sql.NVarChar, header.po_num)
                                    .input('vendor_name_p', sql.NVarChar, header.vendor_name)
                                    .input('po_date_p', sql.Date, new Date(header.po_date))
                                    .input('placed_by_p', sql.NVarChar, header.placed_by)
                                    .input('ship_date_p', sql.Date, new Date(header.ship_date))
                                    .input('ship_via_p', sql.NVarChar, header.ship_via)
                                    .input('email_p', sql.NVarChar, header.email)
                                    .query(`INSERT INTO dbo.WBT_PO_Header 
                                                (company, 
                                                 po_num, 
                                                 vendor_name, 
                                                 po_date, 
                                                 placed_by, 
                                                 ship_date, 
                                                 ship_via, 
                                                 email) 
                                            VALUES (@company_p,
                                                    @po_num_p,
                                                    @vendor_name_p,
                                                    @po_date_p,
                                                    @placed_by_p,
                                                    @ship_date_p,
                                                    @ship_via_p,
                                                    @email_p)`);
        let id: any = await pool.request()
                                .query("SELECT MAX(id) AS [id] FROM WBT_PO_Header");
        pool.close();
        console.log("RESULT", id);
        return id.recordset;
    }
    catch(e){
        console.log(e)
    }
}



async function addline(lines): Promise<any> {
    try{
        
        let resArr: any[] = [];
        lines.forEach( async (line) => {
            let pool: any = await sql.connect(dev_config);
            let result: any = await pool.request()
                                        .input('id_p', sql.Int, parseInt(line.header_id))
                                        .input('part_number_p', sql.NVarChar, line.part_num)
                                        .input('description_p', sql.NVarChar, line.description)
                                        .input('branch_p', sql.NVarChar, line.branch)
                                        .input('qty_p', sql.Decimal(18, 5), parseFloat(line.qty))
                                        .input('unit_price_p', sql.Decimal(18, 5), parseFloat(line.unit_price))
                                        .query(`INSERT INTO WBT_PO_Line (header_id, 
                                                                         part_num, 
                                                                         description, 
                                                                         branch, qty, 
                                                                         unit_price) 
                                                VALUES (@id_p, 
                                                        @part_number_p,
                                                        @description_p,
                                                        @branch_p,
                                                        @qty_p,
                                                        @unit_price_p)`);
            
            resArr.push(result.recordset);
            pool.close();
        })
        return resArr;
    }
    catch(e){
        console.log(e)
    }
}



module.exports = {
    addHeader: addHeader,
    addline: addline
}