from skimage.morphology import opening, disk, square
from skimage import color, io
from ..util import to_base64


def run(img):
    img = color.rgb2grey(img)
    img = opening(img, disk(6))
    return to_base64(img)
