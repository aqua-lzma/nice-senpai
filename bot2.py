import discord
import asyncio
import json
import random

class Client(discord.Client):
    def __init__(self):
        self.shitpost_count = 0
        self.shitpost_target = random.randint(10,100)
        self.dab_count = 0
        self.dab_target = random.randint(10,100)
        with open("user_data.json") as f:
            self.user_data = json.load(f)

    @asyncio.coroutine
    def on_ready(self):
        print('Logged in as')
        print(client.user.name)
        print(client.user.id)
        print('------')

    @asyncio.coroutine
    def on_message(self, message):
        if message.author == self.user:
            return
        if message.content == "":
            return
        if message.channel.id == "183205223609663488":
            return
        for role in message.author.roles:
            if role.id == "267405505784184835":
                return

        split = message.content.split()

        if split[0] == "$$":
            if message.mentions:
                self.show_balance(message.channel, message.mentions[0])
            else:
                self.show_balance(message.channel, message.author)

        if split[0] == "$give":
            if len(split) == 3 and message.mentions:
                if split[1].isdigit():
                    amount = int(split[1])
                elif split[2].isdigit():
                    amount = int(split[2])
                else:
                    return
                if self.user_data.get(message.author.id) and self.user_data[message.author.id]["money"] >= amount:
                    self.user_data[message.author.id]["money"] -= amount
                    self.give_money(amount, message.mentions[0])
                    await self.send_message(message.channel, "{} gave {} dabs <:ledabbinganimegirl:256497986979233792> to {}.".format(message.author.nick or message.author.name, str(amount), message.mentions[0].nick or message.mentions[0].name))
                else:
                    await self.send_message(message.channel, "Either you dont have enough dabs <:ledabbinganimegirl:256497986979233792> or you're not in the database. Try using `$$`")
                return
            await self.send_message(message.channel, "`$give` syntax: `$give amount @person` or `$give @person amount` make sure you have enough.")

    def show_balance(self, channel, member):
        if self.user_data.get(member.id) == None:
            await self.send_message(channel, "{} not found in database, 100 free dabs! <:ledabbinganimegirl:256497986979233792>".format(member.nick or member.name))
            self.user_data[member.id] = {"money":100}
        else:
            money = self.user_data[member.id]["money"]
            await self.send_message(channel, '{} has {} dabs <:ledabbinganimegirl:256497986979233792>'.format(member.nick or member.name, str(money)))
        self.update_json()

    def give_money(self, amount, member):
        if self.user_data.get(member.id) == None:
            await self.send_message(channel, "{} not found in database, 100 free dabs! <:ledabbinganimegirl:256497986979233792>".format(member.nick or member.name))
            self.user_data[member.id] = {"money":100}
        self.user_data[member.id][money] += amount
        self.update_json()

    def update_json(self):
        with open("user_data.json", "w") as f:
            json.dump(self.user_data, f)

if __name__ == "__main__":
    with open("token") as f:
        Client.run(f.read())
