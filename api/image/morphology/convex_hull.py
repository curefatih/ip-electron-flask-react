from skimage.morphology import convex_hull_image
from skimage import color
from ..util import to_base64

def run(img, **args):
    print(args)
    img = color.rgb2grey(img)
    return to_base64(convex_hull_image(img, **args))
