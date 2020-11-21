from skimage.morphology import skeletonize
from skimage import color
from ..util import to_base64

def run(img):
    img = color.rgb2grey(img)
    return to_base64(skeletonize(img))
