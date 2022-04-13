import { Response, Request, NextFunction } from 'express';

export interface IPO_Header {
    id: Number;
    company: string;
    po_num: string;
    vendor_name: string;
    po_date: string;
    placed_by: string;
    ship_date: string;
    ship_via: string;
    email: string;
}

export interface IPO_Line {
    qty: number;
    part_num: string;
    description: string;
    branch: string;
    unit_price: number;
}

export interface IConfig {
    user: string;
    password: string;
    server: string; // You can use 'localhost\\instance' to connect to named instance
    database: string;
    options: {
        encrypt: boolean;
        trustServerCertificate: boolean;
    }
}


export interface PDFData {
    header: {
      id: number,
      company: string,
      po_num: string,
      vendor_name: string,
      po_date: string,
      placed_by: string,
      ship_date: string,
      ship_via: string,
      email: string
    },
    lines: [
      {
        qty: number,
        part_num: string,
        description: string,
        branch: string,
        unit_price: number
      }
    ]
    grandTotal: number
}