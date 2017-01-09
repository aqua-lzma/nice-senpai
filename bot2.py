import discord
import asyncio
import json
import random

DAB_EMOJI = "<:ledabbinganimegirl:256497986979233792>"
GIVE_SYNTAX = """`$give` syntax: `$give [amount] [@person]` or `$give [@person] [amount]`.
Give dabs to another person.
Make sure you have enough dabs. {}""".format(DAB_EMOJI)
BR_SYNTAX = """`$br` syntax: `$br [number]`.
Bet dabs on a roll of 1 to 100.
Make sure you have enough dabs. {}""".format(DAB_EMOJI)
BF_SYNTAX = """`$bf` syntax: `$bf [amount] [heads or tails]`.
Bet dabs on a coin flip with a 1.8* payout.
h or t works as well as head or tail.
Make sure you have enough dabs. {}""".format(DAB_EMOJI)

class Client(discord.Client):
    def __init__(self):
        super().__init__()
        self.shitpost_count = 0
        self.shitpost_target = random.randint(50,200)
        self.dab_count = 0
        self.dab_target = random.randint(20,100)
        self.dab_available = 0
        self.dab_announce = None
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
        if message.channel.id in ["183205223609663488", "183214846534352897"]:
            return
        for role in message.author.roles:
            if role.id == "182951530591158272":
                return

        split = message.content.split()

        if split[0] == "$$":
            yield from self.check_user(message.channel, message.author)
            if message.mentions:
                yield from self.check_user(message.channel, message.mentions[0])
                member = message.mentions[0]
                money = self.user_data[message.mentions[0].id]["money"]
            else:
                member = message.author
                money = self.user_data[message.author.id]["money"]
            yield from self.send_message(message.channel, '{} has {} dabs. {}'.format(member.nick or member.name, str(money), DAB_EMOJI))

        if split[0] == "$give":
            yield from self.check_user(message.channel, message.author)
            if len(split) == 3 and message.mentions:
                yield from self.check_user(message.channel, message.mentions[0])
                if split[1].isdigit():
                    amount = int(split[1])
                elif split[2].isdigit():
                    amount = int(split[2])
                else:
                    return
                if self.user_data[message.author.id]["money"] >= amount:
                    self.user_data[message.author.id]["money"] -= amount
                    yield from self.give_money(amount, message.mentions[0])
                    name1 = message.author.nick or message.author.name
                    name2 = message.mentions[0].nick or message.mentions[0].name
                    yield from self.send_message(message.channel, "{} gave {} dabs {} to {}.".format(name1, str(amount), DAB_EMOJI, name2))
                else:
                    yield from self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
                return
            yield from self.send_message(message.channel, GIVE_SYNTAX)

        if split[0] == "$lb":
            lb = []
            if len(split) > 1 and split[1].isdigit():
                num = int(split[1])
            else:
                num = 10
            for user_id in self.user_data:
                member = message.server.get_member(user_id)
                if member == None:
                    continue
                lb.append([member.nick or member.name, self.user_data[user_id]["money"]])
            msg = ""
            for i in lb[:num]:
                msg += str(i) + "\n"
            yield from self.send_message(message.channel, msg)
            return

        if split[0] == "$br":
            yield from self.check_user(message.channel, message.author)
            if len(split) == 2 and split[1].isdigit():
                amount = int(split[1])
                if amount <= self.user_data[message.author.id]["money"]:
                    self.user_data[message.author.id]["money"] -= amount
                    num = random.randint(1,100)
                    if num < 66:
                        suffix = "no dabs. "
                    elif num < 90:
                        suffix = "{} dabs! ".format(amount*2)
                        self.user_data[message.author.id]["money"] += amount*2
                    elif num < 100:
                        suffix = "{} dabs for getting above 90! ".format(int(amount*3.5))
                        self.user_data[message.author.id]["money"] += int(amount*3.5)
                    elif num == 100:
                        suffix = "{} dabs! PERFECT ROLL! ".format(amount*10)
                        self.user_data[message.author.id]["money"] += amount*10
                    prefix = "{} rolled {} and won ".format(message.author.nick or message.author.name, num)
                    msg = prefix + suffix + DAB_EMOJI
                    yield from self.send_message(message.channel, msg)
                else:
                    yield from self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
            else:
                yield from self.send_message(message.channel, BR_SYNTAX)
            return

        if split[0] == "$bf":
            yield from self.check_user(message.channel, message.author)
            words = ["t", "h", "head", "tail", "heads", "tails"]
            if len(split) == 3 and ((split[1].isdigit() and split[2] in words) or (split[2].isdigit() and split[1] in words)):
                if split[1].isdigit():
                    amount = int(split[1])
                    guess = split[2][0]
                else:
                    amount = int(split[2])
                    guess = split[1][0]
                if amount < 3:
                    yield from self.send_message(message.channel, "Minimal bet is 3.")
                    return
                if amount <= self.user_data[message.author.id]["money"]:
                    self.user_data[message.author.id]["money"] -= amount
                    if random.choice([True, False]):
                        with open("makotocoinhead.png", "rb") as f:
                            yield from self.send_file(message.channel, f, content="Coin flip: heads.")
                        success = guess == "h"
                    else:
                        with open("makotocoinhead.png", "rb") as f:
                            yield from self.send_file(message.channel, f, content="Coin flip: tails.")
                        success = guess == "f"
                    if success:
                        self.user_data[message.author.id]["money"] += int(amount*1.8)
                        yield from self.send_message(message.channel, "Congratz you win {} dabs! {}".format(int(amount*1.8),DAB_EMOJI))
                    else:
                        yield from self.send_message(message.channel, "You win nothing.")
                else:
                    yield from self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
            else:
                yield from self.send_message(message.channel, BF_SYNTAX)
            return

        yield from self.update_vars(message)

    @asyncio.coroutine
    def check_user(self, channel, member):
        if self.user_data.get(member.id) == None:
            yield from self.send_message(channel, "{} not found in database, 100 free dabs! {}".format(member.nick or member.name, DAB_EMOJI))
            self.user_data[member.id] = {"money":100}
        yield from self.update_json()

    @asyncio.coroutine
    def give_money(self, amount, member):
        self.user_data[member.id]["money"] += amount
        yield from self.update_json()

    @asyncio.coroutine
    def update_vars(self, message):
        self.shitpost_count += 1
        print("shitpost counter: {}\nshitpost target: {}".format(self.shitpost_count, self.shitpost_target))
        print("---")
        if "dab" in message.content.lower():
            print("dab message, skipping")
        else:
            self.dab_count += 1
            print("dab counter: {}\ndab target: {}".format(self.dab_count, self.dab_target))
        print("------")
        if self.shitpost_count == self.shitpost_target:
            yield from self.send_message(message.channel, '^ interesting.')
            self.shitpost_count = 0
            self.shitpost_target = random.randint(10,100)
        elif self.shitpost_count > self.shitpost_target:
            self.shitpost_count = 0
            self.shitpost_target = random.randint(10,100)

        if self.dab_count == self.dab_target:
            dabs = random.randint(1,10)
            with open("bca.jpg", "rb") as f:
                msg = "{} dabs have appeared! DAB TO GET EM!".format(dabs)
                self.dab_announce = yield from self.send_file(message.channel, f, content=msg)
            self.dab_count = 0
            self.dab_target = random.randint(10,100)
            self.dab_available += dabs
        elif self.dab_count > self.dab_target:
            self.dab_count = 0
            self.dab_target = random.randint(10,100)

        if self.dab_available > 0:
            if "dab" in message.content.lower():
                yield from self.check_user(message.channel, message.author)
                msg = "{} has claimed {} dabs!".format(message.author.nick or message.author.name, self.dab_available)
                award = yield from self.send_message(message.channel, msg)
                self.user_data[message.author.id]["money"] += self.dab_available
                self.dab_available = 0
                if self.dab_announce != None:
                    yield from self.delete_message(self.dab_announce)
                yield from asyncio.sleep(10)
                yield from self.delete_message(award)

    @asyncio.coroutine
    def update_json(self):
        with open("user_data.json", "w") as f:
            json.dump(self.user_data, f)

if __name__ == "__main__":
    with open("token") as f:
        client = Client()
        client.run(f.read())
