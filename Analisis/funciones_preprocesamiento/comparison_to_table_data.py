import pandas as pd

def limpiar_csv_similitudes(input_csv, output_csv):
    """
    Limpia el archivo CSV eliminando filas donde Document 1 == Document 2 y duplicados.

    :param input_csv: Ruta al archivo CSV de entrada.
    :param output_csv: Ruta para guardar el archivo CSV limpio.
    """
    # Leer el archivo CSV
    df = pd.read_csv(input_csv)

    # Eliminar filas donde Document 1 es igual a Document 2
    df = df[df['Document 1'] != df['Document 2']]

    # Crear una nueva columna que contenga las tuplas (Document 1, Document 2) en un orden consistente
    df['Ordered'] = df.apply(lambda row: tuple(sorted([row['Document 1'], row['Document 2']])), axis=1)

    # Eliminar duplicados basados en la columna 'Ordered'
    df_unique = df.drop_duplicates(subset='Ordered')

    # Eliminar la columna auxiliar 'Ordered'
    df_unique.drop(columns=['Ordered'], inplace=True)

    df_sorted = df_unique.sort_values(by='Similarity', ascending=False)

    # Guardar el DataFrame limpio en un nuevo archivo CSV
    df_sorted.to_csv(output_csv, index=False)

def remover_extension(input_csv):
    df = pd.read_csv(input_csv)

    # Eliminar la extensión .txt de los nombres de documentos
    df['Document 1'] = df['Document 1'].str.replace('.txt', '', regex=False)
    df['Document 2'] = df['Document 2'].str.replace('.txt', '', regex=False)

    df.to_csv("comparison_data.csv", index=False)

def main():
    input_csv = 'comparison_data.csv'  # Cambia esto a la ruta de tu archivo CSV
    output_csv = 'table_data.csv'  # Cambia esto a la ruta donde quieres guardar el archivo limpio

    remover_extension("simil_doc_doc2vec_cosine 2.csv")

    limpiar_csv_similitudes(input_csv, output_csv)

    print("El archivo ha sido limpiado y guardado.")
    return 0

main()