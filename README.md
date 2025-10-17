# Four.meme Trading Bot (4meme Trading bot)

A TypeScript trading bot for four.meme tokens with automatic migration detection and dual exchange support.

## Contact me on Telegram to build your own four.meme trading bot
<a href="https://t.me/just_ben_venture" target="_blank">
  <img src="https://img.shields.io/badge/Telegram-@Contact_Me-0088cc?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Support" />
</a>

## Transaction Examples

### Transactions before Migration

**Buy Transaction**
- [Buy Tx](https://bscscan.com/tx/0x5e7725ac2357f1f109e2d3d53b1f1f3de82ae3c44ee369d8e47226cdd07520a6)

**Sell Transaction**
- [Sell Tx](https://bscscan.com/tx/0x0ffbf19b9ba43aef3e492b4abff88e8cc0b4da8d4b3d572bef37a9fa3acba919)

### Transactions after Migration

**Buy Transaction**
- [Buy Tx](https://bscscan.com/tx/0x7c744d0cdb93d2e86ba067d7c96cc749ae7bb026fc68cf21ec2e4808fef9496a)

**Sell Transaction**
- [Sell Tx](https://bscscan.com/tx/0x82b243fe62810eda45ada2b024002784bde088d7c9eb792d1b1283ec895b1e5e)


## Features

- **Migration Detection**: Automatically detects if token has migrated to PancakeSwap
- **Four.meme Trading**: Buy/sell tokens before migration (using Four.meme contracts)
- **PancakeSwap Trading**: Buy/sell tokens after migration (using PancakeRouter)
- **Smart Routing**: Automatically chooses the correct exchange based on migration status
- **Simple Setup**: Just install and run with environment variables

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file with your configuration:
   ```bash
   PRIVATE_KEY=your_private_key_here
   RPC_URL=
   TOKEN_MANAGER=
   HELPER_ADDRESS=
   PANCAKE_ROUTER_ADDRESS=
   WBNB_ADDRESS=
   ```

3. **Run the Bot**
   ```bash
   npm run dev
   ```

## How It Works

The bot automatically detects the migration status of any four.meme token:

- **Before Migration**: Uses Four.meme contracts for trading
- **After Migration**: Uses PancakeSwap Router for trading

### Migration Detection

The bot checks the `liquidityAdded` status from the Helper3 contract:
- `false` = Token still on Four.meme (use Four.meme contracts)
- `true` = Token migrated to PancakeSwap (use PancakeRouter)

### Trading Flow

1. **Check Migration Status**: Determines if token has migrated
2. **Route to Correct Exchange**:
   - Four.meme → Uses `buyTokenAMAP` and `sellToken`
   - PancakeSwap → Uses `swapExactETHForTokens` and `swapExactTokensForETH`
3. **Execute Trade**: Handles approvals, timing, and transaction execution

## Code Structure

### Main Components

- **`FourMemeTrader`**: Main trading class with migration detection
- **`getMigrationStatus()`**: Checks if token has migrated
- **`buyToken()`**: Four.meme buy (before migration)
- **`sellAmount()`**: Four.meme sell (before migration)
- **`buyPancakeToken()`**: PancakeSwap buy (after migration)
- **`sellPancakeToken()`**: PancakeSwap sell (after migration)

### Example Usage

```typescript
const trader = new FourMemeTrader();
const tokenAddress = '0x...';

// Check migration status
const migrated = await trader.getMigrationStatus(tokenAddress);

if (migrated) {
  // Token migrated to PancakeSwap
  await trader.buyPancakeToken(tokenAddress, 0.01); // Buy with 0.01 BNB
  await trader.sellPancakeToken(tokenAddress, 1000); // Sell 1000 tokens
} else {
  // Token still on Four.meme
  const result = await trader.buyToken(tokenAddress, 0.01);
  console.log(`Estimated tokens: ${result.estimatedTokens}`);
  await trader.sellAmount(tokenAddress, parseFloat(result.estimatedTokens));
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PRIVATE_KEY` | Your wallet private key | Required |
| `RPC_URL` | BSC RPC endpoint | `https://bsc-dataseed.binance.org` |
| `TOKEN_MANAGER2` | Four.meme TokenManager contract |
| `HELPER3_ADDRESS` | Four.meme Helper3 contract |
| `PANCAKE_ROUTER_ADDRESS` | PancakeSwap Router contract |
| `WBNB_ADDRESS` | Wrapped BNB contract |

## Security Notes

- Keep your private keys secure
- Use environment variables for sensitive data
- Test with small amounts first
- Consider using hardware wallets for large amounts

## Error Handling

Common errors and solutions:

- **"Disabled"**: Token has migrated, use PancakeSwap methods
- **"Insufficient BNB balance"**: Add more BNB to your wallet
- **"Insufficient token balance"**: You don't have enough tokens to sell
- **"Missing environment variable"**: Check your `.env` file

## Development

```bash
# Install dependencies
npm install

# Run the bot
npm run dev

# Type checking
npx tsc --noEmit
```
## License

MIT
