const line = require("@line/bot-sdk");
const express = require("express");

const config = {
  channelSecret: "b3142c388a9876d34955311a9f47d1b8",
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: "DV6AKWVF3pSviT3a/tmoG5sgkuOB64tbJTxtOh70SjPoYnSkgda+Wsa/kjmNmD/1SOwtU470xRN5pHnk3/UBOiRYAhwGufQanmmvDzGE9gmA1NtqpWDciF6dO64NvJpYwMByzKZQODaqzrkyKpft0gdB04t89/1O/w1cDnyilFU=",
});

const app = express();

app.post("/callback", line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  //const payload = { type: "text", text: event.message.text };
  var inputMessage = event.message.text;
  var payload = {};

  if (inputMessage == "ส่ง P4P") {
    console.log("ส่ง P4P");
    payload =
    {
      type: "carousel",
      contents: [
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "First bubble"
              }
            ]
          }
        },
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Second bubble"
              }
            ]
          }
        }
      ]
    };
  }
  else if (inputMessage == "ประวัติการส่ง") {
    payload = {
      "type": "template",
      "altText": "this is a confirm template",
      "template": {
        "type": "confirm",
        "text": "Are you sure?",
        "actions": [
          {
            "type": "message",
            "label": "Yes",
            "text": "yes"
          },
          {
            "type": "message",
            "label": "No",
            "text": "no"
          }
        ]
      }
    }
  }
  else if (inputMessage == "งานอื่น ๆ") {
    payload = { type: "text", text: event.message.text };
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [payload],
  });
}

const port = 8080;
app.listen(port, () => {
  console.log("listening on port " + port)
});
