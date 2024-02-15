const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 5000;
const PAGE_ACCESS_TOKEN = 'EAANAFtbHmZB4BO4a0vWqS8DSVqxX8E1nRNBTUnr3SSClUBeHI3MOzgObkSPOZCU7qcIckwDMWZCNdQhZClInMa7hbUfTLvlCGt2cP8n3tElAoic89oKHZCOielwZBJ6EqrWgDPQntXYp9h0eAvKz5XBNEK4ybaCfKn7ZCtRDNG0xdamOn0kt4oG2z0w1mwB6iprNHUXAd6x5tdUHRxPgryrnXdLeQ4ZD';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = 'OaF9gflvoW@';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            let webhookEvent = entry.messaging[0];
            console.log(webhookEvent);

            let senderId = webhookEvent.sender.id;
            if (webhookEvent.message) {
                let messageText = webhookEvent.message.text;
                sendTextMessage(senderId, messageText);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

function sendTextMessage(senderId, messageText) {
    let messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: messageText
        }
    };

    request({
        uri: 'https://graph.facebook.com/v12.0/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log('Message sent successfully');
        } else {
            console.error('Failed to send message:', error);
        }
    });
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
