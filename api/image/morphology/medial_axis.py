from skimage.morphology import medial_axis, disk, square
from skimage import color, io, img_as_float
from ..util import to_base64


def run(img):
    if len(img.shape) > 2 and img.shape[2] == 4:
        img = color.rgba2rgb(img)
    if len(img.shape) == 2:
        img = color.gray2rgb(img)
    skel = medial_axis(color.rgb2gray(img), return_distance=False)
    return to_base64(skel)
