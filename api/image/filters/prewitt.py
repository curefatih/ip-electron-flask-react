from skimage import color
from skimage.filters import prewitt
from ..util import to_base64


def run(img, **args):
    return to_base64(prewitt(img, **args))
