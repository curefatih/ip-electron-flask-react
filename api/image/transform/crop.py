from skimage.util import crop
from skimage.exposure import equalize_hist
from skimage import color
from ..util import to_img, to_base64

def run(img, **args):
    img = crop(img, copy=False, **args)
    return to_base64(img)