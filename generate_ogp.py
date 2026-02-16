#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

img = Image.new("RGB", (W, H), (255, 255, 255))
draw = ImageDraw.Draw(img)

# Bradley Hand is closest to Caveat (handwritten style)
font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Bradley Hand Bold.ttf", 80)

text = "yaaawn"
bbox = draw.textbbox((0, 0), text, font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
x = (W - tw) // 2
y = (H - th) // 2

draw.text((x, y), text, font=font, fill=(187, 187, 187))

img.save("public/ogp.png", "PNG")
print(f"OGP image saved: {W}x{H}")
