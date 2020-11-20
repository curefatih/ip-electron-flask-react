# import numpy as np
# import matplotlib.pyplot as plt
# from skimage.color import rgb2gray
# from skimage import data, io, color
# from skimage.filters import gaussian, sato
# from skimage.segmentation import active_contour


# img = data.astronaut()

# img = sato(img, mode='constant')

# io.imshow(img)

# plt.show()
import matplotlib.pyplot as plt
from skimage import data, io
# from skimage import filters
# camera = data.camera()
# edges = filters.sobel(camera)

# io.imshow(edges)
# plt.show()

# from skimage.filters import laplace
# import numpy as np
# im = rgb2gray(imread('../images/me8.jpg'))
# im1 = np.clip(laplace(im) + im, 0, 1)
# pylab.figure(figsize=(20,30))
# pylab.subplot(211), 
# plot_image(im, 'original image')
# pylab.subplot(212), 
# plot_image(im1, 'sharpened image')
# pylab.tight_layout()
# pylab.show()

from skimage.data import coins
from skimage.filters import threshold_isodata, scharr

image = coins()
thresh = threshold_isodata(image)
binary = image > thresh
edge_scharr = scharr(image)

io.imshow(edge_scharr)
plt.show()
