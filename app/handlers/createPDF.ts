import { PDFData } from "../types/interfaces";

const fs = require('fs');
const PDFDocument = require('pdfkit');

class CreatePDF{

    private data;
    private image;
    private locationInfo;

    constructor(data: any, image: any, locationInfo: any){
        this.data = data;
        this.image = image;
        this.locationInfo = locationInfo;
    }
   
    private generateHeader(doc, image, data, locationInfo) {
        let locName: string;
        if(locationInfo[0].location_name.includes('-')){
            locName = locationInfo[0].location_name.split("-")[0];
        }
        else{
            locName = locationInfo[0].location_name;
        }
        let buffer = Buffer.from(image, 'base64')
        doc.image(buffer, 10, 45, { width: 100 })
            .fillColor('#444444')
            .fontSize(20)
            .text(locName, 110, 57)
            .fontSize(10)
            .text(locationInfo[0].phys_address1, 200, 65, { align: 'right' })
            .text(`${locationInfo[0].phys_city}, ${locationInfo[0].phys_state}, ${locationInfo[0].phys_postal_code}`, 200, 80, { align: 'right' })
            .moveDown();
    }
    
    private generateFooter(doc) {
        let locName: string;
        if(this.locationInfo[0].location_name.includes('-')){
            locName = this.locationInfo[0].location_name.split("-")[0];
        }
        else{
            locName = this.locationInfo[0].location_name;
        }
        const year = new Date();
        doc.fontSize(
            10,
        ).text(
            'Copyright '+ year.getFullYear() + " - " + locName,
            50,
            730,
            { align: 'center', width: 500 },
        );
    }

    private formatCurrency(cents) {
        return "$" + (cents / 100).toFixed(2);
      }
    
    private generateCustomerInformation(doc, po) {
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Non Inventory Purchse Order", 50, 160);

        this.generateHr(doc, 185);
        const customerInformationTop = 200;
    
        doc
            .fontSize(10)
            .text("PO Number:", 50, customerInformationTop)
            .font("Helvetica-Bold")
            .text(po.header.po_num, 150, customerInformationTop)
            .font("Helvetica")
            .text("PO Date:", 50, customerInformationTop + 15)
            .text(po.header.po_date, 150, customerInformationTop + 15)
            .text("Grand Total:", 50, customerInformationTop + 30)
            .text("$" +
            Math.round((po.grandTotal + Number.EPSILON) * 100) / 100,
            150,
            customerInformationTop + 30
            )

            .font("Helvetica-Bold")
            .text(po.header.vendor_name, 300, customerInformationTop)
            .font("Helvetica")
            .text(po.header.ship_date, 300, customerInformationTop + 15)
            .text(po.header.ship_via,
            300,
            customerInformationTop + 30
            )
            .moveDown();
        this.generateHr(doc, 252);
    }
    
    private generateTableRow(doc, y, c1, c2, c3, c4, c5) {
        doc.fontSize(10)
            .text(c1, 50, y)
            .text(c2, 150, y)
            .text(c3, 280, y, { width: 90, align: 'right' })
            .text(c4, 370, y, { width: 90, align: 'right' })
            .text(c5, 0, y, { align: 'right' });
    }
    private generateHr(doc, y) {
        doc
          .strokeColor("#aaaaaa")
          .lineWidth(1)
          .moveTo(50, y)
          .lineTo(550, y)
          .stroke();
      }
    
    private generateInvoiceTable(doc, po) {
        let i,
            poTableTop = 285;
        doc.font("Helvetica-Bold");
        this.generateTableRow(
            doc,
            poTableTop,
            "Quantity",
            "Part Number",
            "Unit Description",
            "Unit Price",
            "Line Total"
        );
        this.generateHr(doc, poTableTop + 20)
        doc.font("Helvetica-Bold");
    
        for (i = 0; i < po.lines.length; i++) {
            const item = po.lines[i];
            const position = poTableTop + (i + 1) * 40;
            
            this.generateTableRow(
                doc,
                position,
                item.qty,
                item.part_num,
                item.description,
                item.unit_price,
                "$"+Math.round(((item.qty * item.unit_price) + Number.EPSILON) * 100) / 100,
            );
            this.generateHr(doc, position + 30);
        }

    }

    public generate(dataCallback, endCallback) {

        let doc = new PDFDocument({ margin: 50 });
        doc.on('data', dataCallback)
        doc.on('end', endCallback)
    
        const fileName: string = `pdf/${this.data.header.po_num}.pdf`;
        const stream = fs.createWriteStream(fileName);
    
        this.generateHeader(doc, this.image, this.data, this.locationInfo);
        this.generateCustomerInformation(doc, this.data);
        this.generateInvoiceTable(doc, this.data);
        this.generateFooter(doc);

        
        
        doc.pipe(stream);
    
        doc.end();
        return stream;
    }
}

    

export default CreatePDF;