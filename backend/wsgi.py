import sys
import os
from dotenv import load_dotenv

project_folder = os.path.expanduser('~/daha/backend')
if project_folder not in sys.path:
    sys.path.append(project_folder)

load_dotenv()
from app.main import app as application 
