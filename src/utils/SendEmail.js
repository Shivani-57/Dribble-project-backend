import {Resend} from 'resend';
import {RESEND_API_KEY} from '../config.js'
const api_key = RESEND_API_KEY
console.log("API key: " + api_key)
const resend = new Resend("re_QXFeMMFr_JVFSwbGzhKFvJpo9QuqSoPfX")

const sendEmail = async ({receiverMail}) => {
    try {
        const data = await resend.emails.send({
            from: 'Shivani <sutrejashivani57@gmail.com>',
            to: [{receiverMail}],
            subject: 'Subject of the Email',
            html: '<p>Body of the Email</p>'
        });

        console.log("Email sent:", data);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export {sendEmail}