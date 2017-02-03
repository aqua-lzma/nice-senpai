#!/usr/bin/python3.5
import discord
import asyncio
import json
import random
import time
import math

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


def pretty_table(l):
    maxs = [max(map(lambda x:len(str(x[i])), l)) for i in range(len(l[0]))]
    for row in range(len(l)):
        for col in range(len(l[row])):
            l[row][col] = str(l[row][col]) + (" " * (maxs[col] - len(str(l[row][col]))))
    l = list(map(lambda x: [""] + x + [""], l))
    dashes = list(map(lambda x: "━"*x, maxs))
    top = "┏" + "┳".join(dashes) + "┓"
    mid = "┣" + "╋".join(dashes) + "┫"
    bot = "┗" + "┻".join(dashes) + "┛"
    out = ""
    out += top + "\n"
    for i in l:
        out += "┃".join(i) + "\n"
        if i != l[-1]:
            out += mid + "\n"
    out += bot
    return out


def mappu(old, new):
    # translates a num range to another
    # old value to be translated goes mappu((HERE, 0,100),(0,849725982795))
    if len(old) == 3 and len(new) == 2:
        old_v = old[0]
        old_mi = min(old[1:3])
        old_ma = max(old[1:3])
        new_mi = min(new)
        new_ma = max(new)

        return ((old_v - old_mi) / (old_ma - old_mi)) * (new_ma - new_mi) + new_mi


