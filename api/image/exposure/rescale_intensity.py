from skimage.exposure import rescale_intensity
from skimage import color, img_as_float
from ..util import to_img, to_base64

def run(img, **args):
    img_float = img_as_float(img)
    
    if isinstance(args['in_range'], list):
      args['in_range'] = tuple(args['in_range'])
    if isinstance(args['out_range'], list):
      args['out_range'] = tuple(args['out_range'])
    return to_base64(rescale_intensity(img_float, **args))