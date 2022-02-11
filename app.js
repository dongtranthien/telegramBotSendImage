const TelegramBot = require('node-telegram-bot-api');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const { Readable } = require('stream');


const width = 400; //px
const height = 200; //px
const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});
var image;
function saveFile(){
  fs.writeFile('./example.png', image, ()=>{
    console.log("Done")
  });
}
(async () => {
  const configuration = {
    type: 'bar',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255,99,132,1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
		},
		plugins: [{
			id: 'background-colour',
			beforeDraw: (chart) => {
				const ctx = chart.ctx;
				ctx.save();
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, width, height);
				ctx.restore();
			}
		}]
  };
  image = await chartJSNodeCanvas.renderToBuffer(configuration);
  const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
  const stream = chartJSNodeCanvas.renderToStream(configuration);
  saveFile()
  console.log(image);
})();
// replace the value below with the Telegram token you receive from @BotFather
const token = 'token';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});


bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  console.log(chatId);
  // photo can be: a file path, a stream or a Telegram file_id
  var photo = 'example.png';
  bot.sendPhoto(chatId, photo, {caption: 'chart'});
});