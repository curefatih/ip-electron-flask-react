from skimage.morphology import thin
from skimage import color
from ..util import to_base64


def run(img, **args):
    print(args)
    img = color.rgb2grey(img)
    return to_base64(thin(img, **args))
