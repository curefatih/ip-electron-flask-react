from skimage import data, io, img_as_float
from skimage.filters import laplace
from ..util import to_base64
import numpy as np  

def run(img, **args):
    img = img_as_float(img)
    img = laplace(img, **args)
    img = np.clip(laplace(img) + img, 0, 1)
    return to_base64(img)
