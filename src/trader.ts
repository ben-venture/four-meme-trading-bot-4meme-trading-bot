import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { ERC20_ABI, HELPER3_ABI, PANCAKE_ROUTER_ABI, TOKEN_MANAGER_ABI } from './4meme-utils/abi';

dotenv.config();

class FourMemeTrader {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private tokenManagerAddress: string;
  private helper3Address: string;
  private pancakeRouterAddress: string;
  private wbnbAddress: string;

  constructor() {
    // Load environment variables matching Rust implementation
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    const managerAddress = process.env.TOKEN_MANAGER;
    const helper3Address = process.env.HELPER_ADDRESS;
    const pancakeRouterAddress = process.env.PANCAKE_ROUTER_ADDRESS;
    const wbnbAddress = process.env.WBNB_ADDRESS;
    if (!pancakeRouterAddress) {
      throw new Error('Missing PANCAKE_ROUTER_ADDRESS in .env');
    }
    if (!wbnbAddress) {
      throw new Error('Missing WBNB_ADDRESS in .env');
    }
    if (!privateKey) {
      throw new Error('Missing PRIVATE_KEY in .env');
    }
    if (!rpcUrl) {
      throw new Error('Missing RPC_URL in .env');
    }
    if (!managerAddress) {
      throw new Error('Missing TOKEN_MANAGER in .env');
    }
    if (!helper3Address) {
      throw new Error('Missing HELPER_ADDRESS in .env');
    }

    // Initialize provider + wallet matching Rust
    this.provider = new ethers.JsonRpcProvider(rpcUrl, {
      name: 'bsc',
      chainId: 56
    });

    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.tokenManagerAddress = managerAddress;
    this.helper3Address = helper3Address;
    this.pancakeRouterAddress = pancakeRouterAddress;
    this.wbnbAddress = wbnbAddress;
    console.log(`🔗 Connected wallet: ${this.wallet.address}`);
  }

  async getMigrationStatus(tokenAddress: string): Promise<boolean> {
    try {
    } catch (error) {
      return false;
    }
  }

