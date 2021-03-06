"""
Flask App for Data Viz Final Project
"""

from flask import Flask, Response, send_from_directory
import os
from data import load_data, population_by_year, filter_state,\
                    show_map, show_bar, show_scatter

data = load_data()

app = Flask(__name__, static_url_path='', static_folder='react_app/build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("react_app/build/" + path):
        return send_from_directory('react_app/build', path)
    return send_from_directory('react_app/build', 'index.html')

@app.route("/api/map/<year>")
def us_map(year):
    """
    Return the map of US census
    """
    response = ''

    try:
        response = show_map(population_by_year(year, data), 'US Census of {}'.format(year)).to_json()
    except:
        response = ''

    return Response(
        response,
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

@app.route('/api/bar/<year>/<state>')
def scatter_plot(year, state):
    """
    Return the altair json of STATE
    """
    response = ''

    try:
        response = show_scatter(data=data, year=year, state=state).to_json()
    except:
        response = ''

    return Response(
        response,
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

if __name__ == '__main__':
    app.run(debug=True)
