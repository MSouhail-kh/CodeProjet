from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    prénom = db.Column(db.String(100), nullable=False)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(2000), nullable=False)
    token = db.Column(db.String(2000))
    role = db.Column(db.String(50), default='user')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @staticmethod
    def generate_reset_token():
        return str(uuid.uuid4())

class ProduitPosition(db.Model):
    __tablename__ = 'positions_produit'
    produit_id = db.Column(db.Integer, db.ForeignKey('produit.id'), primary_key=True)
    position_id = db.Column(db.Integer, db.ForeignKey('position.id'), primary_key=True)

class Produit(db.Model):
    __tablename__ = 'produit'
    id = db.Column(db.Integer, primary_key=True)
    style = db.Column(db.String(100), nullable=False)
    position_id = db.Column(db.Integer, db.ForeignKey('position.id'), nullable=False)
    titre = db.Column(db.String(255))
    image = db.Column(db.Text)
    qty = db.Column(db.Float)
    dossier_technique = db.Column(db.Text)
    dossier_serigraphie = db.Column(db.Text)
    bon_de_commande = db.Column(db.Text)
    patronage = db.Column(db.Text)
    date_reception_bon_commande = db.Column(db.Date)
    date_livraison_commande = db.Column(db.Date)
    coloris = db.Column(db.Text)
    po = db.Column(db.Text)
    brand = db.Column(db.String(255))
    type_de_commande = db.Column(db.String(255))
    etat_de_commande = db.Column(db.String(255))
    reference = db.Column(db.String(255))
    type_de_produit = db.Column(db.String(255))

class Position(db.Model):
    __tablename__ = 'position'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
