# Chat-Alias

This module allow user to apply automatic replacement on sent chat messages. Each user can define their own replacement pairs in the journal and a global replacement table can also be applied on each user in the game.

## Usage
1. Install this module
2. Launch the game with GM role to allow the module generate journal and set permission for each user.
3. Users can edit their journal in folder MODULE_DATA/CHAT_ALIAS/ with their name on it.
4. No reloading needed, the replacement should work as soon as the journal is saved.

## Format
The journal should be written in json format like this:
```
//This example will allow user call roll commands with .(point) in addition to /(slash)
[
    {
        "pattern":"^\.r ",
        "replacement":"/r "
    },
    {
        "pattern":"^\.rd",
        "replacement":"/r d20"
    }
]
```