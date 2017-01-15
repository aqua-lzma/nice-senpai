#!/usr/bin/python3.5
import discord
import asyncio
import json
import random
import time

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

def prettyTable(l):
    maxs = [max(map(lambda x:len(str(x[i])),l)) for i in range(len(l[0]))]
    for row in range(len(l)):
        for col in range(len(l[row])):
            l[row][col] = str(l[row][col]) + (" " * (maxs[col] - len(str(l[row][col]))))
    l = list(map(lambda x:[""] + x + [""],l))
    dashes = list(map(lambda x:"━"*x,maxs))
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

def formatLevel(inp):
    inp *= 10
    inp -= 9
    return int(inp)

def mappu(old, new):
    #translates a num range to another
    #oldvalue to be translated goes mappu((HERE, 0,100),(0,62849725982795))
    if len(old) == 3 and len(new) == 2:
        old_v = old[0]
        old_mi= min(old[1:3])
        old_ma= max(old[1:3])
        new_mi= min(new)
        new_ma= max(new)
            
        return ( (old_v - old_mi) / (old_ma - old_mi) ) * (new_ma - new_mi) + new_mi

class Client(discord.Client):
    def __init__(self):
        super().__init__()
        self.shitpost_count     = 0
        self.shitpost_target    = random.randint(50,200)
        self.dab_count          = 0
        self.dab_target         = random.randint(20,100)
        self.dab_announce       = None
        self.niceroles          = [i.name for i in [server for server in self.servers if server is "Nice"][0].roles]
        self.prices             = {
            "roles":{
                'Radio Mod': 1000 },
            "items":{
                'droll x 10': 100 }
        }
        #self.voice             = discord.VoiceClient(**k

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
        if "182951530591158272" in [role.id for role in message.author.roles]:
            return

        split = message.content.split()

        if split[0] == "$$":
            yield from self.check_user(message.channel, message.author)
            if message.mentions:
                yield from self.check_user(message.channel, message.mentions[0])
                if self.user_data.get(message.mentions[0].id) == None:
                    return
                member = message.mentions[0]
            else:
                member = message.author
            money = self.user_data[member.id]["money"]
            level = self.user_data[member.id]["dubs"]["level"]
            level = formatLevel(level)
            rolls = self.user_data[member.id]["dubs"]["rolls"]
            fmt = [member.nick or member.name, money, DAB_EMOJI, level, rolls]
            msg =  "{0} has {1} dabs. {2}\n{0} is level {3} and has {4} rolls left today.".format(*fmt)
            yield from self.send_message(message.channel, msg)

        if split[0] == "$give":
            yield from self.check_user(message.channel, message.author)
            if len(split) == 3 and message.mentions:
                yield from self.check_user(message.channel, message.mentions[0])
                if self.user_data.get(message.mentions[0].id) == None:
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
                    yield from self.send_message(message.channel, "{} gave {} dabs {} to {}.".format(name1, str(amount), DAB_EMOJI, name2))
                else:
                    yield from self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
                return
            yield from self.send_message(message.channel, GIVE_SYNTAX)

        if split[0] == "$buy":
            yield from self.check_user(message.channel, message.author)
            #a command would go like so : $buy role:radio-mod
            #                           : $buy item:drollticket
            if len(split) != 1:
                stuff = split[1].split(':')
                if stuff[0] in self.buyables:
                    if len(stuff) > 1:
                        if stuff[1].lower() in self.niceroles:
                            if self.user_data[message.author.id]["money"] >= self.prices[name]:
                                self.user_data[message.author.id]["money"] -= self.prices[name]
                                yield from self.send_message(message, "You bought the {} role {} woo!".format(discord.utils.get([i.lower() for i in message.server.roles], name=name).mention, (message.author.nick or message.author.name)))
                                self.add_roles(discord.utils.get([i.lower() for i in message.server.roles], name=name), discord.utils.get(message.server.members, id=message.author.id))
                    elif stuff[0].lower() in ('r','role'):
                        yield from self.send_message(message.channel, "You can buy the following roles: \n{}".format('\n'.join([i+' '+str(self.rolePrices[i])+DAB_EMOJI for i in self.rolePrices.keys()])))
                    elif stuff[0].lower() in ('i','item'):
                        yield from self.send_message(message.channel, "You can buy the following items: \n{}".format('\n'.join([i+' '+str(self.itemPrices[i])+DAB_EMOJI for i in self.itemPrices.keys()])))
                else:

                #self.user_data[message.author.id]["money"]

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
            lb.sort(key=lambda x:x[1], reverse=True)
            lb = "```" + prettyTable(lb[:num]) + "```"
            yield from self.send_message(message.channel, lb)
            return

        if split[0] == "$br":
            yield from self.check_user(message.channel, message.author)
            if len(split) >= 2 and split[1].isdigit():
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
            if len(split) >= 3 and ((split[1].isdigit() and split[2] in words) or (split[2].isdigit() and split[1] in words)):
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
                        with open("makotocointails.png", "rb") as f:
                            yield from self.send_file(message.channel, f, content="Coin flip: tails.")
                        success = guess == "t"
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

        if split[0] == "$del":
            if len(split) == 2 and message.mentions and message.author.id == "147790355776012289":
                if self.user_data.get(message.mentions[0].id) != None:
                    del self.user_data[message.mentions[0].id]
                    yield from self.send_message(message.channel, "{} deleted from database.".format(message.mentions[0].nick or message.mentions[0].name))
                else:
                    yield from self.send_message(message.channel, "{} not found in database.".format(message.mentions[0].nick or message.mentions[0].name))
            return
        yield from self.update_vars(message)

        if split[0] == "$drool":
            yield from self.check_user(message.channel, message.author)
            if self.user_data[message.author.id]["dubs"]["rolls"] > 0:
                self.user_data[message.author.id]["dubs"]["rolls"] -= 1
                roll = str(random.randint(0,1000000))
                win = 1
                wins = {
                    0:'LOWEST',
                    1:'No dubs :frowning:',
                    2:'Dubs! Nice! Check\'em!',
                    3:'Trips?! Whoa, check those bad boys!',
                    4:'Quads?! No way! Witnessed!',
                    5:'PENTS?! HOT DAMN! Now that\'s #rare.',
                    6:'TOO MANY REPEATING DIGITS. GET THIS PERSON A MEDAL!',
                    'prize':'int(self.user_data[message.author.id]["dubs"]["level"] * (win*10))',
                    7:'HIGHEST'
                }
                for i in range(-1, -len(roll), -1):
                    if roll[i] == roll[i-1]:
                        win += 1
                    else:
                        break
                yield from self.send_message(message.channel, ''.join([":{}:".format(inflect.engine().number_to_words(int(i))) for i in roll]))
                if roll in ("0","1000000"):
                    msg = "WOW! {} POSSIBLE ROLL! What does this mean?".format(win[mappu((int(roll),0,1000000),(0,7))]) 
                    prize = int(self.user_data[message.author.id]["dubs"]["level"] * 100)
                else:
                    msg   = wins[win]
                    prize = eval(wins[prize])

                msg += "\n"+"{} wins {} dabs. {}".format(message.author.nick or message.author.name, prize, DAB_EMOJI)
                yield from self.send_message(message.channel, msg)
                self.user_data[message.author.id]["money"] += prize
            else:
                yield from self.send_message(message.channel, "No daily dub rolls left. Try again tomorrow.")
            return


    @asyncio.coroutine
    def check_user(self, channel, member):
        if member == self.user:
            return
        if "182951530591158272" in [role.id for role in member.roles]:
            return
        if self.user_data.get(member.id) == None:
            yield from self.send_message(channel, "{} not found in database, 100 free dabs! {}".format(member.nick or member.name, DAB_EMOJI))
            self.user_data[member.id] = {"money":100}
        if self.user_data[member.id].get("dubs") == None:
            dubs = {"rolls":10,"level":1.0,"claimed":time.gmtime().tm_yday}
            self.user_data[member.id]["dubs"] = dubs
        if self.user_data[member.id]["dubs"]["claimed"] != time.gmtime().tm_yday:
            self.user_data[member.id]["dubs"]["claimed"] = time.gmtime().tm_yday
            self.user_data[member.id]["dubs"]["rolls"] += int(self.user_data[member.id]["dubs"]["level"] * 10)
            yield from self.send_message(channel, "{} has {} daily rolls for dubs left.".format(member.nick or member.name, self.user_data[member.id]["dubs"]["rolls"]))
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
            self.dab_target = random.randint(20,100)
            check = lambda x: "dab" in x.content.lower() and x.author != self.user
            claim = yield from self.wait_for_message(channel=message.channel, check=check)
            self.check_user(claim.channel, claim.author)
            msg = "{} has claimed {} dabs!".format(claim.author.nick or claim.author.name, dabs)
            award = yield from self.send_message(message.channel, msg)
            self.user_data[claim.author.id]["money"] += dabs
            if self.dab_announce != None:
                yield from self.delete_message(self.dab_announce)
            yield from asyncio.sleep(10)
            yield from self.delete_message(award)
        elif self.dab_count > self.dab_target:
            self.dab_count = 0
            self.dab_target = random.randint(20,100)

    @asyncio.coroutine
    def update_json(self):
        with open("user_data.json", "w") as f:
            json.dump(self.user_data, f)

if __name__ == "__main__":
    with open("token") as f:
        client =  Client()
        client.run(f.read())

