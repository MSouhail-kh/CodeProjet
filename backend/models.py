from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ProduitPosition(db.Model):
    __tablename__ = 'positions_produit'
    produit_id = db.Column(db.Integer, db.ForeignKey('produit.id'), primary_key=True)
    position_id = db.Column(db.Integer, db.ForeignKey('position.id'), primary_key=True)

class Produit(db.Model):
    __tablename__ = 'produit'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
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
    descriptions = db.Column(db.Text)
    coloris = db.Column(db.Text)
    po = db.Column(db.Text)

class Position(db.Model):
    __tablename__ = 'position'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
