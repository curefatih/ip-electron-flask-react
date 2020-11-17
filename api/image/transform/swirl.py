from sys import argv
from skimage.transform import swirl
from skimage.io import imread
from PIL import Image
import skimage
import base64
import io
from ..util import to_img, to_base64

def swirl_image(img, **args):
    return to_base64(swirl(img, **args))