import discord
import asyncio
import json
import random

with open("user_money.json") as f:
    user_money = json.load(f)

client = discord.Client()
message_counter = [[0,random.randint(10,100)],[0,random.randint(10,100),0,None]]

@client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)
    print('------')

@client.event
async def on_message(message):
    if message.author == client.user:
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
            member = message.mentions[0]
        else:
            member = message.author
        money = user_money.get(member.id)
        if money != None:
            await client.send_message(message.channel, '{} has {} dabs <:ledabbinganimegirl:256497986979233792>'.format(member.nick or member.name, money))
        else:
            user_money[member.id] = 0
            await client.send_message(message.channel, '{} has {} dabs <:ledabbinganimegirl:256497986979233792>'.format(member.nick or member.name, 0))
        with open("user_money.json", "w") as f:
            json.dump(user_money, f)
        return

    elif split[0] == "$$give":
        if message.mentions == []:
            return
        if len(split) == 3:
            if split[1].isdigit():
                amount = split[1]
            elif split[2].isdigit():
                amount = split[2]
            else:
                return
            money = user_money.get(message.author.id)
            if money != None and money >= int(amount):
                user_money[message.author.id] -= int(amount)
                user_money[message.mentions[0].id] += int(amount)
                await client.send_message(message.channel, "{} gave {} dabs to {}!".format(message.author.nick or message.author.name, amount, message.mentions[0].nick or message.mentions[0].name))

    elif split[0] == "$$lb":
        lb = []
        if len(split) > 1 and split[1].isdigit():
            num = int(split[1])
        else:
            num = 10
        for user_id in user_money:
            member = message.server.get_member(user_id)
            if member == None:
                continue
            lb.append([member.nick or member.name, user_money[user_id]])
        lb = sorted(lb, key=lambda x: x[1], reverse=True)
        msg = ""
        for i in lb[:num]:
            msg += str(i) + "\n"
        await client.send_message(message.channel, msg)

    elif split[0] == "$$br":
        if split[1].isdigit():
            amount = int(split[1])
            if amount <= user_money[message.author.id]:
                user_money[message.author.id] -= amount
                num = random.randint(0,100)
                if num < 66:
                    await client.send_message(message.channel, "{} rolled {} and won no dabs.".format(message.author.nick or message.author.name, num))
                elif num < 90:
                    await client.send_message(message.channel, "{} rolled {} and won {} dabs!".format(message.author.nick or message.author.name, num, amount*2))
                    user_money[message.author.id] += amount * 2
                elif num < 100:
                    await client.send_message(message.channel, "{} rolled {} and won {} dabs for getting above 90!".format(message.author.nick or message.author.name, num, amount * 5))
                    user_money[message.author.id] += amount * 5
                elif num == 100:
                    await client.send_message(message.channel, "{} rolled {} and won {} dabs! PERFECT ROLL!".format(message.author.nick or message.author.name, num, amount*10))
                    user_money[message.author.id] += amount * 10

    elif split[0] == "$$bf":
        mindabs = 3
        if split[1].isdigit():
            amount = int(split[1])
            if (amount <= user_money[message.author.id] and amount >= mindabs and len(split) >= 3): #check for there to be a third element in list 'h' or 't'
                num = random.randint(0,101)
                win = 't' if num <= 49 else 'h'
                def fullname(hort):
                    if hort is 't':
                        return 'tails'
                    else:
                        return 'heads'
                
                if split[2] == win:
                    with open("makotocoin"+fullname(win)+".jpg","rb") as f:
                        await client.send_file(message.channel, f, content='{} congrats! You won {} dabs'.format(message.author.nick or message.author.name, round(1.8*amount))
                    user_money[message.author.id] += round(amount * 1.8)
                else:
                    with open("makotocoin"+fullname(split[2])+".jpg","rb") as f:
                        await client.send_file(message.channel, f, content='{} you picked {} and that\'s {}, you lose.'.format(message.author.nick or message.author.name, fullname(split[2]), fullname(win))
                    
            else: await client.send_message(message.channel, "{} please bet more than at least {}".format(message.author.nick or message.author.name, mindabs))
                


    global message_counter
    global user_money
    print(message_counter, message.author.name, message.content)
    message_counter[0][0] += 1
    if not "dab" in message.content.lower() and message.content.lower() != "dab":
        message_counter[1][0] += 1
    if message_counter[0][0] >= message_counter[0][1]:
        if random.randint(0,1):
            await client.send_message(message.channel, '^ interesting')
        else:
            await client.send_message(message.channel, 'I saw that.')
        message_counter[0][0] = 0
        message_counter[0][1] = random.randint(10,100)

    if message_counter[1][0] >= message_counter[1][1]:
        dabs = random.randint(1,10)
        with open("bca.jpg","rb") as f:
            message_counter[1][3] = await client.send_file(message.channel, f, content='{} dabs have appeared! DAB TO GET EM!'.format(dabs))
        message_counter[1][0] = 0
        message_counter[1][1] = random.randint(10,100)
        message_counter[1][2] += dabs

    if message_counter[1][2] > 0:
        if "dab" in message.content.lower():
            award = await client.send_message(message.channel, "{} has claimed {} dabs!".format(message.author.nick or message.author.name, message_counter[1][2]))
            if user_money.get(message.author.id) != None:
                user_money[message.author.id] += message_counter[1][2]
            else:
                user_money[message.author.id] = message_counter[1][2]
            message_counter[1][2] = 0
            await client.delete_message(message_counter[1][3])
            await asyncio.sleep(5)
            await client.delete_message(award)

client.run('MjU5NjYxODAzNjU3NjI1NjEw.C1KShA.vDLtCr-HdYdjvZvBJa3Pv2OPxaI')
