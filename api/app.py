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
from werkzeug.exceptions import HTTPException
from PIL import Image, ImageFile

import image.transform.rotate as rotate
import image.transform.crop as crop
import image.transform.hough_circle as hc
import image.transform.swirl as swirl
import image.transform.down_scale as ds
import image.transform.integral as integral
import image.transform.resize as resize
import image.transform.affine_transform as affine_t
import image.transform.eq_hist as eh

import image.filters.window as window
import image.filters.median as median
import image.filters.sato as sato
import image.filters.sobel as sobel
import image.filters.prewitt as prewitt
import image.filters.laplace as laplace
import image.filters.unsharp_mask as unsharp_mask
import image.filters.meijering as meijering
import image.filters.scharr as scharr
import image.filters.hysteresis_threshold as hysteresis_threshold


import image.morphology.erosion as erosion
import image.morphology.dilation as dilation
import image.morphology.opening as opening
import image.morphology.closing as closing
import image.morphology.skeletonize as skeletonize
import image.morphology.convex_hull as convex_hull
import image.morphology.white_tophat as white_tophat
import image.morphology.black_tophat as black_tophat
import image.morphology.thin as thin
import image.morphology.medial_axis as medial_axis


import image.exposure.gamma as gamma
from skimage.exposure import equalize_adapthist

import image.histogram.show_histogram as sh

from image.util import to_base64

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


@app.errorhandler(Exception)
def handle_exception(e):
    # pass through HTTP errors
    if isinstance(e, HTTPException):
        return e

    # now you're handling non-HTTP exceptions only
    print(e)
    return {'err_type': type(e).__name__, 'err_message': str(e)}, 400


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


@app.route("/show_histogram", methods=['GET', 'POST'])
@cross_origin()
def show_histogram_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    # print(img.shape)
    img = sh.run(img)
    return Response(img)


@app.route("/window", methods=['GET', 'POST'])
@cross_origin()
def window_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = window.run(img, **opts['parameters'])
    return Response(img)


@app.route("/median", methods=['GET', 'POST'])
@cross_origin()
def median_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = median.run(img, **opts['parameters'])
    return Response(img)


@app.route("/crop", methods=['GET', 'POST'])
@cross_origin()
def crop_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    opt = {
        'crop_width': tuple([tuple(opts['parameters']['y']), tuple(opts['parameters']['x']), (0, 0)])
    }
    img = crop.run(img, **opt)
    return Response(img)


@app.route("/resize", methods=['GET', 'POST'])
@cross_origin()
def resize_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = resize.run(img, **opts['parameters'])
    return Response(img)


@app.route("/affine_transform", methods=['GET', 'POST'])
@cross_origin()
def affine_trasnform_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = affine_t.run(img, **opts['parameters'])
    return Response(img)


@app.route("/sato", methods=['GET', 'POST'])
@cross_origin()
def sato_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = sato.run(img, **opts['parameters'])
    return Response(img)


@app.route("/sobel", methods=['GET', 'POST'])
@cross_origin()
def sobel_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = sobel.run(img, **opts['parameters'])
    return Response(img)


@app.route("/prewitt", methods=['GET', 'POST'])
@cross_origin()
def prewitt_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = prewitt.run(img, **opts['parameters'])
    return Response(img)


@app.route("/laplace", methods=['GET', 'POST'])
@cross_origin()
def laplace_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = laplace.run(img, **opts['parameters'])
    return Response(img)


@app.route("/unsharp_mask", methods=['GET', 'POST'])
@cross_origin()
def unsharp_mask_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = unsharp_mask.run(img, **opts['parameters'])
    return Response(img)


@app.route("/meijering", methods=['GET', 'POST'])
@cross_origin()
def meijering_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = meijering.run(img, **opts['parameters'])
    return Response(img)


@app.route("/scharr", methods=['GET', 'POST'])
@cross_origin()
def scharr_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = scharr.run(img, **opts['parameters'])
    return Response(img)


@app.route("/hysteresis_threshold", methods=['GET', 'POST'])
@cross_origin()
def hysteresis_threshold_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = hysteresis_threshold.run(img, **opts['parameters'])
    return Response(img)


@app.route("/erosion", methods=['GET', 'POST'])
@cross_origin()
def erosion_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = erosion.run(img)
    return Response(img)


@app.route("/dilation", methods=['GET', 'POST'])
@cross_origin()
def dilation_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = dilation.run(img)
    return Response(img)


@app.route("/opening", methods=['GET', 'POST'])
@cross_origin()
def opening_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = opening.run(img)
    return Response(img)


@app.route("/skeletonize", methods=['GET', 'POST'])
@cross_origin()
def skeletonize_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = skeletonize.run(img)
    return Response(img)


@app.route("/convex_hull", methods=['GET', 'POST'])
@cross_origin()
def convex_hull_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = convex_hull.run(img, **opts['parameters'])
    return Response(img)


@app.route("/closing", methods=['GET', 'POST'])
@cross_origin()
def closing_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = closing.run(img)
    return Response(img)


@app.route("/white_tophat", methods=['GET', 'POST'])
@cross_origin()
def white_tophat_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = white_tophat.run(img)
    return Response(img)


@app.route("/thin", methods=['GET', 'POST'])
@cross_origin()
def thin_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = thin.run(img, **opts['parameters'])
    return Response(img)


@app.route("/black_tophat", methods=['GET', 'POST'])
@cross_origin()
def black_tophat_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = black_tophat.run(img)
    return Response(img)

#  -************* NOT WORKING after this

#  -************* In Processs


@app.route("/medial_axis", methods=['GET', 'POST'])
@cross_origin()
def medial_axis_route():
    opts = request.get_json()
    imgdata = base64.b64decode(opts['img'])
    img = imread(imgdata, plugin='imageio')
    img = medial_axis.run(img)
    return Response(img)


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)
