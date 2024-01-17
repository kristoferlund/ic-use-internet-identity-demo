use std::cell::RefCell;

use ic_cdk::{query, update};

thread_local! {
    static COUNTER : RefCell<u32> = RefCell::new(0);
}

#[query]
fn whoami() -> String {
    let caller = ic_cdk::caller();
    caller.to_string()
}

#[query]
fn get_counter() -> u32 {
    COUNTER.with(|counter| *counter.borrow())
}

#[update]
fn inc_counter() -> u32 {
    COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
        *counter.borrow()
    })
}
