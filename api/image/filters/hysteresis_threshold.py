from skimage import data, io, color
from skimage.filters import apply_hysteresis_threshold
from ..util import to_base64


def run(img, **args):
    img = apply_hysteresis_threshold(color.rgb2gray(img), **args)
    return to_base64(img)
