from flask_mail import Mail, Message
from flask_cors import CORS ,cross_origin
import jwt
from functools import wraps
from flask import Blueprint, jsonify, request, current_app, send_from_directory , make_response
from datetime import datetime, timedelta, timezone
from werkzeug.utils import secure_filename
import pandas as pd
import os
from models import db, Produit,User
import uuid
mail = Mail()

def send_reset_email(email, reset_link):
    msg = Message(
        subject="Réinitialisation de votre mot de passe",
        sender="no-reply@votreapp.com",
        recipients=[email]
    )
    msg.body = f"Pour réinitialiser votre mot de passe, cliquez sur ce lien : {reset_link}"
    mail.send(msg)

main = Blueprint('main', __name__)
CORS(main, supports_credentials=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@main.record_once
def on_load(state):
    mail.init_app(state.app)

def generate_token(email):
    utc_now = datetime.now(timezone.utc)
    payload = {
        'email': email,
        'exp': utc_now + timedelta(minutes=30),
        'iat': utc_now
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
blacklisted_tokens = set()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            response = make_response()
            response.headers.add('Access-Control-Allow-Origin', 'https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response, 200

        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({'message': 'Token manquant!'}), 401

        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_email = payload['email']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expiré!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token invalide!'}), 401

        return f(current_user_email, *args, **kwargs)
    return decorated

@main.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origin='https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app', supports_credentials=True)
def login():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request handled'})
        response.headers.add('Access-Control-Allow-Origin', 'https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email et mot de passe requis'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'message': 'Email ou mot de passe invalide'}), 401

    token = generate_token(email)
    return jsonify({'token': token}), 200

@main.route('/signup', methods=['POST', 'OPTIONS'])
@cross_origin(origin='https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app', supports_credentials=True)
def signup():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request handled'})
        response.headers.add('Access-Control-Allow-Origin', 'https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    data = request.get_json()
    prénom = data.get('prénom')
    nom = data.get('nom')
    email = data.get('email')
    password = data.get('password')

    if not prénom or not nom or not email or not password:
        return jsonify({'message': 'Prénom, nom, email et mot de passe requis'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Cet email est déjà utilisé'}), 400

    token = generate_token(email) 

    new_user = User(prénom=prénom, nom=nom, email=email, token=token)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    response = jsonify({'token': token})
    return response, 201

@main.route('/user', methods=['GET', 'OPTIONS'])
@cross_origin(origin='https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app', supports_credentials=True)
@token_required
def get_user(current_user_email):
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404

    user_data = {
        'prénom': user.prénom,
        'nom': user.nom,
        'email': user.email
    }
    response = jsonify(user_data)
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, 200

@main.route('/produits', methods=['GET'])
def get_produits():
        BASE_URL = "https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app"
        produits = Produit.query.all()
        produits_dict = {
            produit.id: {
                'id': produit.id,
                'style': produit.style,  
                'image': f"{BASE_URL}/static/uploads/{produit.image}" if produit.image else None,
                'qty': produit.qty,
                'dossier_technique': f"{BASE_URL}/static/uploads/{produit.dossier_technique}" if produit.dossier_technique else None,
                'dossier_serigraphie': f"{BASE_URL}/static/uploads/{produit.dossier_serigraphie}" if produit.dossier_serigraphie else None,
                'bon_de_commande': f"{BASE_URL}/static/uploads/{produit.bon_de_commande}" if produit.bon_de_commande else None,
                'patronage': f"{BASE_URL}/static/uploads/{produit.patronage}" if produit.patronage else None,
                'date_reception_bon_commande': produit.date_reception_bon_commande,
                'date_livraison_commande': produit.date_livraison_commande,
                'position_id': produit.position_id,
                'po': produit.po,
                'coloris': produit.coloris,
                'brand': produit.brand,
                'type_de_commande': produit.type_de_commande,
                'etat_de_commande': produit.etat_de_commande,
                'reference': produit.reference,
                'type_de_produit': produit.type_de_produit
            }
            for produit in produits
        }
        return jsonify(produits_dict)

@main.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Adresse e-mail requise'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Si cet e-mail est enregistré, vous recevrez un email'}), 200

    reset_token = User.generate_reset_token()
    user.reset_token = reset_token
    db.session.commit()

    reset_link = f"http://localhost:3000/reset-password/{user.id}?token={reset_token}"
    
    send_reset_email(email, reset_link)

    return jsonify({'message': 'Un email a été envoyé avec un lien de réinitialisation'}), 200

@main.route('/produits/<int:produit_id>', methods=['GET'])
def get_produit_by_id(produit_id):
        BASE_URL = "https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app"
        produit = Produit.query.get(produit_id)
        if not produit:
            return jsonify({'error': 'Produit non trouvé'}), 404
        produit_dict = {
            'id': produit.id,
            'style': produit.style,
            'image': f"{BASE_URL}/static/uploads/{produit.image}" if produit.image else None,
            'qty': produit.qty,
            'dossier_technique': f"{BASE_URL}/static/uploads/{produit.dossier_technique}" if produit.dossier_technique else None,
            'dossier_serigraphie': f"{BASE_URL}/static/uploads/{produit.dossier_serigraphie}" if produit.dossier_serigraphie else None,
            'bon_de_commande': f"{BASE_URL}/static/uploads/{produit.bon_de_commande}" if produit.bon_de_commande else None,
            'patronage': f"{BASE_URL}/static/uploads/{produit.patronage}" if produit.patronage else None,
            'date_reception_bon_commande': produit.date_reception_bon_commande,
            'date_livraison_commande': produit.date_livraison_commande,
            'position_id': produit.position_id,
            'coloris': produit.coloris,
            'po': produit.po,
            'brand': produit.brand,
            'type_de_commande': produit.type_de_commande,
            'etat_de_commande': produit.etat_de_commande,
            'reference': produit.reference,
            'type_de_produit': produit.type_de_produit
        }
        return jsonify(produit_dict)

@main.route('/update/produits/<int:produit_id>', methods=['PUT'])
def update_produit(produit_id):
            produit = Produit.query.get(produit_id)
            if not produit:
                return jsonify({'error': 'Produit non trouvé'}), 404

            if 'style' in request.form:
                produit.style = request.form.get('style')
            if 'qty' in request.form:
                produit.qty = float(request.form.get('qty')) if request.form.get('qty') else None
            if 'date_reception_bon_commande' in request.form:
                produit.date_reception_bon_commande = request.form.get('date_reception_bon_commande')
            if 'date_livraison_commande' in request.form:
                produit.date_livraison_commande = request.form.get('date_livraison_commande')
            if 'position_id' in request.form:
                produit.position_id = request.form.get('position_id')
            if 'po' in request.form:
                produit.po = request.form.get('po')
            if 'coloris' in request.form:
                produit.coloris = request.form.get('coloris')
            if 'brand' in request.form:
                produit.brand = request.form.get('brand')
            if 'type_de_commande' in request.form:
                produit.type_de_commande = request.form.get('type_de_commande')
            if 'etat_de_commande' in request.form:
                produit.etat_de_commande = request.form.get('etat_de_commande')
            if 'reference' in request.form:
                produit.reference = request.form.get('reference')
            if 'type_de_produit' in request.form:
                produit.type_de_produit = request.form.get('type_de_produit')

            if 'image' in request.files:
                image_file = request.files.get('image')
                if image_file and allowed_file(image_file.filename):
                    image_filename = secure_filename(image_file.filename)
                    image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)
                    image_file.save(image_path)
                    produit.image = image_filename

            if 'dossier_technique' in request.files:
                dossier_file = request.files.get('dossier_technique')
                if dossier_file and allowed_file(dossier_file.filename):
                    dossier_filename = secure_filename(dossier_file.filename)
                    dossier_path = os.path.join(current_app.config['UPLOAD_FOLDER'], dossier_filename)
                    dossier_file.save(dossier_path)
                    produit.dossier_technique = dossier_filename

            if 'dossier_serigraphie' in request.files:
                dossier_serigraphie_file = request.files.get('dossier_serigraphie')
                if dossier_serigraphie_file and allowed_file(dossier_serigraphie_file.filename):
                    dossier_serigraphie_filename = secure_filename(dossier_serigraphie_file.filename)
                    dossier_serigraphie_path = os.path.join(current_app.config['UPLOAD_FOLDER'], dossier_serigraphie_filename)
                    dossier_serigraphie_file.save(dossier_serigraphie_path)
                    produit.dossier_serigraphie = dossier_serigraphie_filename

            if 'bon_de_commande' in request.files:
                bon_de_commande_file = request.files.get('bon_de_commande')
                if bon_de_commande_file and allowed_file(bon_de_commande_file.filename):
                    bon_de_commande_filename = secure_filename(bon_de_commande_file.filename)
                    bon_de_commande_path = os.path.join(current_app.config['UPLOAD_FOLDER'], bon_de_commande_filename)
                    bon_de_commande_file.save(bon_de_commande_path)
                    produit.bon_de_commande = bon_de_commande_filename

            if 'patronage' in request.files:
                patronage_file = request.files.get('patronage')
                if patronage_file and allowed_file(patronage_file.filename):
                    patronage_filename = secure_filename(patronage_file.filename)
                    patronage_path = os.path.join(current_app.config['UPLOAD_FOLDER'], patronage_filename)
                    patronage_file.save(patronage_path)
                    produit.patronage = patronage_filename

            try:
                db.session.commit()
                return jsonify({'message': 'Produit mis à jour avec succès', 'produit_id': produit.id}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({'error': f'Erreur lors de la mise à jour du produit : {str(e)}'}), 500

@main.route('/produits/position/<int:produit_id>', methods=['GET'])
def get_produits_by_position_id(produit_id):
        BASE_URL = "https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app"
        produit = Produit.query.get(produit_id)
        if not produit:
            return jsonify({'error': 'Produit non trouvé'}), 404

        position_id = produit.position_id
        produits = Produit.query.filter_by(position_id=position_id).all()
        if not produits:
            return jsonify({'error': 'Aucun produit trouvé pour cette position_id'}), 404

        produits_list = []
        for produit in produits:
            produit_dict = {
                'id': produit.id,
                'style': produit.style,
                'image': f"{BASE_URL}/static/uploads/{produit.image}" if produit.image else None,
                'position_id': produit.position_id
            }
            produits_list.append(produit_dict)

        return jsonify(produits_list)

@main.route('/static/uploads/<filename>')
def serve_file(filename):
            return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

@main.route('/ajouter/produits', methods=['POST'])
def add_produit():
                style = request.form.get('style')
                qty = request.form.get('qty')
                date_reception_bon_commande = request.form.get('date_reception_bon_commande')
                date_livraison_commande = request.form.get('date_livraison_commande')
                position_id = request.form.get('position_id')
                po = request.form.get('po')
                coloris = request.form.get('coloris')
                brand = request.form.get('brand')
                type_de_commande = request.form.get('type_de_commande')
                etat_de_commande = request.form.get('etat_de_commande')
                reference = request.form.get('reference')
                type_de_produit = request.form.get('type_de_produit')

                image_file = request.files.get('image')
                dossier_file = request.files.get('dossier_technique')
                dossier_serigraphie_file = request.files.get('dossier_serigraphie')
                bon_de_commande_file = request.files.get('bon_de_commande')
                patronage_file = request.files.get('patronage')

                image_filename = None
                if image_file and allowed_file(image_file.filename):
                    image_filename = secure_filename(image_file.filename)
                    image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)
                    image_file.save(image_path)

                dossier_filename = None
                if dossier_file and allowed_file(dossier_file.filename):
                    dossier_filename = secure_filename(dossier_file.filename)
                    dossier_path = os.path.join(current_app.config['UPLOAD_FOLDER'], dossier_filename)
                    dossier_file.save(dossier_path)

                dossier_serigraphie_filename = None
                if dossier_serigraphie_file and allowed_file(dossier_serigraphie_file.filename):
                    dossier_serigraphie_filename = secure_filename(dossier_serigraphie_file.filename)
                    dossier_serigraphie_path = os.path.join(current_app.config['UPLOAD_FOLDER'], dossier_serigraphie_filename)
                    dossier_serigraphie_file.save(dossier_serigraphie_path)

                bon_de_commande_filename = None
                if bon_de_commande_file and allowed_file(bon_de_commande_file.filename):
                    bon_de_commande_filename = secure_filename(bon_de_commande_file.filename)
                    bon_de_commande_path = os.path.join(current_app.config['UPLOAD_FOLDER'], bon_de_commande_filename)
                    bon_de_commande_file.save(bon_de_commande_path)

                patronage_filename = None
                if patronage_file and allowed_file(patronage_file.filename):
                    patronage_filename = secure_filename(patronage_file.filename)
                    patronage_path = os.path.join(current_app.config['UPLOAD_FOLDER'], patronage_filename)
                    patronage_file.save(patronage_path)

                try:
                    nouveau_produit = Produit(
                        style=style,
                        image=image_filename,
                        qty=float(qty) if qty else None,
                        dossier_technique=dossier_filename,
                        dossier_serigraphie=dossier_serigraphie_filename,
                        bon_de_commande=bon_de_commande_filename,
                        patronage=patronage_filename,
                        date_reception_bon_commande=date_reception_bon_commande,
                        date_livraison_commande=date_livraison_commande,
                        position_id=position_id,
                        po=po,
                        coloris=coloris,
                        brand=brand,
                        type_de_commande=type_de_commande,
                        etat_de_commande=etat_de_commande,
                        reference=reference,
                        type_de_produit=type_de_produit
                    )

                    db.session.add(nouveau_produit)
                    db.session.commit()
                    return jsonify({'message': 'Produit ajouté avec succès'}), 201
                except Exception as e:
                    db.session.rollback()
                    return jsonify({'message': f'Erreur lors de l\'ajout du produit : {str(e)}'}), 500

@main.route('/importer/produits-images', methods=['POST'])
def import_produits_documents():
    excel_file = request.files.get('excel_file')
    if not excel_file:
        return jsonify({'message': 'Aucun fichier Excel fourni'}), 400
    if not allowed_file(excel_file.filename):
        return jsonify({'message': 'Format de fichier non autorisé'}), 400

    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    for folder in [upload_folder]:
        if not os.path.exists(folder):
            os.makedirs(folder)

    try:
        excel_filename = secure_filename(excel_file.filename)
        excel_path = os.path.join(upload_folder, excel_filename)
        excel_file.save(excel_path)

        df = pd.read_excel(excel_path)
        errors = []

        for index, row in df.iterrows():
            try:
                product_id = int(row['id'])
                if product_id <= 0:
                    errors.append(f'Ligne {index+1}: ID produit invalide')
                    continue
            except (KeyError, ValueError):
                errors.append(f'Ligne {index+1}: ID produit manquant ou invalide')
                continue

            if pd.isna(row.get('style')):
                errors.append(f'Ligne {index+1}: Champs obligatoires manquants')
                continue

            try:
                # Conversion des champs standards
                qty = float(row['quantité']) if pd.notna(row.get('quantité')) else None
                position_id = int(row['Chaine position']) if pd.notna(row.get('Chaine position')) else None
                coloris = row['coloris'] if pd.notna(row.get('coloris')) else None  
                po = row['po'] if pd.notna(row.get('po')) else None  
                brand = row['marque'] if pd.notna(row.get('marque')) else None
                type_de_commande = row['type commande'] if pd.notna(row.get('type commande')) else None
                etat_de_commande = row['etat commande'] if pd.notna(row.get('etat commande')) else None
                reference = row['reference'] if pd.notna(row.get('reference')) else None
                type_de_produit = row['type produit'] if pd.notna(row.get('type produit')) else None

                # Gestion des dates améliorée
                date_reception_bon_commande = None
                if pd.notna(row.get('date reception bon commande')):
                    date_reception_bon_commande = pd.to_datetime(
                        row['date reception bon commande'],
                        dayfirst=True,
                        errors='coerce'
                    )
                    if pd.isna(date_reception_bon_commande):
                        date_reception_bon_commande = None

                date_livraison_commande = None
                if pd.notna(row.get('date livraison commande')):
                    date_livraison_commande = pd.to_datetime(
                        row['date livraison commande'],
                        dayfirst=True,
                        errors='coerce'
                    )
                    if pd.isna(date_livraison_commande):
                        date_livraison_commande = None

            except ValueError as e:
                errors.append(f'Ligne {index+1}: {str(e)}')
                continue

            # Création/mise à jour du produit
            produit = Produit.query.get(product_id)
            if produit:
                produit.style = row.get('style')
                produit.qty = qty
                produit.position_id = position_id
                produit.coloris = coloris
                produit.po = po
                produit.brand = brand
                produit.type_de_commande = type_de_commande
                produit.etat_de_commande = etat_de_commande
                produit.reference = reference
                produit.type_de_produit = type_de_produit
                produit.date_reception_bon_commande = date_reception_bon_commande
                produit.date_livraison_commande = date_livraison_commande
            else:
                produit = Produit(
                    id=product_id,
                    style=row.get('style'),
                    qty=qty,
                    position_id=position_id,
                    coloris=coloris,
                    po=po,
                    brand=brand,
                    type_de_commande=type_de_commande,
                    etat_de_commande=etat_de_commande,
                    reference=reference,
                    type_de_produit=type_de_produit,
                    date_reception_bon_commande=date_reception_bon_commande,
                    date_livraison_commande=date_livraison_commande
                )
                db.session.add(produit)

        if errors:
            return jsonify({'errors': errors}), 400

        def process_uploaded_files(file_type, folder, product_relation=True):
            for key in request.files:
                if key.startswith(file_type):
                    file = request.files[key]
                    if product_relation:
                        try:
                            product_id = int(key.split('_')[-1])
                        except:
                            errors.append(f'Format de clé invalide: {key}')
                            continue
                        
                        produit = Produit.query.get(product_id)
                        if not produit:
                            errors.append(f'Produit {product_id} introuvable')
                            continue

                    if allowed_file(file.filename):
                        unique_name = f"{file_type}_{uuid.uuid4().hex[:8]}_{secure_filename(file.filename)}"
                        file_path = os.path.join(folder, unique_name)
                        file.save(file_path)
                        
                        if product_relation:
                            setattr(produit, file_type, unique_name)
                    else:
                        errors.append(f'Format de fichier interdit pour {key}')

        process_uploaded_files('image', upload_folder)
        process_uploaded_files('dossier_technique', upload_folder)
        process_uploaded_files('dossier_serigraphie', upload_folder)
        process_uploaded_files('bon_de_commande', upload_folder)
        process_uploaded_files('patronage', upload_folder)

        if errors:
            return jsonify({'errors': errors}), 400

        db.session.commit()
        return jsonify({'message': 'Importation réussie'}), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Erreur d'importation: {str(e)}")
        return jsonify({'message': f'Erreur serveur: {str(e)}'}), 500

@main.route('/supprimer/produits/<int:id>', methods=['DELETE'])
def delete_produit(id):
    try:
        produit = Produit.query.get(id)  
        if not produit:
            return jsonify({"message": "Produit non trouvé"}), 404

        db.session.delete(produit)  
        db.session.commit()  

        return jsonify({"message": "Produit supprimé avec succès"}), 200
    except Exception as e:
        db.session.rollback() 
        return jsonify({"error": "Une erreur est survenue lors de la suppression du produit", "details": str(e)}), 500

@main.route("/supprimer/produits", methods=["DELETE"])
def supprimer_tous_les_produits():
    try:
        db.session.query(Produit).delete()
        db.session.commit()
        return jsonify({"message": "Tous les produits ont été supprimés avec succès !"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Erreur lors de la suppression", "error": str(e)}), 500
    
@main.route("/drag", methods=["POST", "OPTIONS"])
def handle_drag():
    if request.method == "OPTIONS":
        response = jsonify({'message': 'Options preflight request passed'})
        response.headers.add('Access-Control-Allow-Origin', 'https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.status_code = 200
        return response

    data = request.get_json()
    old_position = data.get('oldPosition')
    new_position = data.get('newPosition')
    produit = data.get('produit')

    if not old_position or not new_position or not produit:
        return jsonify({"message": "Données manquantes"}), 400

    try:
        produit_obj = Produit.query.filter_by(id=produit['id'], position_id=old_position).first()
        if produit_obj:
            produit_obj.position_id = new_position
            db.session.commit()
            return jsonify({"message": f"Produit déplacé de la position {old_position} à la position {new_position}."})
        else:
            return jsonify({"message": "Produit non trouvé"}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erreur lors de la mise à jour : {str(e)}"}), 500