from flask import Flask, send_from_directory

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def root(path):
    return send_from_directory('static', 'index.html')


if __name__ == '__main__':
    app.run()
