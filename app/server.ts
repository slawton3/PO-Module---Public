import {Express, Request, Response} from "express";
import * as path from 'path';
import express from 'express'
import axios from 'axios';
const getHandlers = require('./handlers/getHandlers'); 
const postHandlers = require('./handlers/postHandlers');
const devGetHandlers = require('./handlers/getDevHandlers');
const printHandlers = require('./handlers/printHandler');
import Mailer from './handlers/emailHandler';
import {Blob} from 'node:buffer';
const fs = require('fs');

export class Server {

    private app: Express;

    constructor(app: Express) {
        this.app = app;
        this.app.use(express.json());
        this.app.use(express.urlencoded());
    
        this.app.use(express.static(path.resolve("./") + "/build/client"));
        var dir = path.join(__dirname, 'public')
        this.app.use(express.static(dir));
    
        this.app.get("/locations", (req: Request, res: Response): void => {
            getHandlers.getLocations().then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.get("/locations/:id", (req: Request, res: Response): void => {
            getHandlers.getLocationInfo(req.params.id).then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.get("/header/:id", (req: Request, res: Response): void => {
            devGetHandlers.getHeader(req.params.id).then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.get("/search/:id", (req: Request, res: Response): void => {
            devGetHandlers.getHeaderSearch(req.params.id).then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.get("/lines/:id", (req: Request, res: Response): void => {
            console.log(req.params.id);
            devGetHandlers.getLines(req.params.id).then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.get("/name", (req: Request, res: Response): void => {
            getHandlers.getName().then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.get("/branch", (req: Request, res: Response): void => {
            getHandlers.getBranch().then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.post("/header", (req: Request, res: Response): void => {
            let header = { ...req.body };
            postHandlers.addHeader(header).then(data => {
                return res.json(data[0]);
            })
            .catch(err => console.log(err));
        });

        this.app.post("/lines", (req: Request, res: Response): void => {
            let lines = [ ...req.body ];
            postHandlers.addline(lines).then(data => {
                return res.json({success: true});
            })
            .catch(err => console.log(err))
        });

        this.app.post("/print", (req: Request, res: Response): void => {
            //endpoint creates a pdf in memory and sends it to the browser via byte stream
            //also saves the pdf in the /pdf folder
            const header = { ...req.body };
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
                'Content-Disposition': 'attachment; filename='+header.po_num+'.pdf'
            });
            const dataCallback = (chunk) => {
                stream.write(chunk);
            }
            printHandlers.execute(header, dataCallback, () => {stream.end()})
            .then((data) => console.log(data))
            .catch(err => console.log(err));
        })

        this.app.post("/email", (req: Request, res: Response): void => {
            //gets pdf from the folder and sends email to recipient in list
            const header = { ...req.body };
            const pdf = fs.readFileSync(`./pdf/${header.po_num}.pdf`);
            try{
                let mail = new Mailer();
                let arr = header.email.split(",");
                let obj = {};
                obj["po_num"] = header.po_num;
                for(let i = 0; i < arr.length; i++){
                    obj["email"] = arr[i];
                    mail.sendMail(pdf, obj);
                }
                
                res.send({success: "Email sent!"});
            }
            catch(err){
                res.send(err);
            }
        })
    
        this.app.get("*", (req: Request, res: Response): void => {
            res.sendFile(path.resolve("./") + "/build/client/index.html");
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }

}