from skimage.morphology import black_tophat, disk, square
from skimage import color, io
from ..util import to_base64


def run(img):
    if len(img.shape) > 2 and img.shape[2] == 4:
        img = color.rgba2rgb(img)
    if len(img.shape) == 2:
        img = color.gray2rgb(img)
    img = color.rgb2grey(img)
    img = black_tophat(img, disk(1))
    return to_base64(img)
