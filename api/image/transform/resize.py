from skimage.transform import resize
from ..util import to_img, to_base64

def run(img, **args):
    img = resize(img, **args)
    return to_base64(img)