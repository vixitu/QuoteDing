# QuoteDing

A Discord bot for collecting and managing quotes from your server's messages.

## Features

- **Quote Collection**: Automatically collect quotes from your server's messages
- **Pagination Support**: Retrieve messages beyond Discord's 100-message limit
- **Guild-Specific**: Quotes are stored per guild, keeping your server's quotes separate
- **Efficient Storage**: Uses SQLite with WAL mode for reliable data storage
- **Error Handling**: Robust error handling and retry mechanisms for reliable operation

## Commands

- `/retrieve` - Collects quotes from the current channel's messages

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Discord bot token:
   ```
   TOKEN=your_discord_bot_token
   ```
4. Run the bot:
   ```bash
   node bot.js
   ```

## Technical Details

- Built with Discord.js v14
- Uses Sequelize for database management
- Implements SQLite with WAL mode for better concurrency
- Features automatic pagination for message retrieval
- Includes retry mechanisms for reliable database operations

## Credits

This project was created in collaboration with Svoen.

## License

ISC
