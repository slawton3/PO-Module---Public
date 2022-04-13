const nodemailer = require('nodemailer');

interface IMailConfig {
    host: string;
    port: number;
    secure: boolean;
    tls: {
        rejectUnauthorized: boolean;
    }
}

class Mailer {
    
    private data;
    private user;
    private transport;
    private config: IMailConfig 

    constructor() {
        this.transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    public generateMail(stream, header) {
        const mailOptions = {
            from: 'slawton@weimerbearing.com',
            to: header.email,
            subject: 'Non Inventory Purchase Order',
            text: 'Non Inventory Purchase Order Request',
            attachments: [{
                filename: `${header.po_num}.pdf`,
                content: stream,
                contentType: 'application/pdf'
            }]
        };
        return mailOptions;
    }

    public sendMail(stream, header) {
        const email = this.generateMail(stream, header);
        this.transport.sendMail(email, (err, info) => {
            if(err) {
                console.log(err);
            }
            console.log('Email Sent. ' + info);
        });

    }
}

export default Mailer;