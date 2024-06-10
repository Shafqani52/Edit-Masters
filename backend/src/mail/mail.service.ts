import { Injectable } from '@nestjs/common';
import {render} from "@react-email/render"
import * as nodemailer from "nodemailer";

interface sendMailConfiguration {
    email: string;
    subject: string;
    text?: string;
    template: any;
}

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'mzuhair14m@gmail.com',
                pass: process.env.APP_PASSWORD,
            },
        },
        {
            from : {
                name: "nest email ",
                address: 'test maill',
            },
        },
    );
    }

    private generateEmail = (template) => {
        return render(template);
    }

    async sendMail({email, subject, template}: sendMailConfiguration) {
        const html  = this.generateEmail(template);

        await this.transporter.sendMail({
            to: email,
            subject,
            html,
        });
    }

}
