import sys
from flask import Flask, request, Response
from flask_cors import cross_origin
import logging
import base64
import imageio
import io
from skimage.io import imread, imshow, show
from skimage import feature, color, img_as_ubyte, img_as_ubyte
import cv2
import numpy as np
from PIL import Image, ImageFile
import image.transform.rotate as rotate
import image.transform.swirl as swirl
import image.exposure.gamma as gamma
import image.transform.hough_circle as hc
import image.transform.integral as integral
import image.transform.down_scale as ds
import image.transform.eq_hist as eh
from image.util import to_base64
from skimage.exposure import equalize_adapthist
ImageFile.LOAD_TRUNCATED_IMAGES = True

def to_byte_data(image) -> str:

    with io.BytesIO() as output_bytes:
        PIL_image = Image.fromarray(img_as_ubyte(image))
        if PIL_image.mode in ("RGBA", "P"):
            PIL_image = PIL_image.convert("RGB")
        PIL_image.save(output_bytes, 'JPEG')
        bytes_data = output_bytes.getvalue()
    return bytes_data


app = Flask(__name__)


def gen_frames():
    camera = cv2.VideoCapture(0)
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            img = base64.b64encode(frame)
            imgdata = base64.b64decode(img)
            img = imread(imgdata, plugin='imageio')
            img = color.rgb2gray(img)
            img = feature.canny(img, 2)

            frame = to_byte_data(img)

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result

    camera.release()


@app.route("/video_feed", methods=['GET', 'POST'])
@cross_origin()
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/rotate", methods=['GET', 'POST'])
@cross_origin()
def rotate_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = rotate.rotate_image(img, **opts['parameters'])
    return Response(img)

@app.route("/swirl", methods=['GET', 'POST'])
@cross_origin()
def swirl_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = swirl.swirl_image(img, **opts['parameters'])
    return Response(img)

@app.route("/gamma", methods=['GET', 'POST'])
@cross_origin()
def gamma_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = gamma.run(img, **opts['parameters'])
    return Response(img)

@app.route("/eq_hist", methods=['GET', 'POST'])
@cross_origin()
def eq_hist_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = eh.run(img, **opts['parameters'])
    return Response(img)

@app.route("/equalize_adapthist", methods=['GET', 'POST'])
@cross_origin()
def equalize_adapthist_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    if opts['parameters']['kernel_size'] == 0:
        opts['parameters']['kernel_size'] = None 
    img = to_base64(equalize_adapthist(img, **opts['parameters']))
    return Response(img)
    
#  -************* NOT WORKING after this

@app.route("/hough_circle", methods=['GET', 'POST'])
@cross_origin()
def hough_circle_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = hc.hough_circle_image(img, **opts['parameters'])
    return Response(img)

@app.route("/integral_image", methods=['GET', 'POST'])
@cross_origin()
def intragral_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = integral.run(img)
    return Response(img)

@app.route("/downscale", methods=['GET', 'POST'])
@cross_origin()
def down_scale_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    # print(img.shape)
    img = ds.run(img, **opts['parameters'])
    return Response(img)


#  -************* In Processs



if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)
