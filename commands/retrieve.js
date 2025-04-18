const { SlashCommandBuilder } = require("@discordjs/builders");
const { Quote } = require("../initModels");
const { where } = require("sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("retrieve")
    .setDescription("Retrieves quotes."),
  run: async ({ client, interaction }) => {
    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ limit: 100 });
    for (const message of messages) {
      console.log(
        `Content: ${message[1].content}, Author: ${message[1].author.username}, Date: ${message[1].createdAt}`
      );

      await Quote.findOrCreate({
        where: {
          title: message[1].content,
        },
        default: {
          title: message[1].content,
          author: message[1].author.username,
          createdAt: message[1].createdAt,
        },
      });
    }
  },
};
