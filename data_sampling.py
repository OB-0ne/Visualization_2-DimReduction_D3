import numpy as np
import pandas as pd
import sklearn.cluster

from sklearn.preprocessing import StandardScaler

import matplotlib.pyplot as plt


def make_data(data_file):
    #get the main data file
    data = pd.read_csv(data_file)

    #scalar standarize the data and form a new pandas object
    out = StandardScaler().fit_transform(data)
    data_onehot = pd.DataFrame(out, columns = data.columns)

    #make random sampled data
    random_sampled_data = random_sampling(data_onehot)

    #make startified data
    stratified_sampled_data = stratified_sampling(data_onehot)

    #saving the generated data
    data.to_csv('data/main_data.csv',index=False)
    random_sampled_data.to_csv('data/main_data_random.csv',index=False)
    stratified_sampled_data.to_csv('data/main_data_stratified.csv',index=False)
    data_onehot.to_csv('data/main_data_onehot.csv',index=False)

def random_sampling(data):
    d_size = data.shape[0]
    #removing 75% of the data from the main data set
    new_size = 0.25
    new_size *= d_size
    new_size = int(new_size)

    return data.sample(new_size)

def get_k_value(data):

    err = []
    n_cluster = 15

    for i in range(0,n_cluster):
        kmeans = sklearn.cluster.KMeans(i+1, random_state=0).fit(data)
        err.append(kmeans.inertia_)
        print('Calculating k... ',i+1)

    plt.plot(err)
    plt.ylabel('Error by k')
    plt.show()

    print("Max: ",max(err))

def stratified_sampling(data):

    #change this as needed
    total_clusters = 4


    #perform kmeans to get the clusters
    kmeans = sklearn.cluster.KMeans(total_clusters, random_state=0).fit(data)

    #add the obtained clusters to the data
    data['cluster'] = pd.Series(kmeans.labels_, index=data.index)

    #make the sample data type
    stratified_sampled_data = pd.DataFrame(columns = data.columns)

    #filter each cluster and get sample data out of it
    for i in range(0,total_clusters):
        temp_data = data[data['cluster'] == i]
        n_samples = int(round(temp_data['cluster'].count()*0.25))
        temp_data = temp_data.sample(n_samples)
        stratified_sampled_data = pd.concat([stratified_sampled_data,temp_data],sort=False)
        
    stratified_sampled_data=stratified_sampled_data.drop("cluster",axis = 1)
    data = data.drop("cluster",axis = 1)

    return stratified_sampled_data