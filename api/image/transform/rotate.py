from sys import argv
from skimage.transform import rotate
from skimage.io import imread
from PIL import Image
import skimage
import base64
import io
from ..util import to_img, to_base64


def rotate_image(img, **args):
    return to_base64(rotate(img, **args))