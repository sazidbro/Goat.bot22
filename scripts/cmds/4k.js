const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "4k",
    version: "1.0",
    author: "Shakil",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Enhance image to HD"
    },
    longDescription: {
      en: "Reply to an image and enhance it to high quality"
    },
    category: "image",
    guide: {
      en: "{pn} reply to image"
    }
  },

  onStart: async function ({ message, event }) {
    try {
      const reply = event.messageReply;

      if (!reply || !reply.attachments || reply.attachments.length === 0) {
        return message.reply("🖼️ | কোনো ছবির reply দাও জান");
      }

      const attachment = reply.attachments[0];

      if (attachment.type !== "photo") {
        return message.reply("❌ | শুধু ছবির reply দাও");
      }

      const imgUrl = attachment.url;

      message.reply("✨ | Image enhancing...");

      // API URL
      const api = `https://api.popcat.xyz/v2/imgenhance?image=${encodeURIComponent(imgUrl)}`;

      const imgPath = path.join(__dirname, "cache", `4k_${Date.now()}.jpg`);

      const response = await axios({
        url: api,
        method: "GET",
        responseType: "arraybuffer"
      });

      fs.writeFileSync(imgPath, response.data);

      await message.reply({
        body: "✅ | 4K Enhanced Image",
        attachment: fs.createReadStream(imgPath)
      });

      fs.unlinkSync(imgPath);

    } catch (err) {
      console.log(err);
      message.reply("❌ | Enhance করতে সমস্যা হয়েছে");
    }
  }
};
