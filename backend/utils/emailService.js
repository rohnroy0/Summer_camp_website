const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const sendConfirmationEmail = async (participantInfo) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Use ticketId if available, fallback to _id
        const identifier = participantInfo.ticketId || participantInfo._id.toString();

        // Generate QR code as Base64 Data URL
        const qrCodeDataUrl = await QRCode.toDataURL(identifier);

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Tech Event Team" <no-reply@techevent.com>',
            to: participantInfo.email,
            subject: 'Event Registration Confirmation & QR Pass',
            html: `
                <h2>Registration Confirmed!</h2>
                <p>Dear ${participantInfo.name},</p>
                <p>Thank you for registering for the <strong>Summer School 2026</strong>. Your payment has been successfully processed.</p>
                <p><strong>Registration Details:</strong></p>
                <ul>
                    <li><strong>Ticket ID:</strong> ${identifier}</li>
                    <li><strong>Transaction ID:</strong> ${participantInfo.transactionId || 'N/A'}</li>
                </ul>
                <p>Please present the QR Code pass below at the check-in desk:</p>
                <img src="cid:qrcode" alt="QR Pass" style="width: 200px; height: 200px; border: 1px solid #ccc; border-radius: 8px;" />
                <p>We look forward to seeing you at the event.</p>
                <p>Best Regards,</p>
                <p>Tech Event Organizers</p>
            `,
            attachments: [
                {
                    filename: 'qr-pass.png',
                    path: qrCodeDataUrl,
                    cid: 'qrcode' // same cid value as in the html img src
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendConfirmationEmail };
