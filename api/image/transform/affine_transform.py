from skimage.util import crop
from skimage.transform import AffineTransform, warp
from skimage import color
from ..util import to_img, to_base64
import numpy as np


def run(img, **args):
    tform = AffineTransform(**args)
    tf_img = warp(img, tform.inverse)
    return to_base64(tf_img)
