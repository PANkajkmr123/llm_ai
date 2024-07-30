import axios from 'axios';
import moment from 'moment-timezone';
import nodemailer from 'nodemailer';



function identityGenerator(count: number, padding: string) {
    var c = count + 1;
    var str = "" + c;
    var pad = "0000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    var m = new Date();
    var mm = m.getMonth() + 1;
    var yy = m.getFullYear();
    var dd = m.getDate();
    var theID = (padding + "" + yy + "" + mm + "" + dd + "" + ans);
    return theID
}



function getEpochAfterNMinutes(n: any) {
    if (n == 0) {
        return Math.round(moment.utc().valueOf() / 1000)
    } else {
        const time: any = moment.utc().add(n, 'minutes')
        return Math.round(time / 1000)
    }
}

function randomString(length: number, chars: string) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('~') > -1) mask += '~!@*&$';
    var result = '';

    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result.toString();
}



function numberFormatter(num: any, digits = 1) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    if (num > 1)
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    else
        return num.toFixed(digits)
}



function sendEmail(data: any) {
    var smtpTransport = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'chatbotaitecorb@gmail.com',
            pass: 'avgvbwlxkxhpqsww'
        }
    });
    var mailOptions = {
        to: data.email,
        from: "chatbotaitecorb@gmail.com",
        subject: data.subject,
        // text: data.message,
        html: data.message
    };
    smtpTransport.sendMail(mailOptions, function (err:any) {
        if (err) {
            console.log(err);
        }
    })
}



export {
    identityGenerator,
    getEpochAfterNMinutes,
    randomString,
    numberFormatter,
}