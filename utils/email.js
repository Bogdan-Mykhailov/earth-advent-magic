'use strict';

import nodemailer from 'nodemailer';
import { ENV_MODE } from './constants.js';
import pug from 'pug';
import { convert } from 'html-to-text';
import  path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Bogdan Mykhailov <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === ENV_MODE.PROD) {
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        auth: {
          user: process.env.BREVO_LOGIN,
          pass: process.env.BREVO_PASSWORD
        }
      })
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // send the actual email
    // 1 render html based on a pug template
    const currentFile = fileURLToPath(import.meta.url);
    const templatePath = path.join(dirname(currentFile), `/../views/email/${template}.pug`);
    const html = pug.renderFile(templatePath, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2 define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(html),
      // text: htmlToText.fromString(html),
      html
    };

    // 3 create a transport and send email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Earth Adventurers family!')
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}
