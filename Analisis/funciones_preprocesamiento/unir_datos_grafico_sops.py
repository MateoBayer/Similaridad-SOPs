import pandas as pd

def actualizar_dimensiones(csv1, csv2, output_csv):
    """
    Actualiza las columnas 'Dimension 1' y 'Dimension 2' del segundo CSV a partir del primer CSV
    utilizando 'document' como clave.

    :param csv1: Ruta al primer archivo CSV (contiene las dimensiones).
    :param csv2: Ruta al segundo archivo CSV (donde se actualizarán las dimensiones).
    :param output_csv: Ruta para guardar el archivo CSV actualizado.
    """
    # Leer los archivos CSV
    df1 = pd.read_csv(csv1, sep=",")  # Primer CSV
    df2 = pd.read_csv(csv2, sep='#')  # Segundo CSV, usando '#' como separador

    # Realizar un merge para combinar los DataFrames usando 'document' como clave
    df_merged = df2.merge(df1[['document', 'Dimension 1', 'Dimension 2']], on='document', how='left', suffixes=('', '_new'))

    # Actualizar las dimensiones en df2
    df_merged['Dimension 1'] = df_merged['Dimension 1_new'].combine_first(df_merged['Dimension 1'])
    df_merged['Dimension 2'] = df_merged['Dimension 2_new'].combine_first(df_merged['Dimension 2'])

    # Eliminar las columnas auxiliares
    df_merged.drop(columns=['Dimension 1_new', 'Dimension 2_new'], inplace=True)

    # Guardar el DataFrame actualizado en un nuevo archivo CSV
    df_sorted = df_merged.sort_values(by='document', ascending=True)

    df_sorted.to_csv(output_csv, sep='#', index=False)

def main():
    csv1 = 'vectors_reduced_tsne.csv'
    csv2 = 'graph_data.csv'
    output_csv = 'graph_data_updated_sorted.csv'  # Cambia esto a la ruta donde quieres guardar el CSV actualizado

    actualizar_dimensiones(csv1, csv2, output_csv)

    return 0

main()