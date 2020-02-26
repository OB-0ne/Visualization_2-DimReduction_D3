from flask import Flask, render_template, request, jsonify
import json
import pandas as pd

app = Flask(__name__)

@app.route("/")
def helloWorld():

    global df

    """if request.method == 'POST':
        data = df[['MONTH2','DAY2']]
        #data = data.rename(columns ={'open':'close'})
        print (data)
        print('Hello World!')
        chart_data = data.to_dict(orient='records')
        chart_data = json.dumps(chart_data, indent=2)
        data = {'chart_data' : chart_data}

        return jsonify(data)"""


    data = df[['MONTH2','DAY2']]
    chart_data = data.to_dict(orient='records')
    chart_data = json.dumps(chart_data, indent=2)
    data = {'chart_data' : chart_data}

    print("Hello World!")
    return render_template("index.html",data=data)


if __name__ == "__main__":
    df = pd.read_csv('data/NYC_saf_noconsent_2019.csv')
    app.run(debug=True)