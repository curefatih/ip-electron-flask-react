import numpy as np
import matplotlib.pyplot as plt
from skimage.color import rgb2gray, rgba2rgb
from skimage import data
from skimage.filters import gaussian
from skimage.segmentation import active_contour
from skimage.exposure import adjust_gamma
from ..util import to_img, to_base64
from io import BytesIO
import base64

def run(img, **args):
    if img.shape[2] == 4:
        img =rgba2rgb(img)
    img = rgb2gray(img)
    s = np.linspace(0, 2*np.pi, 400)
    r = args['row'] + args['radius']*np.sin(s)
    c = args['column'] + args['radius']*np.cos(s)
    init = np.array([r, c]).T
    snake = active_contour(gaussian(img, 3),
                       init, alpha=0.015, beta=10, gamma=0.001,
                       coordinates='rc')
    
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.imshow(img, cmap=plt.cm.gray)
    ax.plot(init[:, 1], init[:, 0], '--r', lw=3)
    ax.plot(snake[:, 1], snake[:, 0], '-b', lw=3)
    
    out_bytes = BytesIO()
    plt.savefig(out_bytes)

    return base64.b64encode(out_bytes.getvalue())







# fig, ax = plt.subplots(figsize=(7, 7))
# ax.imshow(img, cmap=plt.cm.gray)
# ax.plot(init[:, 1], init[:, 0], '--r', lw=3)
# ax.plot(snake[:, 1], snake[:, 0], '-b', lw=3)
# ax.set_xticks([]), ax.set_yticks([])
# ax.axis([0, img.shape[1], img.shape[0], 0])