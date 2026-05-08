const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "4k",
		aliases: ["enhance"],
		version: "1.0",
		author: "ChatGPT",
		countDown: 5,
		role: 0,
		shortDescription: "Enhance image",
		longDescription: "Enhance image to HD quality",
		category: "image",
		guide: "{pn} reply to image"
	},

	onStart: async function ({ message, event }) {
		try {

			if (!event.messageReply?.attachments?.length) {
				return message.reply("🖼️ | ছবির reply দাও জান");
			}

			const attachment = event.messageReply.attachments[0];

			if (attachment.type !== "photo") {
				return message.reply("❌ | শুধু ছবির reply দাও");
			}

			const imageUrl = attachment.url;

			await message.reply("✨ | Image enhancing...");

			// New API
			const api = `https://api.ryzendesu.vip/api/ai/remini?url=${encodeURIComponent(imageUrl)}`;

			const imgPath = path.join(__dirname, "cache", `${Date.now()}.jpg`);

			const response = await axios({
				url: api,
				method: "GET",
				responseType: "arraybuffer"
			});

			fs.writeFileSync(imgPath, response.data);

			await message.reply({
				body: "✅ | Enhanced Successfully",
				attachment: fs.createReadStream(imgPath)
			});

			fs.unlinkSync(imgPath);

		} catch (e) {
			console.log(e);
			message.reply("❌ | কাজ করে নাই, API down থাকতে পারে");
		}
	}
};
