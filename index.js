const ViberBot = require("viber-bot").Bot,
  BotEvents = require("viber-bot").Events,
  TextMessage = require("viber-bot").Message.Text,
  express = require("express");

const PictureMessage = require("viber-bot").Message.Picture;

const QRCode = require("easyqrcodejs-nodejs");

var options = {
  // ====== Basic
  text: "https://github.com/ushelp/EasyQRCodeJS",
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H

  // ====== dotScale
  /*
  dotScale: 1, // For body block, must be greater than 0, less than or equal to 1. default is 1
      
  dotScaleTiming: 1, // Dafault for timing block , must be greater than 0, less than or equal to 1. default is 1
  dotScaleTiming_H: undefined, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
  dotScaleTiming_V: undefined, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1
      
  dotScaleA: 1, // Dafault for alignment block, must be greater than 0, less than or equal to 1. default is 1
  dotScaleAO: undefined, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
  dotScaleAI: undefined, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1
  */

  // ====== Quiet Zone
  /*
  quietZone: 0,
  quietZoneColor: "rgba(0,0,0,0)",
  */

  // ====== Logo
  /*
  logo: "../demo/logo.png", // Relative address, relative to `easy.qrcode.min.js`
  logo: "http://127.0.0.1:8020/easy-qrcodejs/demo/logo.png", 
  logoWidth: 80, // fixed logo width. default is `width/3.5`
  logoHeight: 80, // fixed logo height. default is `heigth/3.5`
  logoMaxWidth: undefined, // Maximum logo width. if set will ignore `logoWidth` value
  logoMaxHeight: undefined, // Maximum logo height. if set will ignore `logoHeight` value
  logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
  logoBackgroundTransparent: false, // Whether use transparent image, default is false
  */

  // ====== Backgroud Image
  /*
  backgroundImage: '', // Background Image
  backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1. 
  autoColor: false, // Automatic color adjustment(for data block)
      autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
      autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color
  */

  // ====== Colorful
  // === Posotion Pattern(Eye) Color
  /*
  PO: '#e1622f', // Global Posotion Outer color. if not set, the defaut is `colorDark`
  PI: '#aa5b71', // Global Posotion Inner color. if not set, the defaut is `colorDark`
  PO_TL:'', // Posotion Outer color - Top Left 
  PI_TL:'', // Posotion Inner color - Top Left 
  PO_TR:'', // Posotion Outer color - Top Right 
  PI_TR:'', // Posotion Inner color - Top Right 
  PO_BL:'', // Posotion Outer color - Bottom Left 
  PI_BL:'', // Posotion Inner color - Bottom Left 
  */
  // === Alignment Color
  /*
  AO: '', // Alignment Outer. if not set, the defaut is `colorDark`
  AI: '', // Alignment Inner. if not set, the defaut is `colorDark`
  */
  // === Timing Pattern Color
  /*
  timing: '#e1622f', // Global Timing color. if not set, the defaut is `colorDark`
  timing_H: '', // Horizontal timing color
  timing_V: '', // Vertical timing color
  */

  // ====== Title
  /*
  title: 'QR Title', // content 
  titleFont: "normal normal bold 18px Arial", //font. default is "bold 16px Arial"
  titleColor: "#004284", // color. default is "#000"
  titleBackgroundColor: "#fff", // background color. default is "#fff"
  titleHeight: 70, // height, including subTitle. default is 0
  titleTop: 25, // draws y coordinates. default is 30
  */

  // ====== SubTitle
  /*
  subTitle: 'QR subTitle', // content
  subTitleFont: "normal normal normal 14px Arial", // font. default is "14px Arial"
  subTitleColor: "#004284", // color. default is "4F4F4F"
  subTitleTop: 40, // draws y coordinates. default is 0
  */

  // ===== Event Handler
  /*
  onRenderingStart: undefined,
  */

  // ==== Images format
  /*
  format: 'PNG', // 'PNG', 'JPG'
  compressionLevel: 6, // ZLIB compression level (0-9). default is 6
  quality: 0.75, // An object specifying the quality (0 to 1). default is 0.75. (JPGs only) 
  */

  // ==== Versions
  /*
  version: 0, // The symbol versions of QR Code range from Version 1 to Version 40. default 0 means automatically choose the closest version based on the text length.
  */

  // ===== Binary(hex) data mode
  /*
  binary: false // Whether it is binary mode, default is text mode. 
  */
};

const app = express();

/*if (!process.env.BOT_ACCOUNT_TOKEN) {
  console.log('Could not find bot account token key.');
  return;
}
if (!process.env.EXPOSE_URL) {
  console.log('Could not find exposing url');
  return;
}*/

const bot = new ViberBot({
  authToken: "4ddb8b6d5ca7ddbf-86d1772a758fef0d-4a1f4580b44006b5",
  name: "QR",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png",
});
bot.on(BotEvents.SUBSCRIBED, (response) => {
  response.send(
    new TextMessage(
      `Здравствуйте ${response.userProfile.name}. Я бот  ${bot.name}! Спасибо за подписку`
    )
  );
});
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  if (message.text === "QR") {
    options.text = response.userProfile.id;
    let qrCode = new QRCode(options);
    let url = response.userProfile.name + '.png';

    console.log(url);

    qrCode.saveImage({path:url});

    let pictureMessage = new PictureMessage(qrCode.toDataURL());
    response.send(new TextMessage("Ваш QR КОД:"));
    let url_send = 'https://denscan.belsap.com/qr/' + url;
    console.log(url_send);
    response.send(new PictureMessage(url_send));
  }
});
const port = process.env.PORT || 3000;
app.use("/viber/webhook", bot.middleware());
app.listen(port, () => {
  console.log(`Application running on port: ${port}`);
  bot
    .setWebhook(`https://5032-46-56-85-155.ngrok.io/viber/webhook`)
    .catch((error) => {
      console.log("Can not set webhook on following server. Is it running?");
      console.error(error);

      process.exit(1);
    });
});