class Client(discord.Client):
    def __init__(self):
        super().__init__()
        self.shitpost_count = 0
        self.shitpost_target = random.randint(50, 200)
        self.dab_count = 0
        self.dab_target = random.randint(20, 100)
        self.dab_announce = None
        self.prices = {
            "roles": {
                'Radio Mod': 1000},
            "items": {
                'droll x 10': 100}
        }
        self.niceroles = None
        self.exec_out = None

        with open("user_data.json") as json_file:
            self.user_data = json.load(json_file)

    @asyncio.coroutine
    def on_ready(self):
        print('Logged in as')
        print(client.user.name)
        print(client.user.id)
        print('------')
        nice_server = self.get_server("182829461786460161")
        self.niceroles = [role.name for role in nice_server.roles]

    @asyncio.coroutine
    def on_message(self, message):
        if message.author == self.user:
            return
        if message.content == "":
            return
        if message.channel.id in ["183205223609663488", "183214846534352897"]:
            return
        if "182951530591158272" in [role.id for role in message.author.roles]:
            return

        split = message.content.split()

        if split[0] == "$$":
            yield from self.check_user(message.channel, message.author)
            if message.mentions:
                yield from self.check_user(message.channel, message.mentions[0])
                if self.user_data.get(message.mentions[0].id) is None:
                    return
                member = message.mentions[0]
            else:
                member = message.author
            money = self.user_data[member.id]["money"]
            level = self.user_data[member.id]["level"]
            rolls = self.user_data[member.id]["rolls"]
            fmt = [member.nick or member.name, money, DAB_EMOJI, level, rolls]
            msg = "{0} has {1} dabs. {2}\n{0} is level {3} and has {4} rolls left today.".format(*fmt)
            yield from self.send_message(message.channel, msg)

        if split[0] == "$give":
            yield from self.check_user(message.channel, message.author)
            if len(split) == 3 and message.mentions:
                yield from self.check_user(message.channel, message.mentions[0])
                if self.user_data.get(message.mentions[0].id) is None:
                    return
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
                    msg = "{} gave {} dabs {} to {}.".format(name1, str(amount), DAB_EMOJI, name2)

                else:
                    msg = "You don't have enough dabs. {}".format(DAB_EMOJI)
                yield from self.send_message(message.channel, msg)
                return
            yield from self.send_message(message.channel, GIVE_SYNTAX)

        if split[0] == "$lb":
            lb = []
            if len(split) > 1 and split[1].isdigit():
                num = int(split[1])
            else:
                num = 10
            for user_id in self.user_data:
                if isinstance(self.user_data[user_id]["money"], str):
                    continue
                member = message.server.get_member(user_id)
                if member is None:
                    continue
                lb.append([member.nick or member.name, self.user_data[user_id]["money"]])
            lb.sort(key=lambda x: x[1], reverse=True)
            lb = "```" + pretty_table(lb[:num]) + "```"
            yield from self.send_message(message.channel, lb)
            return

        if split[0] == "$br":
            yield from self.check_user(message.channel, message.author)
            if len(split) >= 2 and split[1].isdigit():
                amount = int(split[1])
                if amount <= self.user_data[message.author.id]["money"]:
                    self.user_data[message.author.id]["money"] -= amount
                    num = random.randint(1, 100)
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
                    else:
                        suffix = "Something went wrong."
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
            if len(split) >= 3 and\
                ((split[1].isdigit() and split[2] in words) or
                    (split[2].isdigit() and split[1] in words)):
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
                        with open("makotocoinhead.png", "rb") as heads:
                            yield from self.send_file(message.channel, heads, content="Coin flip: heads.")
                        success = guess == "h"
                    else:
                        with open("makotocointails.png", "rb") as tails:
                            yield from self.send_file(message.channel, tails, content="Coin flip: tails.")
                        success = guess == "t"
                    if success:
                        self.user_data[message.author.id]["money"] += int(amount*1.8)
                        msg = "Congratz you win {} dabs! {}".format(int(amount*1.8), DAB_EMOJI)
                    else:
                        msg = "You win nothing."
                    yield from self.send_message(message.channel, msg)
                else:
                    yield from self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
            else:
                yield from self.send_message(message.channel, BF_SYNTAX)
            return

        if split[0] == "$del":
            if len(split) == 2 and message.mentions and message.author.id == "147790355776012289":
                if self.user_data.get(message.mentions[0].id) is not None:
                    del self.user_data[message.mentions[0].id]
                    msg = "{} deleted from database.".format(message.mentions[0].nick or message.mentions[0].name)
                else:
                    msg = "{} not found in database.".format(message.mentions[0].nick or message.mentions[0].name)
                yield from self.send_message(message.channel, msg)
            return

        if split[0] == "$exec":
            if message.author.id == "147790355776012289":
                cmd = " ".join(split[1:])
                cmd = cmd.strip("`")
                cmd = cmd.strip()
                try:
                    self.exec_out = None
                    exec(cmd)
                    if self.exec_out is not None:
                        yield from self.send_message(message.channel, str(self.exec_out))
                except Exception as e:
                    yield from self.send_message(message.channel, "```{}```".format(str(e)))
            return

        if split[0] == "$drool":
            yield from self.check_user(message.channel, message.author)

            if message.channel.id == "182829461786460161" or message.channel.id == "223361230172061696":
                yield from self.send_message(message.channel,
                                             "You were TOLD my MARCH to no drool in #general or #oc_channel!")
                return

            if self.user_data[message.author.id]["rolls"] > 0:
                drools = 1

                if len(split) > 1 and split[1].isdigit():
                    drools = int(split[1])
                elif len(split) > 1 and split[1].lower() == "all":
                    drools = self.user_data[message.author.id]["rolls"]

                if self.user_data[message.author.id]["rolls"] >= drools:
                    self.user_data[message.author.id]["rolls"] -= drools
                    wins_shortened = {
                        0: "No dubs :(", 1: "*dubs*", 2: "**trips**", 3: "***quads***",
                        4: "quints!", 5: "***WHAT TO HECK, SEXTUPLES***",
                        6: "***WOWE! LOWEST ROL POSSIBLE!!***", 7: "***WOWE! HIHGEST ROL POSSIBLE!!***\n"
                    }
                    wins = {
                        0: 'No dubs :frowning:', 1: "Dubs! Nice! Check'em!", 2: 'Trips?! Whoa, check those bad boys!',
                        3: 'Quads?! No way! Witnessed!', 4: "PENTS?! HOT DAMN! Now that's #rare.",
                        5: 'TOO MANY REPEATING DIGITS. GET THIS PERSON A MEDAL!', 6: 'LOWEST', 7: "HIGHEST"
                    }
                    numdict = {
                        "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
                        "6": "six", "7": "seven", "8": "eight", "9": "nine", "0": "zero"
                    }
                    prize_dict = {0: 1, 1: 10, 2: 100, 3: 250, 4: 500, 5: 750}
                    level_mod = math.log(self.user_data[message.author.id]["level"]) + 1

                    if drools > 1:
                        finalprize, out = 0, ""
                        for i in range(0, drools):
                            roll = str(random.randint(0, 1000000))
                            if roll in (0, 1000000):
                                out += wins_shortened[mappu((int(roll), 0, 1000000), (6, 7))]
                                finalprize += int(level_mod * 1000)
                                break
                            else:
                                win = 0

                                for i2 in range(-1, -len(roll), -1):
                                    if roll[i2] == roll[i2-1]:
                                        win += 1
                                    else:
                                        break

                                out += "{2} roll {0} {1}\n".format(str(i)+'. ',
                                                                   wins_shortened[win],
                                                                   ''.join([":{}:".format(numdict[i]) for i in roll]))
                                finalprize += prize_dict[win] * level_mod
                        finalprize = int(finalprize)
                        out += "You won {} dabs {} total!".format(finalprize, DAB_EMOJI)
                        self.user_data[message.author.id]["money"] += finalprize
                        yield from self.send_message(message.channel, out)

                    else:
                        roll = str(random.randint(0, 1000000))
                        win = 0

                        for i in range(-1, -len(roll), -1):
                            if roll[i] == roll[i-1]:
                                win += 1
                            else:
                                break

                        yield from self.send_message(message.channel, ''.join([":{}:".format(numdict[i]) for i in roll]))
                        if roll in ("0", "1000000"):
                            msg = "WOW! {} POSSIBLE ROLL! What does this mean?".format(win[mappu((int(roll), 0, 1000000), (0, 7))])
                            prize = int(level_mod * 1000)
                        else:
                            msg = wins[win]
                            prize = int(prize_dict[win] * level_mod)

                        msg += "\n"+"{} wins {} dabs. {}".format(message.author.nick or message.author.name,
                                                                 prize,
                                                                 DAB_EMOJI)
                        yield from self.send_message(message.channel, msg)
                        self.user_data[message.author.id]["money"] += prize
            else:
                yield from self.send_message(message.channel, "No daily dub rolls left. Try again tomorrow.")
            return

        if split[0] == "$level":
            yield from self.check_user(message.channel, message.author)
            level = self.user_data[message.author.id]["level"]
            if len(split) >= 2 and split[1] == "all":
                cost = int((level ** 2) / 11)
                money = self.user_data[message.author.id]["money"]
                if cost > money:
                    yield from self.send_message(message.channel, "You can't afford to level up at all right now.")
                    return
                templevel = 1
                while cost < money:
                    templevel += 1
                    cost += int(((level + templevel) ** 2) / 11)
                cost -= int(((level + templevel) ** 2) / 11)
                templevel -= 1
                yield from self.send_message(message.channel, "You can level up {} times and it would cost {} dabs.".format(templevel, cost))
                yield from self.send_message(message.channel, "Would you like to buy the level? `y/n`")
                check = lambda x: x.content.lower()[0] == "y" or x.content.lower()[0] == "n"
                response = yield from self.wait_for_message(timeout=10, channel=message.channel, author=message.author,
                                                            check=check)
                if response is not None and response.content.lower()[0] == "y":
                    self.user_data[message.author.id]["money"] -= cost
                    self.user_data[message.author.id]["level"] += templevel
                    level = self.user_data[message.author.id]["level"]
                    yield from self.send_message(message.channel, "You are now level {}!".format(level))
                    yield from self.update_json()

            else:
                cost = int((level ** 2) / 11)
                yield from self.send_message(message.channel, "You are level {}, to level up it costs {} dabs.".format(level, cost))
                if cost > self.user_data[message.author.id]["money"]:
                    yield from self.send_message(message.channel, "You can't afford it right now. :(")
                else:
                    yield from self.send_message(message.channel, "Would you like to buy the level? `y/n`")
                    check = lambda x: x.content.lower()[0] == "y" or x.content.lower()[0] == "n"
                    response = yield from self.wait_for_message(timeout=10, channel=message.channel,
                                                                author=message.author, check=check)
                    if response is not None and response.content.lower()[0] == "y":
                        self.user_data[message.author.id]["money"] -= cost
                        self.user_data[message.author.id]["level"] += 1
                        level = self.user_data[message.author.id]["level"]
                        yield from self.send_message(message.channel, "You are now level {}!".format(level))
                        yield from self.update_json()
            return

        yield from self.update_vars(message)

    @asyncio.coroutine
    def check_user(self, channel, member):
        if member == self.user:
            return

        if "182951530591158272" in [role.id for role in member.roles]:
            return

        if self.user_data.get(member.id) is None:
            yield from self.send_message(channel, "{} not found in database, 100 free dabs! {}".format(member.nick or member.name, DAB_EMOJI))
            self.user_data[member.id] = {"money": 100, "rolls": 10, "level": 1, "claimed": -1}

        if isinstance(self.user_data[member.id]["money"], str):
            return

        if self.user_data[member.id].get("record") is None:
            self.user_data[member.id]["record"] = self.user_data[member.id]["money"]

        if self.user_data[member.id]["record"] > self.user_data[member.id]["money"]:
            self.user_data[member.id]["record"] = self.user_data[member.id]["money"]

        if self.user_data[member.id]["claimed"] != time.gmtime().tm_yday:
            self.user_data[member.id]["claimed"] = time.gmtime().tm_yday
            level_mod = math.log(self.user_data[member.id]["level"])
            self.user_data[member.id]["rolls"] += int(level_mod * 10)
            yield from self.send_message(channel, "{} has {} daily rolls for dubs left.".format(member.nick or member.name, self.user_data[member.id]["rolls"]))

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
            self.shitpost_target = random.randint(10, 100)
        elif self.shitpost_count > self.shitpost_target:
            self.shitpost_count = 0
            self.shitpost_target = random.randint(10, 100)

        if self.dab_count == self.dab_target:
            dabs = random.randint(1, 10)
            with open("bca.jpg", "rb") as dabpic:
                msg = "{} dabs have appeared! DAB TO GET EM!".format(dabs)
                self.dab_announce = yield from self.send_file(message.channel, dabpic, content=msg)
            self.dab_count = 0
            self.dab_target = random.randint(20, 100)
            check = lambda x: "dab" in x.content.lower() and x.author != self.user
            claim = yield from self.wait_for_message(channel=message.channel, check=check)
            self.check_user(claim.channel, claim.author)
            msg = "{} has claimed {} dabs!".format(claim.author.nick or claim.author.name, dabs)
            award = yield from self.send_message(message.channel, msg)
            self.user_data[claim.author.id]["money"] += dabs
            if self.dab_announce is not None:
                yield from self.delete_message(self.dab_announce)
            yield from asyncio.sleep(10)
            yield from self.delete_message(award)
        elif self.dab_count > self.dab_target:
            self.dab_count = 0
            self.dab_target = random.randint(20, 100)

    @asyncio.coroutine
    def update_json(self):
        with open("user_data.json", "w") as json_file:
            json.dump(self.user_data, json_file)

if __name__ == "__main__":
    with open("token") as f:
        client = Client()
        client.run(f.read())
