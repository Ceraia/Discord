# Archived in favor of the Gargoyle framework.
https://github.com/ceraia/gargoyle

# the xdbl bot
This bot is not necessarily simple, however this is a bot system for Discord that I have made from scratch and specifically tailored to my (sometimes odd) needs.

Now I initially didn't want to open-source this project, but I have decided to do so to remain transparent with the bot itself, but also to encourage others to look at my code, modify it, and learn from it.

## Docker
This bot is designed to run in a docker container, however will also run outside of one with the ability to use a `.env` file for configuration.

This repository also supplies a `Dockerfile` and a `docker-compose.yml` file to make it easier to run the bot in a container.
Next to those mentioned above, there is also a `docker-stack-compose.yml` file that contains the required information to launch a stack with the bot and also supplying its own database.

## To-Do


Main goal with tickets is to not store any information that can (easily) be deleted by the user to allow easy controlled performance.
- [ ] New ticket system, with minimal database usage to still allow easy management of tickets.
    - [ ] Creation of ticket panels and full modification of them.
    - [ ] Addition, deletion and modification of buttons. (Buttons will store what ticket to open, and what to do with it.)
    - [ ] Creation of channels and choosing a method to store the specific ticket information.
