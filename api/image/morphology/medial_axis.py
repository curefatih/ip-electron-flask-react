from skimage.morphology import medial_axis, disk, square
from skimage import color, io, img_as_float
from ..util import to_base64


def run(img):
    skel = medial_axis(color.rgb2gray(img), return_distance=False)
    return to_base64(skel)
