from skimage.filters import median
from skimage.morphology import disk, ball
from ..util import to_base64


def run(img, **args):
    med = median(img, ball(5))
    return to_base64(med)
