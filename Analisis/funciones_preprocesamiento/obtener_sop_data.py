import pandas as pd

def generar_nuevo_csv(input_csv, output_csv):
    """
    Genera un nuevo archivo CSV con solo las columnas 'document', 'title' y 'autor'.

    :param input_csv: Ruta al archivo CSV de entrada.
    :param output_csv: Ruta para guardar el nuevo archivo CSV.
    """
    # Leer el archivo CSV
    df = pd.read_csv(input_csv, sep='#')  # Cambia el separador si es necesario

    # Seleccionar las columnas deseadas
    df_nuevo = df[['document', 'title', 'autor']]

    # Guardar el nuevo DataFrame en un archivo CSV
    df_nuevo.to_csv(output_csv, index=False, sep="#")

def main():
    input_csv = 'graph_data.csv'  
    output_csv = 'sops_data.csv'

    generar_nuevo_csv(input_csv, output_csv)

    print("El nuevo archivo CSV ha sido generado.")
    return 0

main()