from skimage import color
from skimage.filters import sato
from ..util import to_base64


def run(img, **args):
    if img.shape[2] == 4:
        img = color.rgba2rgb(img)
    return to_base64(sato(color.rgb2gray(img), **args))