  async approveToken(tokenAddress: string): Promise<boolean> {
    try {
      const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);

      // Check current allowance
      console.log('🔍 Checking current allowance...');
      const currentAllowance = await erc20Contract.allowance(this.wallet.address, this.tokenManagerAddress);
      console.log(`📊 Current allowance: ${ethers.formatEther(currentAllowance)} tokens`);

      // Only approve if allowance is insufficient (less than 1 token)
      const minAllowance = ethers.parseEther('1');
      if (currentAllowance >= minAllowance) {
        console.log('✅ Sufficient allowance already exists, skipping approval');
        return true;
      }

      console.log('🔓 Approving TokenManager as spender...');
      const tx = await erc20Contract.approve(this.tokenManagerAddress, ethers.MaxUint256);
      console.log(`✅ Approval tx sent: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ Approval confirmed! Gas used: ${receipt?.gasUsed.toString()}`);

      // Verify the approval
      const newAllowance = await erc20Contract.allowance(this.wallet.address, this.tokenManagerAddress);
      console.log(`📊 New allowance: ${ethers.formatEther(newAllowance)} tokens`);

      return true;
    } catch (error) {
      console.error('❌ Failed to approve token:', error);
      return false;
    }
  }

  // Four.Meme buy token before migration
  async buyToken(tokenAddress: string, bnbAmount: number): Promise<{ estimatedTokens: string, txHash: string, gasUsed: string, duration: number }> {
    try {
      console.log(`🟣 Running buyTokenAMAP (spend fixed BNB)...`);

      /*
        Ask to owner to buyt token the contract
      */

      return {
        estimatedTokens: estimatedTokensFormatted,
        txHash: tx.hash,
        gasUsed: receipt?.gasUsed.toString(),
        duration: duration,
      };
    } catch (error) {
      return {
        estimatedTokens: '0',
        txHash: '',
        gasUsed: '0',
        duration: 0,
      };
    }
  }

  // Four.Meme sell token before migration
  async sellAmount(tokenAddress: string, tokenAmount: number): Promise<string> {
    try {
      console.log(`🔵 Running sellToken (sell exact amount)...`);

      const amountToSell = ethers.parseEther(tokenAmount.toString());

      const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);

      const allowance = await erc20Contract.allowance(this.wallet.address, this.tokenManagerAddress);
      console.log(`📊 Allowance: ${ethers.formatEther(allowance)} tokens`);

      if (allowance < amountToSell) {
        // Approve first - matching Rust exactly
        console.log('🔓 Approving TokenManager2 as spender...');
        const approveTx = await erc20Contract.approve(this.tokenManagerAddress, ethers.MaxUint256);
        console.log(`✅ Approval tx sent: ${approveTx.hash}`);
        await approveTx.wait();

        // Wait 5 seconds like Rust
        console.log('⏳ Waiting 5 seconds before sell transaction...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      /*
        Ask to owner to sell token the contract
      */

      return tx.hash;
    } catch (error) {
      console.error('❌ Failed to sell amount:', error);
      throw error;
    }
  }

  // Buy token via PancakeRouter after migration
  async buyPancakeToken(tokenAddress: string, bnbAmount: number): Promise<{ txHash: string, gasUsed: string }> {
    try {
      console.log(`🟣 Running buyPancakeToken (spend fixed BNB)...`);
      const fundsToSpend = ethers.parseEther(bnbAmount.toString());
      console.log(`💰 Funds to spend: ${fundsToSpend} BNB`);

      /*
        Ask to owner to buy pancake token the contract
      */

      return {
        txHash: tx.hash,
        gasUsed: receipt?.gasUsed.toString()
      };
    }
    catch (error) {
      return {
        txHash: '',
        gasUsed: '0'
      };
    }
  }

  // Sell token via PancakeRouter after migration
  async sellPancakeToken(tokenAddress: string, tokenAmount: number): Promise<{ txHash: string, gasUsed: string }> {
    try {
      console.log(`🔵 Running sellPancakeToken (sell exact amount)...`);
      const amountToSell = ethers.parseEther(tokenAmount.toString());
      console.log(`💰 Amount to sell: ${amountToSell} tokens`);
      const pancakeRouterContract = new ethers.Contract(this.pancakeRouterAddress, PANCAKE_ROUTER_ABI, this.wallet);

      const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);

      /*
        Ask to owner to sell pancake token the contract
      */

      console.log(`✅ Transaction confirmed! Gas used: ${receipt?.gasUsed.toString()}`);
      console.log(`✅ sellPancakeToken tx sent: ${tx.hash}`);
      return {
        txHash: tx.hash,
        gasUsed: receipt?.gasUsed.toString()
      };
    }
    catch (error) {
      console.error('❌ Failed to sell pancake token:', error);
      return {
        txHash: '',
        gasUsed: '0'
      };
    }
  }
}

// Main execution - matching Rust implementation exactly
async function main() {
  const trader = new FourMemeTrader();
  const tokenAddress = '0xf5a7f235807ee479c66302bd2b25125bd5794444';
  const migrationStatus = await trader.getMigrationStatus(tokenAddress);
  if (migrationStatus) {
    console.log('✅ Migration Status: True');
    const buyAmount = 0.00001;
    await trader.buyPancakeToken(tokenAddress, buyAmount);
    const sellAmount = 10;
    await trader.sellPancakeToken(tokenAddress, sellAmount);
  } else {
    console.log('❌ Migration Status: False');
    const buyAmount = 0.00001;
    const { estimatedTokens } = await trader.buyToken(tokenAddress, buyAmount);
    console.log(`💰 Estimated Tokens: ${estimatedTokens}`);
    const sellAmount = estimatedTokens;
    await trader.sellAmount(tokenAddress, Number(sellAmount));
  }
}

main().catch(console.error);