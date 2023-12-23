# ''' pg_draw_circle_save101.py
# draw a blue solid circle on a white background
# save the drawing to an image file
# for result see http://prntscr.com/156wxi
# tested with Python 2.7 and PyGame 1.9.2 by vegaseat  16may2013
# '''

# import pygame as pg

# # pygame uses (r, g, b) color tuples
# white = (255, 255, 255)
# blue = (0, 0, 255)

# width = 300
# height = 300

# # create the display window
# win = pg.display.set_mode((width, height))
# # optional title bar caption
# pg.display.set_caption("Pygame draw circle and save")
# # default background is black, so make it white
# win.fill(white)

# # draw a blue circle
# # center coordinates (x, y)
# center = (width//2, height//2)
# radius = min(center)
# # width of 0 (default) fills the circle
# # otherwise it is thickness of outline
# width = 0
# # draw.circle(Surface, color, pos, radius, width)
# pg.draw.circle(win, blue, center, radius, width)

# # now save the drawing
# # can save as .bmp .tga .png or .jpg
# fname = "circle_blue.png"
# pg.image.save(win, fname)
# print("file {} has been saved".format(fname))

# # update the display window to show the drawing
# pg.display.flip()

# # event loop and exit conditions
# # (press escape key or click window title bar x to exit)
# while True:
#     for event in pg.event.get():
#         if event.type == pg.QUIT:
#             # most reliable exit on x click
#             pg.quit()
#             raise SystemExit
#         elif event.type == pg.KEYDOWN:
#             # optional exit with escape key
#             if event.key == pg.K_ESCAPE:
#                 pg.quit()
#                 raise SystemExit

from PIL import Image, ImageDraw

img = Image.new('RGBA', (200, 200), (255, 0, 0, 0))

draw = ImageDraw.Draw(img)
draw.ellipse((50, 50, 150, 150), fill=(255, 0, 0))

img = img.resize((100, 100), resample=Image.ANTIALIAS)

img.save('test.png', 'PNG')
