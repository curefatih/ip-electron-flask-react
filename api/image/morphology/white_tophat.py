from skimage.morphology import white_tophat, disk, square
from skimage import color, io
from ..util import to_base64


def run(img):
    img = color.rgb2grey(img)
    img = white_tophat(img, disk(1))
    return to_base64(img)
