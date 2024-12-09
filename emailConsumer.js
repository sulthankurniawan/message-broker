const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function receiveMessages() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queue = 'emailQueue';

        await channel.assertQueue(queue, { durable: true });

        console.log('Waiting for messages in queue:', queue);

        channel.consume(queue, async (message) => {
            if (message !== null) {
                const emailData = JSON.parse(message.content.toString());
                console.log('Received message:', emailData);

                await sendEmail(emailData);

                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Error receiving messages:', error);
    }
}

async function sendEmail({ to, subject, body }) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sulthan.kurniawan@gmail.com',
                pass: '', // Ganti dengan App Password google
            },
        });

        const mailOptions = {
            from: 'sulthan.kurniawan@gmail.com',
            to,
            subject,
            text: body,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Jalankan consumer
receiveMessages();
