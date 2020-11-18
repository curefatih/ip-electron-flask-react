from skimage.exposure import adjust_gamma
from skimage import color
from ..util import to_img, to_base64

def run(img, **args):
    return to_base64(adjust_gamma(img, **args))