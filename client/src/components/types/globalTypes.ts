export interface IPO_Header {
    id: number;
    company: string;
    po_num: string;
    vendor_name: string;
    po_date: string;
    placed_by: string;
    ship_date: string;
    ship_via: string;
    email: string;
}

export interface ILocations {
    location_id: number;
    default_branch_id: number;
    Location_PreFix?: string;
    phys_address1: string;
    phys_address2: string;
    phys_city: string;
    phys_state: string;
    phys_postal_code: number;
}

export interface IPO_Line {
    qty: number;
    part_num: string;
    description: string;
    branch: string;
    unit_price: number;
}

export interface INames {
    id: string;
    email_address: string;
    name: string;
}

export interface IBranch {
    name: string;
}