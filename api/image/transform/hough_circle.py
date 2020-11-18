from sys import argv
from skimage.transform import hough_circle
from skimage.io import imread
from PIL import Image
import skimage
import base64
import io
from ..util import to_img, to_base64


def hough_circle_image(img, **args):
    return to_base64(hough_circle(img, **args))