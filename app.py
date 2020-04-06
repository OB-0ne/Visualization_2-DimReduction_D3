from flask import Flask, render_template, request, jsonify
import json
import pandas as pd


from pca_analysis import get_indim_cumindim
from pca_analysis import get_MDS

from data_sampling import make_data

app = Flask(__name__)

#Check if the needed files exist for generate them
try:
    data_onehot = pd.read_csv("data/main_data_onehot.csv")
except:
    data_file = "data/bgg_db_2018_01.csv"
    make_data(data_file)

#read data files
random_sampled_data = pd.read_csv("data/main_data_random.csv")
stratified_sampled_data = pd.read_csv("data/main_data_stratified.csv")
data_onehot = pd.read_csv("data/main_data_onehot.csv")

#get the pca data into correct variables
dim_data, cumdim_data, top2pca_data, top3_data = get_indim_cumindim(data_onehot)
dim_data_random, cumdim_data_random, top2pca_data_random, top3_data_random = get_indim_cumindim(random_sampled_data)
dim_data_strat, cumdim_data_strat, top2pca_data_strat, top3_data_strat = get_indim_cumindim(stratified_sampled_data)

#get the MDS data
mds_data_co = get_MDS(data_onehot,"correlation")
mds_data_eu = get_MDS(data_onehot,"euclidean")
mds_data_random_co = get_MDS(random_sampled_data,"correlation")
mds_data_random_eu = get_MDS(random_sampled_data,"euclidean")
mds_data_strat_co = get_MDS(stratified_sampled_data,"correlation")
mds_data_strat_eu = get_MDS(stratified_sampled_data,"euclidean")

@app.route("/get_scree_data")
def get_Scree_data():

    data = {}

    temp = []
    temp.append(dim_data)
    temp.append(dim_data_random)
    temp.append(dim_data_strat)
    data["dim"] = temp

    temp = []
    temp.append(cumdim_data)
    temp.append(cumdim_data_random)
    temp.append(cumdim_data_strat)
    data["cumdim"] = temp

    return data

@app.route("/get_top2cpa_data")
def get_Top2PCA_data():

    data = {}

    data["data"] = top2pca_data
    data["data_rand"] = top2pca_data_random
    data["data_strat"] = top2pca_data_strat

    return data

@app.route("/get_mds_data/<datatype>")
def get_MDS_data(datatype):

    data = {}

    if datatype=="0":
        data["data"] = mds_data_co
        data["data_rand"] = mds_data_random_co
        data["data_strat"] = mds_data_strat_co
    else:
        data["data"] = mds_data_eu
        data["data_rand"] = mds_data_random_eu
        data["data_strat"] = mds_data_strat_eu
        
    return data

@app.route("/get_top3_data/<datatype>")
def get_Top3Attr_data(datatype):

    data = {}

    if datatype=="0":
        data["top3"] = top3_data
    elif datatype=="1":
        data["top3"] = top3_data_random
    else:
        data["top3"] = top3_data_strat

    return data

@app.route("/")
def home():   
    return render_template("index.html", data=get_Scree_data())

if __name__ == "__main__":
    
    app.run(debug=True)