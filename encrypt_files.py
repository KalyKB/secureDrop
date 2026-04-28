import os
from cryptography.fernet import Fernet
import shutil

# -------------------------
# 1. Generate or load key
# -------------------------
key_file_path = "secret.key"
if not os.path.exists(key_file_path):
    key = Fernet.generate_key()
    with open(key_file_path, "wb") as key_file:
        key_file.write(key)
else:
    with open(key_file_path, "rb") as key_file:
        key = key_file.read()

fernet = Fernet(key)

# -------------------------
# 2. Set folder to encrypt
# -------------------------
folder_to_encrypt = "FullBackend"  # change to your repo folder
backup_folder = folder_to_encrypt + "_backup"

# Create backup folder if it doesn't exist
os.makedirs(backup_folder, exist_ok=True)

# -------------------------
# 3. Walk through all files
# -------------------------
for root, dirs, files in os.walk(folder_to_encrypt):
    for filename in files:
        filepath = os.path.join(root, filename)

        # Skip the key file itself or already encrypted files
        if filename == "secret.key" or filename.endswith(".enc"):
            continue

        # Encrypt the file
        with open(filepath, "rb") as f:
            data = f.read()
        encrypted = fernet.encrypt(data)

        # Save encrypted file
        encrypted_path = filepath + ".enc"
        with open(encrypted_path, "wb") as f:
            f.write(encrypted)

        # Move original file to backup folder, keeping folder structure
        relative_path = os.path.relpath(root, folder_to_encrypt)
        backup_path_dir = os.path.join(backup_folder, relative_path)
        os.makedirs(backup_path_dir, exist_ok=True)
        shutil.move(filepath, os.path.join(backup_path_dir, filename))

print("Encryption complete! Originals are in the backup folder.")
