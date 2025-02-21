from flask import Flask
import os
from config import Config
from models import db
from flask_migrate import Migrate
from flask_cors import CORS
from pythocode import main as main_blueprint

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

app.register_blueprint(main_blueprint)

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG') == 'True')
