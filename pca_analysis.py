import numpy as np
import pandas as pd

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler


def get_indim_cumindim(data):

    #get the standard scaler for the data
    out = StandardScaler().fit_transform(data)

    #get the column length
    col_len = len(data.columns)

    #get the pca for the data
    pca= PCA(n_components= col_len)
    pca.fit_transform(out)

    #make the intrincsic dimensionality with their names, sort it later
    dimensionality = pca.explained_variance_ratio_
    cum_dimensionality = []
    for x in pca.explained_variance_:
        if len(cum_dimensionality)==0:
            cum_dimensionality.append(x)
        else:
            cum_dimensionality.append(x+cum_dimensionality[len(cum_dimensionality)-1])

    return [dimensionality, cum_dimensionality]