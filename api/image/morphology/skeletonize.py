from skimage.morphology import skeletonize
from skimage import color
from ..util import to_base64

def run(img):
    if len(img.shape) > 2 and img.shape[2] == 4:
        img = color.rgba2rgb(img)
    if len(img.shape) == 2:
        img = color.gray2rgb(img)
    img = color.rgb2gray(img)
    return to_base64(skeletonize(img))
