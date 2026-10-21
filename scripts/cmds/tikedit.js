const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/aura-mahmud/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "tikedit",
                version: "3.8",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        en: "Search and download any edit video from TikTok",
                        vi: "Tìm kiếm và tải xuống bất kỳ video chỉnh sửa nào từ TikTok"
                },
                category: "media",
                guide: {
                        en: '   {pn} <keyword>: (Ex: {pn} naruto edit)',
                        vi: '   {pn} <từ khóa>: (VD: {pn} naruto edit)'
                }
        },

        langs: {
                en: {
                        noInput: "× Baby, please provide a search keyword! 🔍\nExample: {pn} naruto edit",
                        success: "Here's your TikTok edit for \"%1\":",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noInput: "× Cưng ơi, hãy nhập từ khóa tìm kiếm! 🔍\nVD: {pn} naruto edit",
                        success: "Đây là video TikTok cho \"%1\":",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const search = args.join(" ");
                if (!search) return message.reply(getLang("noInput"));

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);

                        const videoUrl = `${await baseApiUrl()}/api/tiksr?sr=${encodeURIComponent(search)}`;
                        const stream = await global.utils.getStreamFromURL(videoUrl);

                        api.setMessageReaction("🪽", event.messageID, () => {}, true);

                        return message.reply({
                                body: getLang("success", search),
                                attachment: stream
                        });

                } catch (err) {
                        console.error("TikTok Search Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
