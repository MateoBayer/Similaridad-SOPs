import os
from docx import Document
import pdfplumber
import win32com.client

def transformar_a_txt():
    # Directorio donde están los archivos DOCX y DOC
    input_dir = 'Analisis\SOPs'
    # Directorio donde se guardarán los archivos TXT
    output_dir = 'Analisis\SOPs txt'

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.endswith('.docx'):
            doc = Document(os.path.join(input_dir, filename))
            text = []
            for paragraph in doc.paragraphs:
                text.append(paragraph.text)
            txt_filename = os.path.splitext(filename)[0] + '.txt'
            with open(os.path.join(output_dir, txt_filename), 'w', encoding='utf-8') as txt_file:
                txt_file.write('\n'.join(text))
        
        elif filename.endswith('.pdf'):
            with pdfplumber.open(os.path.join(input_dir, filename)) as pdf:
                text = []
                for page in pdf.pages:
                    text.append(page.extract_text())
                txt_filename = os.path.splitext(filename)[0] + '.txt'
                with open(os.path.join(output_dir, txt_filename), 'w', encoding='utf-8') as txt_file:
                    txt_file.write('\n'.join(filter(None, text)))

        elif filename.endswith('.doc'):
            print(f"Error al abrir el archivo {filename}. Es formato .doc (Word viejo)")

    print("Conversión completada.")

transformar_a_txt()