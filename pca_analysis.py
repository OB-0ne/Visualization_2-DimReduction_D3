import numpy as np
import pandas as pd

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances

def get_MDS(data,distance_metric):
    
    mds_comp = MDS(n_components=2,dissimilarity="precomputed")
    similarity = pairwise_distances(data,metric=distance_metric)
    X_transformed = mds_comp.fit_transform(similarity)

    return X_transformed.tolist()

def get_PC_cols(n_PC):
    
    col = []
    for i in range(n_PC):
        col.append('PC'+ str(i+1))

    return col

def get_top3att(pca,col_name,pc_attr):

    loadings = pca.components_.T * np.sqrt(pca.explained_variance_)

    # make the PC column names
    pc_col = get_PC_cols(len(col_name))

    # for the dimension of the matrix look at the picture above
    loading_matrix = pd.DataFrame(loadings, columns=pc_col, index=col_name)
    
    # sum the PC column names for current clusters
    sum_column = loading_matrix["PC1"]
    for i in range(1,pc_attr):
        sum_column = sum_column + loading_matrix["PC" + str(i+1)]
    
    # add the sum column and sort it
    loading_matrix["Sum"] = sum_column
    loading_matrix = loading_matrix.sort_values(by=['Sum'],ascending=False)

    # get the top 3 appributes affecting the PCs
    top3 = []
    for i,row in enumerate(loading_matrix.index): 
        if i<3:
            top3.append(row)

    return top3

def get_indim_cumindim(data):

    #get the column length
    col_len = len(data.columns)
    #col_len = 16

    #get the pca for the data
    pca = PCA(n_components= col_len)
    principalComponents = pca.fit_transform(data)

    #make the intrincsic dimensionality with their names, sort it later
    dimensionality = pca.explained_variance_ratio_.tolist()
    cum_dimensionality = []
    for x in dimensionality:
        if len(cum_dimensionality)==0:
            cum_dimensionality.append(x)
        else:
            cum_dimensionality.append(x+cum_dimensionality[len(cum_dimensionality)-1])

    pca_top2list = pd.DataFrame(data = principalComponents, columns = get_PC_cols(len(principalComponents[0])))
    pca_top2list = pca_top2list[['PC1','PC2']].values.tolist()

    top3 = data[get_top3att(pca,data.columns, 5)].to_dict('records')

    return dimensionality, cum_dimensionality, pca_top2list, top3