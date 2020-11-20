from skimage import data, io
from skimage.filters import unsharp_mask
from ..util import to_base64


def run(img, **args):
    img = unsharp_mask(img, **args)
    return to_base64(img)