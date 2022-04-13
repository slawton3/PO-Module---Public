const sql = require('mssql')
import dotenv from 'dotenv'
import { IConfig } from '../types/interfaces'

dotenv.config();

const live_config: IConfig = {
    user: process.env.LIVE_DATABASE_USER,
    password: process.env.LIVE_DATABASE_PASSWORD,
    server: process.env.LIVE_DATABASE_SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.LIVE_DATABASE_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}


async function getLocations(): Promise<any> {
    try{
        let pool: any = await sql.connect(live_config);
        let result: any = await pool.request().query(`SELECT location_id,
                                default_branch_id,
                                CASE WHEN location_name LIKE 'Standard%' THEN 'SBC'
                                        WHEN location_name LIKE 'RPM%' THEN 'RPM'
                                        WHEN location_name LIKE 'Northern%' THEN 'NIS'
                                        WHEN location_name LIKE 'Carolina%' THEN 'CBC'
                                        WHEN location_name LIKE 'Griffco%' THEN 'GFC'
                                        WHEN location_name LIKE 'Applied%' THEN 'APS'
                                        WHEN location_name LIKE 'Black%' THEN 'BHC'
                                ELSE 'WBT' END AS [Location_PreFix],
                                phys_address1,
                                phys_address2,
                                phys_city,
                                phys_state,
                                phys_postal_code
                            FROM location
                                LEFT JOIN address ON location.location_id = address.id
                            WHERE location.Delete_flag <> 'Y'
                                AND company_id = '001'
                                AND location_id <> '99'
                            ORDER BY default_branch_id, location_id`);
        pool.close();
        return result.recordsets;
    }
    catch(e){
        console.log(e)
    }
}

async function getLocationInfo(company: string): Promise<any> {
    console.log(company);
    try{
        let pool: any = await sql.connect(live_config);
        let result: any = await pool.request()
                                    .input('company_parameter', sql.Int, company)
                                    .query(`SELECT location_id,
                                                        default_branch_id,
                                                        location_name ,
                                                        phys_address1,
                                                        phys_address2,
                                                        phys_city,
                                                        phys_state,
                                                        phys_postal_code
                                                    FROM location
                                                        LEFT JOIN address ON location.location_id = address.id
                                                    WHERE location.Delete_flag <> 'Y'
                                                        AND company_id = '001'
                                                        AND location_id = @company_parameter`);
        pool.close();
        return result.recordsets;
    }
    catch(e){
        console.log(e)
    }
}

async function getName(): Promise<any> {
    try{
        let pool: any = await sql.connect(live_config);
        let result: any = await pool.request()
                                    .query(`SELECT users.id,
                                                users.email_address,
                                                users.name
                                            FROM users
                                            WHERE users.delete_flag <> 'Y'
                                                AND users.name IS NOT NULL
                                                AND users.name NOT LIKE '%warehouse%'
                                                AND users.name NOT LIKE '%warehouse%'
                                                AND users.email_address IS NOT NULL
                                            AND users.id NOT LIKE '%ADMIN%'
                                            ORDER BY users.name`);
        pool.close();
        return result.recordsets;
    }
    catch(e){
        console.log(e)
    }
}

async function getBranch(): Promise<any> {
    try{
        let pool: any = await sql.connect(live_config);
        let result: any = await pool.request()
                                    .query(`SELECT address.name
                                            FROM branch
                                                LEFT JOIN address ON branch.branch_id = address.id
                                            WHERE branch.delete_flag <> 'Y'
                                                AND company_id = '001'`);
        pool.close();
        return result.recordsets;
    }
    catch(e){
        console.log(e)
    }
}

module.exports = {
    getLocations: getLocations,
    getLocationInfo: getLocationInfo,
    getBranch: getBranch,
    getName: getName,
}