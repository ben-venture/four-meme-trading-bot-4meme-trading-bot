# Four.meme Trading Bot

A TypeScript trading bot for four.meme tokens with automatic migration detection and dual exchange support.

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
   RPC_URL=https://bsc-dataseed.binance.org
   TOKEN_MANAGER=
   HELPER_ADDRESS=
   PANCAKE_ROUTER_ADDRESS=
   WBNB_ADDRESS=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
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
