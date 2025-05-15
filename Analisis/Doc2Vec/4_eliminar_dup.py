import os

def remove_duplicate_docs(folder_path):
    files = os.listdir(folder_path)
    
    docx_files = {f[:-5] for f in files if f.endswith(".docx")}
    doc_files = {f[:-4] for f in files if f.endswith(".doc")}
    
    duplicates = doc_files.intersection(docx_files)
    
    for filename in duplicates:
        doc_path = os.path.join(folder_path, filename + ".doc")
        try:
            os.remove(doc_path)
            print(f"Eliminado: {doc_path}")
        except Exception as e:
            print(f"Error al eliminar {doc_path}: {e}")

folder_path = "C:\Users\GPKYR\Downloads\SOPs"
remove_duplicate_docs(folder_path)