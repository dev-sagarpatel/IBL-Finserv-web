const CryptoJS = require('crypto-js')
const fs = require('fs');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

let _key = CryptoJS.enc.Utf8.parse(process.env.ENC_KEY);
let _iv = CryptoJS.enc.Utf8.parse(process.env.ENC_KEY);

const combineObjectsR = function combineObjectsFunction (obj1, obj2){
    let newObj = {}
    for(let key in obj1){
        if(obj1[key] != null && typeof obj1[key] == 'object'){
            if(obj2.hasOwnProperty(key)){
                newObj[key] = combineObjectsFunction(obj1[key], obj2[key])
            } else {
                for(let k in (obj1[key] || [])){
                    obj1[key][k] = obj1[key][k] || null
                }
                newObj[key] = obj1[key] || null
            }
        } else {
            if(obj2.hasOwnProperty(key)){
                if(typeof obj2[key] == 'string'){
                    newObj[key] = obj2[key].trim() || null
                } else {
                    newObj[key] = obj2[key] || null
                }
            } else {
                if(typeof obj1[key] == 'string'){
                    newObj[key] = obj1[key].trim() || null
                } else {
                    newObj[key] = obj1[key] || null
                }
            }
        }
    }
    return newObj
}

const functions = {
    encrypt: (dataToEncrypt) => {
        return CryptoJS.AES.encrypt(
            dataToEncrypt, _key, {
            keySize: 32,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
    },
    decrypt: (decryptString) => {
        try{
            return CryptoJS.AES.decrypt(
                decryptString, _key, {
                keySize: 32,
                iv: _iv,
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
              }).toString(CryptoJS.enc.Utf8);
        } catch(error){
            console.error(error)
            return false
        }
    },
    Email: class Email{
        createTransporter(){
            /* Creating Mail Transporter */
            this.transporter = nodemailer.createTransport({
                host: this.emailConfig.SMTPHost,
                port : this.emailConfig.SMTPPort,
                auth: {
                    user: this.emailConfig.SMTPUser,
                    pass: this.emailConfig.SMTPPassword
                }
            });
        }
        async initConfig(){
            /* Get Mail Configuration */
            var emailConfig = {};
            let { SMTP } = require('../config/sitesetting.json')
            emailConfig.SMTPHost = SMTP.SMTP_ENDPOINT
            emailConfig.SMTPPort = SMTP.SMTP_PORT
            emailConfig.SMTPUser = SMTP.AWS_ACCESS_KEY_ID
            emailConfig.SMTPPassword = SMTP.AWS_SECRET_ACCESS_KEY
            
            this.emailConfig = emailConfig;
            return this.emailConfig;
        }
        initMail(){
            /* Setting Mail Options */
            this.mailOptions = {
                from: `${this.emailConfig.SMTPFromName} <${this.emailConfig.SMTPFromEmail}>`,//''+this.emailConfig.SMTPFromName+'" <'+this.emailConfig.SMTPFromMail+'>',
                to: this.emailConfig.SMTPToEmail,
                subject: this.emailConfig.SMTPDefaultSubject,
                html: this.template ? this.template : this.setTemplate(this.emailConfig.SMTPDefaultTemplate, {name : 'add_doctor_mail'}).template
            };
        }
        setFromName(name){
            this.emailConfig.SMTPFromName = name;
        }
        setFromEmail(email){
            this.emailConfig.SMTPFromEmail = email;
        }
        setTemplate(name, data){
            var path = process.env.INIT_CWD+`/mailTemplates/${name}.ejs`;
            try {       
                if (fs.existsSync(path)) {
                    var templateLocal = null;
                    ejs.renderFile(path, data, [], (err, html) => {
                        if(err){
                            console.error(err);
                            return false;
                        }
                        templateLocal = html;
                    })
                    this.template = templateLocal;
                } else {
                    this.template = null;
                }
            } catch(err) {
                this.template = null;
                console.error(err);
            }
            return this;
        }
        setToMail(email){
            if(email){
                this.emailConfig.SMTPToEmail = email;
            }
            return this;
        }
        setSubject(subject){
            if(subject){
                this.emailConfig.SMTPDefaultSubject = subject;
            }
            return this;
        }
    
        send(){
            this.createTransporter();
            this.initMail();
    
            /* Sending Mail */
            // console.log("mailOption", this.mailOptions);
            const email = this;
            this.transporter.sendMail(this.mailOptions, function(error, info){
                if (error) {
                    email.error = error;
                    console.error(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return this;
        }
    },
    combineObjectsR
 }

framework.core = {}
framework.core.functions = functions
module.exports = functions