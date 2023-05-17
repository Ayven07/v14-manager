const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const config = require("../config");

exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("Administrator")) return message.channel.send({ content: `${message.author} bu komutu kullanmak için \`Administrator\` yetkisine sahip olmalısın.`})
  
    const yayin = new ButtonBuilder()
    .setCustomId("yayin")
    .setLabel("Yayıncı başvurusu yap")
    .setStyle(1)
    .setEmoji("🖥️")

    const row3 = new ActionRowBuilder()
    .addComponents([yayin])
    
    message.channel.send({ content:`> <:kameracik:1086374635655934073> Aşağıdaki Panel Üzerinden **Yayıncı Başvurusu** yapabilirsin.
    `, components: [row3]  }) ;

};
exports.conf = {
  aliases: ["yayın"]
};

exports.help = {
  name: "yayın"
};