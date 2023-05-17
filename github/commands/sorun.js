const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const config = require("../config");

exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("Administrator")) return message.channel.send({ content: `${message.author} bu komutu kullanmak için \`Administrator\` yetkisine sahip olmalısın.`})

    const sorun = new ButtonBuilder()
    .setCustomId("sorun")
    .setLabel("Sorun çözme yetkilisi çağır")
    .setStyle(4)
    .setEmoji("📞")

    const row3 = new ActionRowBuilder()
    .addComponents([sorun])
    
    message.channel.send({ content:`> <:miniicon:1091729372936929350> **Merhaba ${message.guild.name}**
    > Sorun çözmeciye cezanızı itiraz mı etmek istiyorsunuz? **"Sorun çözme yetkilisi çağır"** düğmesi ile bildirebilirsiniz.


    `, components: [row3]  }) ;

};
exports.conf = {
  aliases: ["sorun"]
};

exports.help = {
  name: "sorun"
};