from skimage.morphology import dilation, disk
from skimage import color
from ..util import to_base64


def run(img):
    if len(img.shape) > 2 and img.shape[2] == 4:
        img = color.rgba2rgb(img)
    if len(img.shape) == 2:
        img = color.gray2rgb(img)
    img = color.rgb2gray(img)
    img = dilation(img, disk(6)[::None])
    return to_base64(img)
