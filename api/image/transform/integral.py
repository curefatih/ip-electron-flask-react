from sys import argv
from skimage.transform import integral_image
from skimage.io import imread
from PIL import Image
import skimage
import base64
import io
from ..util import to_img, to_base64


def run(img):
    return to_base64(integral_image(img))
