from skimage import data, io
from skimage.filters import sobel
from ..util import to_base64


def run(img, **args):
    img = sobel(img, **args)
    return to_base64(img)
