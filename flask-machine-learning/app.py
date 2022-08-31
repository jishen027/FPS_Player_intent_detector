from asyncio import constants
from crypt import methods
from flask import Flask, render_template, request, url_for, jsonify, make_response
import numpy as np
import pickle

app = Flask(__name__)

model = pickle.load(open('models/poly_log_reg.pkl', 'rb'))
# result = model.predict([["-0.4380491643116392","-0.22548256454796628","0.28404146638409844","0.8639126769427595"]])
# print(result)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
  y = request.get_json()
  # y = [['0.15875571303897434', '0.1852250099182129', '-0.18601765731970468', '-0.0024889392985237967']]
  print(y)
  result = model.predict(y)
  print(result)

  res = make_response(jsonify({"result": str(result[0])}), 200)
  
  return res

if __name__ == "__main__":
    app.run(debug=True)
