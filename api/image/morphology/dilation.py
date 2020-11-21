from skimage.morphology import dilation, disk
from skimage import color
from ..util import to_base64


def run(img):
    img = color.rgb2grey(img)
    img = dilation(img, disk(6)[::None])
    return to_base64(img)
