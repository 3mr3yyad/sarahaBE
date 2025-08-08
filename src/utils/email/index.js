import nodemailer from "nodemailer";

export async function sendEmail({to, subject, html}) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "3mr3yyad@gmail.com",
            pass: "itmd tebq rhxl sdtk"
        }
    });
    await transporter.sendMail({
        from: "'Saraha app' <3mr3yyad@gmail.com>",
        to,
        subject,
        html
    })
}
