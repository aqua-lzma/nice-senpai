from PIL import Image
import random as r
import sys
import os

def quicksort(px):
    #quicksort algorithm based on (R + G + B)
    if px == []:
        return px

    else:
        pivot = px[0]
        lesser = quicksort([x for x in px[1:] if (x[0] + x[1] + x[2]) < (pivot[0] + pivot[1] + pivot[2])])
        greater = quicksort([x for x in px[1:] if (x[0] + x[1] + x[2]) >= (pivot[0] + pivot[1] + pivot[2])])
        return lesser + [pivot] + greater

def all(image):
    img = Image.open(image)
    img = img.convert('RGBA')
    data = img.load()

    new = Image.new('RGBA', img.size)

    pixels = []
    sortd  = []
    #get existing pixels
    for y in range(img.size[1]):
        pixels.append([])
        for x in range(img.size[0]):
            pixels[y].append(data[x, y])
    #quicksort existing pixels over to sorted list
    for y in range(img.size[1]):
            sortd.append(quicksort(pixels[y]))

    #put them on the new image object
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            new.putpixel((x, y), sortd[y][x])

    #save
    new.save("{}-sortrandom.png".format((image).replace(".jpg","").replace(".png","").replace(".jpeg","")))


def random(image, intensity, times=1):
    while times >= 1:
        #randomly sort pixels

        if intensity > 100:
            intensity = 100

        print("Sorting {} with intensity {}".format(image, str(intensity)))
        img = Image.open(image)
        img = img.convert('RGBA')
        data = img.load()
        new = Image.new('RGBA', img.size)

        pixels = []
        sortd  = []
        #get existing pixels
        for y in range(img.size[1]):
            pixels.append([])
            for x in range(img.size[0]):
                pixels[y].append(data[x, y])
        #quicksort but pick a different starting point each diff line
        for y in range(img.size[1]):
            if r.randint(0, 100) > intensity:
                sortd.append(pixels[y]) #not sorting this pixel
            else:
                #
                #stole this bit of code because I didn't understand watafug my code wasnt working
                #
                minsort = r.randint(3, len(pixels[y]) - 3) #pick the start of the sorted area on this pixel line
                maxsort = r.randint(minsort, len(pixels[y]) - 1)# pick the end of the sorted area on this pixel line
                sort = []
                for x in range(minsort, maxsort):
                    sort.append(pixels[y][x]) 

                #sort them by brightness
                sort = quicksort(sort)

                i = 0
                for x in range(minsort, maxsort):
                    pixels[y][x] = sort[i]
                    i+=1

                sortd.append(pixels[y])
        #create the new image
        for y in range(img.size[1]):
            for x in range(img.size[0]):
                new.putpixel((x, y), sortd[y][x])
        if times > 1:
            new.save(image)
            times-=1
        else:
            new.save("{}-sortrandom.png".format((image).replace(".jpg","").replace(".png","").replace(".jpeg","")))

sys.setrecursionlimit(10000) 
#Increase recursion depth limit to avoid fails on larger images
#functions v
#sort.all(image_name)
#sort.random(image_name, random.randint(1, 100))
