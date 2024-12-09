const amqp = require('amqplib');

async function sendMessage(emailData) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queue = 'emailQueue';

        // Pastikan queue sudah dibuat
        await channel.assertQueue(queue, { durable: true });

        // Kirim pesan ke queue
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
            persistent: true,
        });

        console.log('Message sent:', emailData);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Contoh penggunaan
sendMessage({
    to: 'sulthan.angka@gmail.com',
    subject: 'Hello RabbitMQ',
    body: 'This is a test email.',
});
