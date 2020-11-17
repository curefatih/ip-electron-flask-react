import sys
from flask import Flask, request, Response
from flask_cors import cross_origin
import logging
import image.transform.rotate as rotate
import image.transform.swirl as swirl
import base64
import imageio
import io
from skimage.io import imread, imshow, show
from skimage import feature, color, img_as_ubyte, img_as_ubyte
import cv2
import numpy as np
from PIL import Image, ImageFile

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


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)
