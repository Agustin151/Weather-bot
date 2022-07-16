const { Telegraf } = require("telegraf");
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const TOKENWEATHER = process.env.TOKENWEATHER;
const bot = new Telegraf(TOKEN);
const axios = require("axios");

bot.start((ctx) => {
  ctx.reply(
    `Hello ${ctx.from.first_name}.I am Weather Bot and I will give you info on the climate of any city, for that enter "climate"`
  );
});

bot.hears("climate", (ctx) => {
  ctx.reply(
    "We are ready to start write 1 hyphen plus the name of the city. Ej: 1-londres"
  );
});

bot.hears("thanks", (ctx) => {
  ctx.reply(
    "We are at your orders, thanks to you for choosing us. Greetings from your favorite Weather Bot."
  );
});

bot.on("text", async (ctx) => {
  const message = ctx.message.text;
  if (message.includes("1-") && message.length > 4) {
    let city = message.substring(2);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${TOKENWEATHER}`
      )
      .then((response) => {
        const temp = response.data.main.temp - 273.15;
        ctx.reply(
          `The climatic conditions of ${city}, are ${
            response.data.weather[0].description
          }.
Temp: ${Math.round(temp)}ºC / Humidity: ${
            response.data.main.humidity
          }% / Wind speed: ${response.data.wind.speed}m/s. / Clouds: ${
            response.data.clouds.all
          }% `
        );
      })
      .catch((error) => {
        console.log(error);
        ctx.reply("No info found for that city, try again.");
      });
  } else {
    ctx.reply(`Hello ${ctx.from.first_name}.
I am Weather Bot and I will give you info on the climate of any city, for that enter "climate"`);
  }
});
bot.launch();
