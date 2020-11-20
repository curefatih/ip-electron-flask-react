from skimage import data, io
from skimage.filters import meijering
from ..util import to_base64


def run(img, **args):
    img = meijering(img, **args)
    return to_base64(img)