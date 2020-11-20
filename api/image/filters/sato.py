from skimage import color
from skimage.filters import sato
from ..util import to_base64


def run(img, **args):
    return to_base64(sato(color.rgb2gray(img), **args))
