from skimage.exposure import equalize_hist
from skimage import color
from ..util import to_img, to_base64


def run(img, **args):
    print("___", args)
    return to_base64(equalize_hist(img))
