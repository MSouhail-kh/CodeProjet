from flask import Flask
import os
from config import Config
from models import db
from flask_migrate import Migrate
from flask_cors import CORS
from pythocode import main as main_blueprint
from flask_mail import Mail

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

migrate = Migrate(app, db)

CORS(app, supports_credentials=True, origins="https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app")

mail = Mail(app)

app.register_blueprint(main_blueprint)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
