from skimage import data, io
from skimage.filters import scharr
from ..util import to_base64


def run(img, **args):
    img = scharr(img, **args)
    return to_base64(img)
