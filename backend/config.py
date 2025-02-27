import os
from dotenv import load_dotenv

load_dotenv()
class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://datasigmatex_user:p2FlDdrlENg46LqTh4thWxHPAry7DZvn@dpg-cv07nrqn91rc73flmsag-a/datasigmatex"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = "https://gestionplanning-git-gestion-planning-msouhail-khs-projects.vercel.app/static/uploads"
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf", "xls", "xlsx"}
    SECRET_KEY = "https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ"
    FLASK_DEBUG = True