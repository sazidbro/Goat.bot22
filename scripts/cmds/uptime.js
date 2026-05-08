const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up", "rtm"],
    version: "11.0",
    author: "SHAKIL",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Stylish uptime canvas"
    },
    longDescription: {
      en: "Show bot uptime with stylish progress bar"
    },
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const react = (emoji) =>
      api.setMessageReaction(
        emoji,
        event.messageID,
        () => {},
        true
      );

    try {
      react("⏳");

      // Canvas Create
      const canvas = Canvas.createCanvas(700, 320);
      const ctx = canvas.getContext("2d");

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 700, 320);
      gradient.addColorStop(0, "#0f0f0f");
      gradient.addColorStop(1, "#1f1f1f");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 680, 300);

      // Uptime
      const uptime = process.uptime();

      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const totalSeconds = 86400; // 24h
      const percent = Math.min(100, (uptime / totalSeconds) * 100);

      // Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px Arial";
      ctx.fillText("BOT UPTIME STATUS", 160, 70);

      // Uptime Text
      ctx.fillStyle = "#00ffcc";
      ctx.font = "bold 30px Arial";
      ctx.fillText(
        `${days}D ${hours}H ${minutes}M ${seconds}S`,
        180,
        140
      );

      // Progress Background
      ctx.fillStyle = "#2b2b2b";
      ctx.fillRect(80, 190, 540, 45);

      // Progress Color
      let fillColor = "#00ff00";

      if (percent < 30) fillColor = "#ff0000";
      else if (percent < 70) fillColor = "#ffff00";
      else if (percent < 95) fillColor = "#ff9900";

      // Progress Fill
      ctx.fillStyle = fillColor;
      ctx.fillRect(80, 190, (540 * percent) / 100, 45);

      // Progress Border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 190, 540, 45);

      // Percentage
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.fillText(
        `Progress : ${percent.toFixed(1)}%`,
        220,
        280
      );

      // Cache Folder
      const cachePath = path.join(__dirname, "cache");

      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath, { recursive: true });
      }

      // Image Path
      const imagePath = path.join(
        cachePath,
        `uptime_${Date.now()}.png`
      );

      // Save Image
      fs.writeFileSync(imagePath, canvas.toBuffer("image/png"));

      react("✅");

      // Send
      await api.sendMessage(
        {
          body:
            `╭─❍\n` +
            `⏰ 𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘\n` +
            `├‣ ${days} Day(s)\n` +
            `├‣ ${hours} Hour(s)\n` +
            `├‣ ${minutes} Minute(s)\n` +
            `╰‣ ${seconds} Second(s)`,
          attachment: fs.createReadStream(imagePath)
        },
        event.threadID,
        () => fs.unlinkSync(imagePath),
        event.messageID
      );

    } catch (err) {
      console.log(err);
      react("❌");

      api.sendMessage(
        `⚠️ | Uptime canvas failed.\n${err.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
