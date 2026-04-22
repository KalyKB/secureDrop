from cryptography.fernet import Fernet
import os

# Load or generate key
key_file_path = "secret.key"
if not os.path.exists(key_file_path):
    key = Fernet.generate_key()
    with open(key_file_path, "wb") as key_file:
        key_file.write(key)
else:
    with open(key_file_path, "rb") as key_file:
        key = key_file.read()

fernet = Fernet(key)

# Encrypt files in a folder
folder = "files_to_encrypt"  # adjust to your folder
for filename in os.listdir(folder):
    filepath = os.path.join(folder, filename)
    with open(filepath, "rb") as f:
        data = f.read()
    encrypted = fernet.encrypt(data)
    with open(filepath + ".enc", "wb") as f:
        f.write(encrypted)

print("Files encrypted successfully.")
