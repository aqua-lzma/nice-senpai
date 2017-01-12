import discord
import asyncio
import json
import random
from pybooru import Danbooru

DAB_EMOJI = "<:ledabbinganimegirl:256497986979233792>"
DAB_SYNTAX= """ `dabooru` syntax: `$dabooru [tags]`
Looks for an image on dabooru.
Make sure not to post naughte outside of lewd lole.
Optional arguments are: `naughte` and `sort`  
"""
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
dab = Danbooru("danbooru")

class Client(discord.Client):
    def __init__(self):
        self.shitpost_count = 0
        self.shitpost_target = random.randint(10,100)
        self.dab_count = 0
        self.dab_target = random.randint(10,100)
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
    def on_message_delete(message):
        await self.send_message(message.channel, message.author.mention + " I saw that.")

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
        if message.attachments:
            lastmedia = {"url":message.attachments[0]['url'],"name":message.attachments[0]['filename']}

        split = message.content.lower().split()
        
        if split[0] == "$$":
            self.check_user(message.channel, message.author)
            if message.mentions:
                self.check_user(message.channel, message.mentions[0])
                member = message.mentions[0]
                money = self.user_data[message.mentions[0].id]["money"]
            else:
                member = message.author
                money = self.user_data[message.author.id]["money"]
            await self.send_message(channel, '{} has {} dabs. {}'.format(member.nick or member.name, str(money), DAB_EMOJI))

        if split[0] == "$give":
            check_user(message.channel, message.author)
            if len(split) == 3 and message.mentions:
                check_user(message.channel, message.mentions[0])
                if split[1].isdigit():
                    amount = int(split[1])
                elif split[2].isdigit():
                    amount = int(split[2])
                else:
                    return
                if self.user_data[message.author.id]["money"] >= amount:
                    self.user_data[message.author.id]["money"] -= amount
                    self.give_money(amount, message.mentions[0])
                    name1 = message.author.nick or message.author.name
                    name2 = message.mentions[0].nick or message.mentions[0].name
                    await self.send_message(message.channel, "{} gave {} dab{} {} to {}.".format(name1, str(amount), 's' if amount>1 else "", DAB_EMOJI, name2))
                else:
                    await self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
                return
            await self.send_message(message.channel, GIVE_SYNTAX)

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
            await self.send_message(message.channel, msg)
        return

        if split[0] == "$br":
            self.check_user(message.channel, message.author)
            if split[1].isdigit():
                amount = int(split[1])
                if amount <= self.user_data[message.author.id]["money"]:
                    self.user_data[message.author.id] -= amount
                    num = random.radint(1,100)
                    if num < 66:
                        suffix = "no dabs. "
                    elif num < 90:
                        suffix = "{} dabs! ".format(amount*2)
                        self.user_data[message.author.id] += amount*2
                    elif num < 100:
                        suffix = "{} dabs for getting above 90! ".format(amount*5)
                        self.user_data[message.author.id] += amount*5
                    elif num == 100:
                        suffix = "{} dabs! PERFECT ROLL! ".format(amount*10)
                        self.user_data[message.author.id] += amount*10
                    prefix = "{} rolled {} and won ".format(message.author.nick or message.author.name, num)
                    msg = prefix + suffix + DAB_EMOJI
                    await self.send_message(message.channel, msg)
                else:
                    await self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
            else:
                await self.send_message(message.channel, BR_SYNTAX)
            return
        #will start working on sort command, you can test it, it should work
        #if split[0] == "$sort":
        #   if len(split) == 0:
        #       img = lastmedia['url']
        #       imgn= lastmedia['name']
        #   elif message.attachments:
        #       img = message.attachments[0]['url']
        #       imgn= message.attachments[0]['filename']
        #   else:
        #       img = split[1]
        #       imgn= imgn.split('/')[len(imgn.split('/')-1)
        #   with aiohttp.ClientSession() as session:
        #       async with session.get(img) as r:
        #           data = await r.read()
        #           with open(imgn, "wb") as f:
        #               f.write(data)
        #           if sorttype is "all":
        #               sort.all(imgn)
        #           else:
        #               sort.random(imgn, 50, times=1)
        #           await client.send_file(message.channel, imgn)
        if split[0] == "$dabooru":
            if len(split) > 1:
                if len(split) > 2:
                    if "naughte" in split: naughte = True
                    if "sort" in split: sort = True
                daburl = "http://danbooru.donmai.us%s"
                check = limit = 10
                imgs = dab.post_list(tags=[i for i in split[1:] if i not in ("naughte","sort")], limit=limit):
                rimg = random.choice(imgs)
                while "file_url" not in rimg.keys() and check >=1:
                    if not naughte:
                        while rimg['rating'] in ('q','e'):
                            rimg = random.choice(imgs)                   
                    rimg = random.choice(imgs)
                    check-=1
                if check == 0:
                    await self.send_message(message.channel, "I couldn't find anything for the tag{} `{}`".format("s" if len(split) >2 else "", " ".join(i for i in split[1:])
                else:
                    if sort:
                        with aiohttp.ClientSession() as session:
                            async with session.get(daburl+rimg['url']) as r:
                                data = await r.read()
                                with open(daburl+rimg['md5']+'.png', "wb") as f:
                                    f.write(data)
                        img.save(daburl+rimg['md5']+'.png', 'PNG')
                        sort.all(daburl+rimg['md5']+'.png')
                        await client.send_file(message.channel, daburl+rimg['md5']+'-sortrandom.png', content="score: {}".format(rimg["score"])
                    else:
                        await self.send_message(message.channel, "{}\n score: {} size: {}".format("http://danbooru.donmai.us"+rimg['file_url'], rimg["score"], rimg["image_width"]+" x "+rimg["image_height"]))                                                                                             
            else: await self.send_message(message.channel, DAB_SYNTAX)

        if split[0] == "$bf":
            self.check_user(message.channel, message.author)
            words = ["t", "h", "head", "tail", "heads", "tails"]
            if (split[1].isdigit() and split[2] in words) or (split[2].isdigit() and split[1] in words):
                if split[1].isdigit():
                    amount = int(split[1])
                    guess = split[2][0]
                else:
                    amount = int(split[2])
                    guess = split[1][0]
                if amount < 3:
                    await self.send_message(message.channel, "Minimal bet is 3.")
                    return
                if amount <= self.user_data[message.author.id]["money"]:
                    self.user_data[message.author.id] -= amount
                    if random.choice([True, False]):
                        with open("makotocoinhead.png", "rb") as f:
                            await self.send_file(message.channel, f, content="Coin flip: heads.")
                        success = guess == "h"
                    else:
                        with open("makotocoinhead.png", "rb") as f:
                            await self.send_file(message.channel, f, content="Coin flip: tails.")
                        success = guess == "f"
                    if success:
                        self.user_data[message.author.id] += int(amount*1.8)
                        await self.send_message(message.channel, "Congratz you win {} dabs! {}".fromat(int(amount*1.8),DAB_EMOJI))
                    else:
                        await self.send_message(message.channel, "You win nothing.")
                else:
                    await self.send_message(message.channel, "You don't have enough dabs. {}".format(DAB_EMOJI))
            else:
                await self.send_message(message.channel, BF_SYNTAX)
            return
        
        self.update_vars(message)

    def check_user(self, channel, member):
        if self.user_data.get(member.id) == None:
            await self.send_message(channel, "{} not found in database, 100 free dabs! {}".format(member.nick or member.name, DAB_EMOJI))
            self.user_data[member.id] = {"money":100}

    def give_money(self, amount, member):
        self.user_data[member.id][money] += amount
        self.update_json()

    def update_vars(self, message):
        self.shitpost_count += 1
        print("shitpost counter: {}\nshitpost target: {}".format(self.shitpost_count, self.shitpost_target))
        
        if "dab" in message.content.lower():
            print("dab message, skipping")
        else:
            self.dab_count += 1
            print("dab counter: {}\ndab target: {}".format(self.dab_count, self.dab_target))
        
        if self.shitpost_count == self.shitpost_target:
            await self.send_message(message.channel, '^ interesting.')
            self.shitpost_count = 0
            self.shitpost_target = random.randint(10,100)
        elif self.shitpost_count > self.shitpost_target:
            self.shitpost_count = 0
            self.shitpost_target = random.randint(10,100)
        
        if self.dab_count == self.dab_target:
            dabs = random.randint(1,10)
            with open("bca.jpg", "rb") as f:
                content = "{} dabs have appeared! DAB TO GET EM!".format(dabs)
                self.dab_announce = await self.send_message(message.channel, f, content=content)
            self.dab_count = 0
            self.dab_target = random.randint(1,100)
            self.dab_available += dabs
        elif self.dab_count > self.dab_target:
            self.dab_count = 0
            self.dab_target = random.randint(1,100)

        if self.dab_available > 0:
            if "dab" in message.content.lower():
                self.check_user(message.author)
                msg = "{} has claimed {} dabs!".format(message.author.nick or message.author.name, self.dab_available)
                award = await self.send_message(message.channel, msg)
                self.user_data[message.author.id]["money"] += self.dab_available
                self.dab_available = 0
                if self.dab_announce != None:
                    await self.message_delete(self.dab_announce)
                await asyncio.sleep(10)
                await self.message_delete(award)
                
    def update_json(self):
        with open("user_data.json", "w") as f:
            json.dump(self.user_data, f)

if __name__ == "__main__":
    with open("token") as f:
        Client.run(f.read())
