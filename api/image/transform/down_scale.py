from skimage.transform import downscale_local_mean
from skimage import color
from ..util import to_img, to_base64


def run(img, **args):
    # args['factors'] = tuple(args['factors'])
    # img = color.rg(img)
    return to_base64(downscale_local_mean(img, (1,2,3), cval=2))
