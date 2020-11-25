from image.util import to_img, to_base64
from skimage import color, io
from skimage.filters import median
from skimage.morphology import ball
from skimage.filters import unsharp_mask
from skimage.exposure import equalize_hist
from skimage.exposure import adjust_gamma
from skimage.util import crop
import numpy as np
from skimage.transform import resize
import os


def run(img):
  
    if len(img.shape) > 2 and img.shape[2] == 4:
        img = color.rgba2rgb(img)
    if len(img.shape) == 2:
        img = color.gray2rgb(img)

    med = median(img, ball(4))
    usm = unsharp_mask(med, radius=2, amount=1)
    eqh = adjust_gamma(usm, gamma=2)

    mask = color.rgb2gray(io.imread(os.path.dirname(os.path.abspath(__file__)) + './barcode.png'))
    mask = resize(mask, eqh.shape)

    return to_base64(eqh * mask)