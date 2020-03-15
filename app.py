from flask import Flask, render_template, request, jsonify
import json
import pandas as pd


from pca_analysis import get_indim_cumindim

app = Flask(__name__)

@app.route("/")
def home():

    data = pd.read_csv("data/main_data.csv")
    random_sampled_data = pd.read_csv("data/main_data_random.csv")
    stratified_sampled_data = pd.read_csv("data/main_data_stratified.csv")
    data_onehot = pd.read_csv("data/main_data_onehot.csv")

    #data_dim = get_indim_cumindim(data)
    random_sampled_data_dim = get_indim_cumindim(random_sampled_data)
    stratified_sampled_data_dim = get_indim_cumindim(stratified_sampled_data)
    data_onehot_dim = get_indim_cumindim(data_onehot) 

    
    """chart_data = data.to_dict(orient='records')
    chart_data = json.dumps(chart_data, indent=2)
    data = {'chart_data' : chart_data}"""

    return render_template("index.html",data=data_onehot_dim)

def convertData2JSON(data):
    #chart_data = data.to_dict(orient='records')
    chart_data = json.dumps(data, indent=2)
    data = {'chart_data' : chart_data}

    return data

if __name__ == "__main__":
    
    app.run(debug=True)

