from PIL import Image, ImageFont, ImageDraw
import numpy as np
from io import BytesIO
import math
import matplotlib.pyplot as plt
from skimage import data, io, color

# from skimage.data import coins
# from skimage.filters import threshold_isodata, scharr

# from skimage import data
# from skimage.feature import Cascade

# import matplotlib.pyplot as plt
# from matplotlib import patches


# img = io.imread('IMG_20190128_234926.jpg')

# # img = color.rgba2rgb(img)
# # Load the trained file from the module root.
# trained_file = data.lbp_frontal_face_cascade_filename()

# # Initialize the detector cascade.
# detector = Cascade(trained_file)


# detected = detector.detect_multi_scale(img=img,
#                                        scale_factor=1.2,
#                                        step_ratio=1,
#                                        min_size=(60, 60),
#                                        max_size=(123, 123))

# plt.imshow(img)
# img_desc = plt.gca()
# plt.set_cmap('gray')

# for patch in detected:

#     img_desc.add_patch(
#         patches.Rectangle(
#             (patch['c'], patch['r']),
#             patch['width'],
#             patch['height'],
#             fill=False,
#             color='r',
#             linewidth=2
#         )
#     )

# plt.show()

# io.imshow(img)
# plt.show()


# import cv2
# font = cv2.FONT_HERSHEY_DUPLEX

# img = io.imread('Capture.PNG')
# # blank_img = color.rgba2rgb(img)
# blank_img = np.zeros([img.size[1], img.size[0], 3], dtype=np.uint8)
# blank_img = Image.fromarray(blank_img)

# txt = "FATIH"
# img_fraction = 0.90
# fontsize = 1
# font = ImageFont.truetype("arial.ttf", fontsize)

# while font.getsize(txt)[0] < img_fraction*blank_img.size[0]:
#     fontsize += 1
#     font = ImageFont.truetype("arial.ttf", fontsize)

# image_editable = ImageDraw.Draw(blank_img)
# image_editable.text((math.floor((blank_img.size[0] * 5) / 100), math.floor(
#     blank_img.size[0] / 2)), txt, (237, 230, 211), font=font, stroke_width=50)


# output = BytesIO()
# # blank_img = blank_img.convert(mode='RGB')
# blank_img.save(output, format='JPEG')
# blank_img = np.asanyarray(blank_img)

# io.imshow(blank_img)

# plt.show()


from matplotlib import pyplot as plt

from skimage import data, draw
from skimage.feature import corner_harris, corner_subpix, corner_peaks
from skimage.transform import warp, AffineTransform

img = io.imread('Capture.PNG')

tform = AffineTransform(scale=(1, 1), rotation=2,
                        shear=0.5, translation=(200, 100))
image_mask = warp(data.checkerboard(), tform.inverse,
                  output_shape=(img.shape[0], img.shape[1], 3))

img2 = img * image_mask

plt.imshow(img2, interpolation='nearest')
plt.axis('off')
plt.show()
