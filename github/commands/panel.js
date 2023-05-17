const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const config = require("../config");

exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("Administrator")) return message.channel.send({ content: `${message.author} bu komutu kullanmak için \`Administrator\` yetkisine sahip olmalısın.`})

    const basvurubuton = new ButtonBuilder()
    .setCustomId("basvuru_buton")
    .setLabel("Başvuru Yap")
    .setStyle(3)
    .setEmoji("💼")

    const oneri = new ButtonBuilder()
    .setCustomId("oneri")
    .setLabel("Öneri yap")
    .setStyle(1)
    .setEmoji("🛡️")

    const sikayet = new ButtonBuilder()
    .setCustomId("sikayet")
    .setLabel("Sikayet yap")
    .setStyle(4)
    .setEmoji("⚒️")


    const row3 = new ActionRowBuilder()
    .addComponents([basvurubuton,oneri,sikayet])
    
    message.channel.send({ content:`> <a:star:1091729549898825829>  Aşağıdaki Menü Üzerinden **Yetkili Başvurusu** Veya **Öneri ve Şikayet** Yapabilirsiniz.
    `, components: [row3]  }) ;

};
exports.conf = {
  aliases: ["panel"]
};

exports.help = {
  name: "panel"
};