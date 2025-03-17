import pandas as pd

# Cargar el archivo CSV
file_path = 'Doc2Vec_con_autores_separador_,.csv'  # Cambia esto por la ruta de tu archivo
df = pd.read_csv(file_path)

# Función para reemplazar caracteres raros
def replace_special_characters(text):
    replacements = {
        'ô': 'ó',
        'â': 'á',
        'À': 'Á',
        'Â': 'A',
        'Ê': 'E',
        'ê': 'e',
        'ç': 'c',
        'ñ': 'n',
        'ù': 'ú',
        'ô': 'ó',
        '¢': 'ó',
        'ô': 'ó',
        'À': 'Á',
        'ô': 'ó',
        'ô': 'ó',
        'ô': 'ó',
        '¡': 'í',
        '¢': 'ó',
        '': 'é',
        '¤': 'ñ',
        ' ': 'á',
        '£': 'ú'
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

# Aplicar la función a todas las celdas del DataFrame
df = df.applymap(lambda x: replace_special_characters(x) if isinstance(x, str) else x)

# Guardar el archivo corregido
df.to_csv('Doc2Vec_con_autores_separador_corregido.csv', sep='#', index=False)

print(f'Archivo corregido guardado')
