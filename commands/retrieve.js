const { SlashCommandBuilder } = require("@discordjs/builders");
const { Quote } = require("../initModels");
const { where } = require("sequelize");
const sequelize = require("../database");

// Helper function to retry database operations
async function retryOperation(operation, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error.message.includes("SQLITE_BUSY")) {
        // Wait longer between retries
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("retrieve")
    .setDescription("Retrieves quotes."),
  run: async ({ client, interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    const channel = interaction.channel;
    let processedCount = 0;
    let errorCount = 0;
    let lastMessageId = null;
    let hasMoreMessages = true;

    try {
      while (hasMoreMessages) {
        // Fetch messages in batches of 100
        const messages = await channel.messages.fetch({
          limit: 100,
          before: lastMessageId,
        });

        if (messages.size === 0) {
          hasMoreMessages = false;
          break;
        }

        // Update lastMessageId for next batch
        lastMessageId = messages.last().id;

        // Process each message in the current batch
        for (const message of messages) {
          try {
            const content = message[1].content;
            console.log(`Processing message: ${content}`);

            // Check if quote exists with retry
            const existingQuote = await retryOperation(async () => {
              return await Quote.findOne({
                where: {
                  title: content,
                  guild: interaction.guild.id,
                },
              });
            });

            if (!existingQuote) {
              // Create new quote with retry
              await retryOperation(async () => {
                await Quote.create({
                  guild: interaction.guild.id,
                  title: content,
                  author: message[1].author.username,
                  createdAt: message[1].createdAt,
                });
              });

              processedCount++;
              console.log(`Created quote: ${content}`);
            } else {
              console.log(`Quote already exists: ${content}`);
            }

            // Add a small delay between operations
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error processing message: ${error.message}`);
            errorCount++;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        // Update the user on progress
        await interaction.editReply({
          content: `Processed ${processedCount} messages so far. ${errorCount} messages failed to process. Fetching more...`,
          ephemeral: true,
        });

        // Add a delay between batches
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Final verification
      const savedQuotes = await retryOperation(async () => {
        return await Quote.findAll({
          where: { guild: interaction.guild.id },
        });
      });
      console.log(`Total quotes in database: ${savedQuotes.length}`);
    } catch (error) {
      console.error("Fatal error:", error);
      errorCount = processedCount;
    }

    await interaction.editReply({
      content: `Retrieved ${processedCount} messages successfully. ${errorCount} messages failed to process.`,
      ephemeral: true,
    });
  },
};
