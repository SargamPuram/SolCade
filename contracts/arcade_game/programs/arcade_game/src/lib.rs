use anchor_lang::prelude::*;

declare_id!("uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky");

#[program]
pub mod arcade_game {
    use super::*;

    // Initialize a new game pot
    pub fn initialize_pot(ctx: Context<InitializePot>, game_id: String, pot_number: u64) -> Result<()> {
        let pot = &mut ctx.accounts.pot_account;

        pot.game_id = game_id;
        pot.pot_number = pot_number;
        pot.total_lamports = 0;
        pot.status = PotStatus::Active;

        Ok(())
    }

    // Pay entry fee to the pot
    pub fn pay_entry_fee(ctx: Context<PayEntryFee>, amount: u64) -> Result<()> {
        let pot = &mut ctx.accounts.pot_account;
        let player = &mut ctx.accounts.player;
    
        // Ensure that the pot is active before accepting the entry fee
        if pot.status != PotStatus::Active {
            return Err(ErrorCode::PotNotActive.into());
        }
    
        // Use system program to transfer lamports from player to pot
        let ix = anchor_lang::system_program::Transfer {
            from: player.to_account_info(),
            to: pot.to_account_info(),
        };
    
        anchor_lang::system_program::transfer(CpiContext::new(ctx.accounts.system_program.to_account_info(), ix), amount)?;
    
        // Update pot total
        pot.total_lamports += amount;
    
        Ok(())
    }
    

      // Check current status of the pot (lamports and status)
    pub fn check_pot_status(ctx: Context<CheckPotStatus>) -> Result<u64> {
        let pot = &ctx.accounts.pot_account;
        Ok(pot.total_lamports)
    }

    // Distribute winnings to the winners
    pub fn distribute_winners<'info>(
        ctx: Context<'_, '_, '_, 'info, DistributeWinners<'info>>,
        winners: Vec<Pubkey>,
    ) -> Result<()> {
    
        require!(
            ctx.accounts.pot_account.status == PotStatus::Ended,
            ErrorCode::PotNotActive
        );
    
        require!(
            winners.len() == 5 && ctx.remaining_accounts.len() == 5,
            ErrorCode::InvalidWinnerList
        );
    
        let total = ctx.accounts.pot_account.total_lamports;
        let mut distributed = 0u64;
        let percentages = [40, 25, 15, 10, 10];
    
        for (i, winner_pubkey) in winners.iter().enumerate() {
            let to_account_info = ctx.remaining_accounts[i].clone();
            require_keys_eq!(*winner_pubkey, to_account_info.key(), ErrorCode::WinnerPubkeyMismatch);
    
            let amount = total * percentages[i] / 100;
            distributed += amount;
    
            let cpi_ctx = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.pot_account.to_account_info().clone(),
                    to: to_account_info,
                },
            );
    
            anchor_lang::system_program::transfer(cpi_ctx, amount)?;
        }
    
        ctx.accounts.pot_account.total_lamports = ctx
            .accounts
            .pot_account
            .total_lamports
            .checked_sub(distributed)
            .ok_or(ErrorCode::MathError)?;
    
        Ok(())
    }

    // Close the pot by marking it as ended
    pub fn close_pot(ctx: Context<ClosePot>) -> Result<()> {
        let pot_account = &mut ctx.accounts.pot_account;
        pot_account.status = PotStatus::Ended;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(game_id: String, pot_number: u64)]
pub struct InitializePot<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 32 + 8 + 8 + 1 + 32,
        seeds = [b"pot", game_id.as_bytes(), &pot_number.to_le_bytes()],
        bump
    )]
    pub pot_account: Account<'info, GamePot>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Account struct for paying entry fee
#[derive(Accounts)]
pub struct PayEntryFee<'info> {
    #[account(mut)]
    pub pot_account: Account<'info, GamePot>,

    #[account(mut)]
    pub player: Signer<'info>,  // Player pays entry fee

    pub system_program: Program<'info, System>,
}

// Account struct for checking pot status
#[derive(Accounts)]
pub struct CheckPotStatus<'info> {
    pub pot_account: Account<'info, GamePot>,
}

#[derive(Accounts)]
pub struct DistributeWinners<'info> {
    #[account(mut)]
    pub pot_account: Account<'info, GamePot>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClosePot<'info> {
    #[account(mut)]
    pub pot_account: Account<'info, GamePot>,
}

#[account]
pub struct GamePot {
    pub game_id: String,         // name or identifier for the game
    pub pot_number: u64,         // session-based incrementing ID
    pub total_lamports: u64,     // pot balance
    pub status: PotStatus,       // Active / Ended
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PotStatus {
    Active,
    Ended,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The pot is not active.")]
    PotNotActive,
    #[msg("Invalid winner list: must contain exactly 5 addresses.")]
    InvalidWinnerList,
    #[msg("Winner public key does not match the expected order.")]
    WinnerPubkeyMismatch,
    #[msg("Overflow or underflow error during lamport math.")]
    MathError,
}
