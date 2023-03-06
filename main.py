from flask import Flask, render_template, request, jsonify
from fastai.vision.all import *
import torchvision.transforms as T
from datetime import datetime
import PIL
import os
import pathlib
from custom_functions import *


plt = platform.system()
if plt == 'Windows': pathlib.PosixPath = pathlib.WindowsPath

cwd = os.getcwd()
path = cwd + '/model'
model = load_learner(path + '/model.pkl')

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    """Transfering uploaded image by user to the model"""
    try:
        file = request.files['user-img'].read()
        pred = model.predict(file)[0]
        pred = "Unknown" if len(pred) == 0 else str(pred[0]) # Prediction is a list with predicted classes

        result = {"result": pred}
        return jsonify(result)
    except:
       return jsonify({"result": "Something went wrong, please try uploading the file again"})

@app.route("/report", methods=["POST"])
def report():
    """Saving reported photos uploaded to the model by the user"""
    if not os.path.isdir(path+'/reports'):
        os.mkdir(path+'/reports')
    report_path = os.path.join(path, 'reports')

    file = request.files['report-img']
    filename = request.form['class-name']
    filename += datetime.now().strftime("_%d-%m-%Y_%H-%M-%S")

    img = PIL.Image.open(file)
    img.save(report_path + f'/{filename}.jpg')

    return jsonify({"result": "Report succesful !"})



@app.route('/')
def index():
    return render_template("index.html")

if __name__=='__main__':
    app.run(host='0.0.0.0', port=5000)