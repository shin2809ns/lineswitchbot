'use strict';

const config = {
  channelAccessToken: 'dUJO60WzOtqXEVs8puUkmij+KubobW4XNt9seyWqOXbEZAhOUCmR47pZPTg7TpmC3AwutBGs9peo/eyCbVheJ/VMu54KJm/cWYNEBxwfJzl2PFtbUVY5IMobrPKFukEehWujgQXF7yqPUTtmMMpkeAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '1c41ec5b3ef855795a9d2c8f9bcea70a',
};
const SWITCHBOT_OPENTOKEN = "9b45c970d842127e85c2cc15ab80996e33d4213a6d63beb6a08c3a044c0951231d97ffb8d76518b91a2fa6a7bd7b1e2a";


const HELPER_BASE = process.env.HELPER_BASE || '../../helpers/';
const LineUtils = require(HELPER_BASE + 'line-utils');
const line = require('@line/bot-sdk');
const app = new LineUtils(line, config);


const SwitchBot = require('./switchbot');
const switchbot = new SwitchBot(SWITCHBOT_OPENTOKEN);

switchbot.getDeviceList()
.then(json =>{
  console.log(json);
});

const command_list = [
  {
    disp: "電気オン",
    deviceId: "68B6B372FE8E",
    commandType: "command",
    command: "turnOn",
    parameter: "default"
  },
  {
    disp: "電気オフ",
    deviceId: "68B6B372FE8E",
    commandType: "command",
    command: "turnOff",
    parameter: "default"
  },
];

app.message(async (event, client) =>{
  console.log(event);

  var command = command_list.find(item => event.message.text.indexOf(item.disp) >= 0 );
  if( command ){
    var message = await processCommand(app, command);
    return client.replyMessage(event.replyToken, message);
  }else{
    var message = { type: 'text', text: event.message.text + ' ですね。' };
    message.quickReply = makeQuickReply(app);
    return client.replyMessage(event.replyToken, message);
  }
});

app.postback(async (event, client) =>{
  var command = command_list.find(item => item.disp == event.postback.data);
  var message = await processCommand(app, command);
  return client.replyMessage(event.replyToken, message);
});



function makeQuickReply(app){
  var list = [];
  command_list.forEach((item)=>{
    list.push({
      title: item.disp,
      action: {
        type: "postback",
        data: item.disp
      }
    });
  });
  var quickReply = app.createQuickReply(list);
  return quickReply;
}

exports.fulfillment = app.lambda();
