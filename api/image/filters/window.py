import matplotlib.pyplot as plt
import numpy as np
from scipy.fftpack import fft2, fftshift
from skimage import img_as_float
from skimage.color import rgb2gray
from skimage.data import astronaut
from skimage.filters import window
from ..util import to_img, to_base64


def run(img, **args):
    image = img_as_float(img)
    wimage = image * window(shape=image.shape, **args)

    return to_base64(wimage)
