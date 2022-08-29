from crypt import methods
from flask import Flask, render_template, request, url_for
import numpy as np
import pickle

app = Flask(__name__)

model = pickle.load(open('models/svc_model', 'rb'))
result = model.predict([["-0.4380491643116392","-0.22548256454796628","0.28404146638409844","0.8639126769427595"]])
# print(result)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
  return 0


if __name__ == "__main__":
    app.run(debug=True)
