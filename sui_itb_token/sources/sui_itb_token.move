module sui_itb_token::TokenModule {
    use sui::object;
    use sui::transfer;
    use std::string;
    use sui::tx_context;

    const ERROR_INSUFFICIENT_SUPPLY: u64 = 1;

    public struct Token has key, store {
        id: sui::object::UID,
        name: string::String,
        supply: u64,
    }

    public entry fun mint(
        name: string::String,
        amount: u64,
        ctx: &mut tx_context::TxContext
    ) {
        let id = sui::object::new(ctx);
        let token = Token {
            id,
            name,
            supply: amount,
        };
        sui::transfer::transfer(token, tx_context::sender(ctx));
    }

    public entry fun burn(
        token: &mut Token,
        amount: u64,
        _ctx: &mut tx_context::TxContext
    ) {
        assert!(token.supply >= amount, ERROR_INSUFFICIENT_SUPPLY);
        token.supply = token.supply - amount;
    }

    public fun get_balance(token: &Token): u64 {
        token.supply
    }
}