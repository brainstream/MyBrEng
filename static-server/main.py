import pathlib
from flask import Flask, send_from_directory

application = app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def root(path):
    ext = pathlib.Path(path).suffix
    if ext == '.css' or ext == '.js' or ext == '.ico':
        return send_from_directory('static', path)
    else:
        return send_from_directory('static', 'index.html')


if __name__ == '__main__':
    app.run()
