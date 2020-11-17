import base64
import skimage.io
from PIL import Image, ImageFile
import skimage
import base64
import io
import numpy as np
ImageFile.LOAD_TRUNCATED_IMAGES = True


def to_base64(image) -> str:

    # convert image to bytes
    with io.BytesIO() as output_bytes:
        PIL_image = Image.fromarray(skimage.img_as_ubyte(image))
        # Note JPG is not a vaild type here
        if PIL_image.mode in ("RGBA", "P"):
            PIL_image = PIL_image.convert("RGB")
        PIL_image.save(output_bytes, 'JPEG')
        bytes_data = output_bytes.getvalue()

    # encode bytes to base64 string
    base64_str = str(base64.b64encode(bytes_data), 'utf-8')
    return base64_str


def to_img(base64_string):
    base64_string += "=" * ((4 - len(base64_string) % 4) % 4)
    if isinstance(base64_string, bytes):
        print("instance_______")
        base64_string = base64_string.decode("utf-8")

    imgdata = base64.b64decode(base64_string)
    img = skimage.io.imread(imgdata, plugin='imageio')
    # return base64_string
    return img