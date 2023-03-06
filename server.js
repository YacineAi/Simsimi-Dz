const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const Botly = require("botly");
const botly = new Botly({
  accessToken: process.env.PAGE_ACCESS_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
  webHookPath: process.env.WB_PATH,
  notificationType: Botly.CONST.REGULAR,
  FB_URL: "https://graph.facebook.com/v2.6/"
});
const { value } = require("pb-util");
const { struct } = require("pb-util");
const uuid = require("uuid");
const projectId = "simsimidz-stable-imbj";
const sessionId = uuid.v4();
const dialogflow = require("dialogflow");
const config = {
  credentials: {
    private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnd27Z6iuJLSP6\nEd/DVQYOzSesK9WBy9Bu2dIa/htD42nlRmljldkXybKIkRiv+h/KbJT+Cr5BTWty\n3nfaaNWgdljiWVNP3gxyVf9m7skiuwrDo9PnNToFa6AQ/UwrkUII8SrlDyK0rmjH\nLm6ggQLvOf9Z78g9cPS4agtHJbPK2qrCrFKDjzUDLfq8aldOQB+5vtLREzJoORyA\nzyl6hLv1+NtxOaNzcb0kru7pX1ITslwFh6LE9S+DzjZV5bZW7ZqvFdDODCr1wY2C\n8SAZ2WZF4n4nIZs0YpAcmUYlZTieik0CooN8r40Y83uXEBtC8XMn0hX0+3AxMJTQ\nhkio8W4ZAgMBAAECggEABdSjloK6eG0ZCAPjvo27uSZtNrzv9olhNcHvuI1QWUL5\nuHK9z7jsWLwfsy39pg2JIWBy4VOq36st8aSSl7OwfGhpjg1FO/jchhPob6bNItlQ\nSxMKCwcz1fOWqqtuIbYxcfHQEr0hgDVkHPXlV7MJwqxKRQoFEzPlX5EDZxCGURxf\nPZS05ndFlNtFdUi7yKBBY0C0bE2d0kV1mzzqS1/cf0Cxmd4dDhV0twDfZpN+VD22\nHx7xl7yNHRYBGRL+Zij7BrjXqx/gPSGdZDSXlhhEhHufthQ9vmEfsp1Glvj0Mbqs\nhgOTgLr8CQ5v2TXwLgvh61AfUB12mwR/StkMcs2A4QKBgQDc35SLuHYIS+OIPdOp\nFAPrRPVMyoxLarB5R21biEpPj5KQLEzwHG9QvByOlQTMFTK03Z1nXrru3LWVOdpo\nakpQNXsyAFaLUuBS9arqGRxQZYUl6VFxvpn9lrJiFoP8G4R0wT0k2pLyAOaeqn/P\n6CLoOV1lBWFGrLXFp7CI3VHVWwKBgQDCGYADK91IecNbMhnm0d28ltvPXI/wRxBH\ny7LCvobtvvkyP97cDmzq3G0oWDequTvF1BMKSDfpzlaQdXB8qrAfU5KfjiJymJlw\n8sYI7IKmvvCrhawH227VhPHs2yws2k+9QHy8MWPf83jdqWV0fnPLchD36keINFmK\nUkiDufPAmwKBgQCEsfofewHGeDlJZ8Oax8CW/wXUTbe9s2o0YporrJTgeaQW49aR\nRrQFsA4EBzkrluywxpfDO6FY0dZxwaEarAjbaVYLMzLLX04P6TH2lIFzN5qnrSXW\nDSmctYWT8mz28F1Ce7nNQ1eW9r2Ww14oPRGDrLsUbwgDGs3V4qnnf/ejEwKBgH4K\nSwtEJ6yRjR8iGJm/fAqjt9cel0WDD/pfNxSo3jtyQKW1vgUNxQJ54tRI/NT69eqP\nvVF29f/4glPKPyJlQHsHLPY5OPtLRpCGxbwzwN+ArA3lfoGXp5A1hVe2NyhlF1Sg\nlJ8sP1vE4Z6nCn+sQYtB5eznEE5NGDvvFLGdRcCzAoGAevozOzPx1iV/nIqQ4m9O\ncv9itdYpDg8s6wACLj6CBzvGMP59ciGzPH8p/5dUqVXBYuaTm56gS87Z0DTCcPbK\nyJnFDZtGoHjplCO0HkTDjBE7J6rknd3nqiscpmJlxQ/lWppFtYjY4vzfxocPJRO4\n5WIgDifBkji3UeLlOL3VpeY=\n-----END PRIVATE KEY-----\n",
    client_email: "admin007@simsimidz-stable-imbj.iam.gserviceaccount.com"
  }
};
const sessionClient = new dialogflow.SessionsClient(config);
app.get("/", function(req, res) {
  res.send("Simsimi is UP!");
});
app.use(
  bodyParser.json({
    verify: botly.getVerifySignature(process.env.APP_SECRET)
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/webhook", botly.router());
botly.on("message", (senderId, message, data) => {
const sessionPath = sessionClient.sessionPath(projectId, senderId);
  if (message.message.text) {
    const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message.message.text,
        languageCode: "en-US"
      }
    }
  };
    sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      if (result.fulfillmentText) {
    botly.sendText({id: senderId, text: result.fulfillmentText});
} else if (result.fulfillmentMessages[0].payload) {
  var obj = struct.decode(result.fulfillmentMessages[0].payload);
  eval(obj.value);
}});
    } else if (message.message.attachments[0].payload.sticker_id) {
    const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: "5tick3r",
        languageCode: "en-US"
      }
    }
  };
    sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      if (result.fulfillmentText) {
      botly.sendText({id: senderId, text: result.fulfillmentText});
      } else if (result.fulfillmentMessages[0].payload) {
        var obj = struct.decode(result.fulfillmentMessages[0].payload);
        eval(obj.value);
      }});
    } else if (message.message.attachments[0].type == "image") {
      const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: "1mage",
        languageCode: "en-US"
      }
    }
  };
    sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      if (result.fulfillmentText) {
      botly.sendText({id: senderId, text: result.fulfillmentText});
      } else if (result.fulfillmentMessages[0].payload) {
        var obj = struct.decode(result.fulfillmentMessages[0].payload);
        eval(obj.value);
      }});
    } else if (message.message.attachments[0].type == "audio") {
      const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: "mp3aud",
        languageCode: "en-US"
      }
    }
  };
    sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      if (result.fulfillmentText) {
      botly.sendText({id: senderId, text: result.fulfillmentText});
      } else if (result.fulfillmentMessages[0].payload) {
        var obj = struct.decode(result.fulfillmentMessages[0].payload);
        eval(obj.value);
      }});
    } else if (message.message.attachments[0].type == "video") {
      const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: "mp4vid",
        languageCode: "en-US"
      }
    }
  };
    sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      if (result.fulfillmentText) {
      botly.sendText({id: senderId, text: result.fulfillmentText});
      } else if (result.fulfillmentMessages[0].payload) {
        var obj = struct.decode(result.fulfillmentMessages[0].payload);
        eval(obj.value);
      }});
    }
});
botly.on("postback", (senderId, message, postback, data, ref) => {
    if (postback = "GET_STARTED"){
      botly.sendText({id: senderId, text: "Welcome to Simsimi! 😻💜 Start chatting with me about anything you want... 😸🙈"});
  } else if (postback = ""){
  } else {
  }
});
////// ADD-ONs /////
botly.setGetStarted({pageId: "325798925020867", payload: "GET_STARTED"});
botly.setGreetingText({
    pageId: "325798925020867",
    greeting: [
      {
        locale: "default",
        text: "Welcome to Simsimi 🔥, 𝓦𝓮 𝓬𝓾𝓼𝓽𝓸𝓶𝓲𝔃𝓮 𝓸𝓾𝓻 𝓸𝔀𝓷 𝓻𝓮𝓪𝓵𝓲𝓽𝔂 𝓱𝓮𝓻𝓮! 🌙↗️"
      },
      {
        locale: "ar_AR",
        text: "مرحبا بك في سمسمي 🔥. هنا تصنع أحلامنا و تتجسد للواقع 🌙↖️"
      }
    ]
  });
////// ADD-ONs //////
app.listen(process.env.PORT || port, () => console.log(`App is on port : ${port}`));
