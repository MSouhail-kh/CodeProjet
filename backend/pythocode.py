from flask import Blueprint, jsonify, request, current_app, send_from_directory
from datetime import datetime
from werkzeug.utils import secure_filename
import pandas as pd
import os
from models import db, Produit, Position
import webcolors
import uuid

main = Blueprint('main', __name__)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@main.route('/produits', methods=['GET'])
def get_produits():
    BASE_URL = "http://localhost:5173"
    produits = Produit.query.all()
    produits_dict = {
        produit.id: {
            'id': produit.id,
            'titre': produit.titre,
            'name': produit.name,
            'image': f"{BASE_URL}/static/uploads/{produit.image}" if produit.image else None,
            'qty': produit.qty,
            'dossier_technique': f"{BASE_URL}/static/uploads/{produit.dossier_technique}" if produit.dossier_technique else None,
            'dossier_serigraphie': f"{BASE_URL}/static/uploads/{produit.dossier_serigraphie}" if produit.dossier_serigraphie else None,
            'bon_de_commande': f"{BASE_URL}/static/uploads/{produit.bon_de_commande}" if produit.bon_de_commande else None,
            'patronage': f"{BASE_URL}/static/uploads/{produit.patronage}" if produit.patronage else None,
            'date_reception_bon_commande': produit.date_reception_bon_commande,
            'date_livraison_commande': produit.date_livraison_commande,
            'descriptions': produit.descriptions,
            'position_id': produit.position_id,
            'po': produit.po,
            'coloris': produit.coloris
        }
        for produit in produits
    }
    return jsonify(produits_dict)

@main.route('/produits/<int:produit_id>', methods=['GET'])
def get_produit_by_id(produit_id):
    BASE_URL = "http://localhost:5173"
    produit = Produit.query.get(produit_id)
    if not produit:
        return jsonify({'error': 'Produit non trouvé'}), 404
    produit_dict = {
        'id': produit.id,
        'titre': produit.titre,
        'name': produit.name,
        'image': f"{BASE_URL}/static/uploads/{produit.image}" if produit.image else None,
        'qty': produit.qty,
        'dossier_technique': f"{BASE_URL}/static/uploads/{produit.dossier_technique}" if produit.dossier_technique else None,
        'dossier_serigraphie': f"{BASE_URL}/static/uploads/{produit.dossier_serigraphie}" if produit.dossier_serigraphie else None,
        'bon_de_commande': f"{BASE_URL}/static/uploads/{produit.bon_de_commande}" if produit.bon_de_commande else None,
        'patronage': f"{BASE_URL}/static/uploads/{produit.patronage}" if produit.patronage else None,
        'date_reception_bon_commande': produit.date_reception_bon_commande,
        'date_livraison_commande': produit.date_livraison_commande,
        'descriptions': produit.descriptions,
        'position_id': produit.position_id,
        'coloris': produit.coloris,
        'po': produit.po
    }
    return jsonify(produit_dict)
from datetime import datetime
from flask import request, jsonify

@main.route('/update/produits/<int:produit_id>', methods=['PUT'])
def update_produit(produit_id):
    # Récupérer le produit existant
    produit = Produit.query.get(produit_id)
    if not produit:
        return jsonify({'error': 'Produit non trouvé'}), 404

    # Mettre à jour les champs du formulaire
    if 'titre' in request.form:
        produit.titre = request.form.get('titre')
    if 'name' in request.form:
        produit.name = request.form.get('name')
    if 'qty' in request.form:
        produit.qty = float(request.form.get('qty')) if request.form.get('qty') else None
    if 'date_reception_bon_commande' in request.form:
        produit.date_reception_bon_commande = request.form.get('date_reception_bon_commande')
    if 'date_livraison_commande' in request.form:
        produit.date_livraison_commande = request.form.get('date_livraison_commande')
    if 'descriptions' in request.form:
        produit.descriptions = request.form.get('descriptions')
    if 'position_id' in request.form:
        produit.position_id = request.form.get('position_id')
    if 'po' in request.form:
        produit.po = request.form.get('po')
    if 'coloris' in request.form:
        produit.coloris = request.form.get('coloris')

    # Gérer les fichiers téléchargés
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
    BASE_URL = "http://localhost:5173"
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
            'name': produit.name,
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
    titre = request.form.get('titre')
    name = request.form.get('name')
    qty = request.form.get('qty')
    date_reception_bon_commande = request.form.get('date_reception_bon_commande')
    date_livraison_commande = request.form.get('date_livraison_commande')
    descriptions = request.form.get('descriptions')
    position_id = request.form.get('position_id')
    po = request.form.get('po')
    coloris = request.form.get('coloris')

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
            titre=titre,
            name=name,
            image=image_filename,
            qty=float(qty) if qty else None,
            dossier_technique=dossier_filename,
            dossier_serigraphie=dossier_serigraphie_filename,
            bon_de_commande=bon_de_commande_filename,
            patronage=patronage_filename,
            date_reception_bon_commande=date_reception_bon_commande,
            date_livraison_commande=date_livraison_commande,
            descriptions=descriptions,
            position_id=position_id,
            po=po,
            coloris=coloris,
        )

        db.session.add(nouveau_produit)
        db.session.commit()
        return jsonify({'message': 'Produit ajouté avec succès'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erreur lors de l\'ajout du produit : {str(e)}'}), 500

def convert_color_to_hex(color_value):
    if not color_value:
        return None

    mapping_fr_en = {
        'bleu': 'blue',
        'rouge': 'red',
        'vert': 'green',
        'jaune': 'yellow',
        'noir': 'black',
        'blanc': 'white',
        'orange': 'orange',
        'violet': 'violet',
        'rose': 'pink',
        'gris': 'gray'
    }

    value = color_value.strip().lower()
    if value in mapping_fr_en:
        value = mapping_fr_en[value]

    try:
        return webcolors.name_to_hex(value)
    except ValueError:
        return color_value

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

            if pd.isna(row.get('titre')) or pd.isna(row.get('name')):
                errors.append(f'Ligne {index+1}: Champs obligatoires manquants')
                continue

            try:
                qty = float(row['qty']) if pd.notna(row.get('qty')) else None
                position_id = int(row['position_id']) if pd.notna(row.get('position_id')) else None
                coloris = convert_color_to_hex(row['coloris']) if pd.notna(row.get('coloris')) else None
            except ValueError as e:
                errors.append(f'Ligne {index+1}: {str(e)}')
                continue

            produit = Produit.query.get(product_id)
            if produit:
                produit.titre = row.get('titre')
                produit.name = row.get('name')
                produit.qty = qty
                produit.position_id = position_id
                produit.coloris = coloris
            else:
                produit = Produit(
                    id=product_id,
                    titre=row.get('titre'),
                    name=row.get('name'),
                    qty=qty,
                    position_id=position_id,
                    coloris=coloris
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
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
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