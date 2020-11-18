from skimage import data, io
from skimage import exposure

I = data.chelsea()
print(I)
io.imshow(I)
io.show()
I_eq = exposure.equalize_hist(I)
io.imshow(I_eq)
io.show()