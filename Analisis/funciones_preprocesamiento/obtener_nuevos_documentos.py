import os
import pandas as pd

def encontrar_documentos_nuevos(carpeta_sops, carpeta_nuevos):
    """
    Encuentra los documentos que están en la carpeta SOPs_Nuevos pero no en la carpeta SOPs,
    comparando solo por el nombre del archivo sin la extensión.

    :param carpeta_sops: Ruta a la carpeta SOPs.
    :param carpeta_nuevos: Ruta a la carpeta SOPs_Nuevos.
    :return: Lista de nombres de documentos que están en SOPs_Nuevos pero no en SOPs.
    """
    # Obtener los nombres de los documentos en ambas carpetas sin las extensiones
    documentos_sops = {os.path.splitext(nombre)[0] for nombre in os.listdir(carpeta_sops)}
    documentos_nuevos = {os.path.splitext(nombre)[0] for nombre in os.listdir(carpeta_nuevos)}

    # Comparar los documentos y encontrar los que están en SOPs_Nuevos pero no en SOPs
    documentos_faltantes = []
    for doc_nuevo in documentos_nuevos:
        esta_el_documento = False
        for doc in documentos_sops:
            if doc == doc_nuevo:
                esta_el_documento = True
        if not esta_el_documento:
            documentos_faltantes.append(doc_nuevo)

    
    #documentos_faltantes = documentos_nuevos - documentos_sops
    #return list(documentos_faltantes)
    return documentos_faltantes

import os

def eliminar_documentos_no_faltantes(carpeta_nuevos, lista_faltantes):
    # Crear un conjunto de nombres de documentos faltantes para una búsqueda más rápida
    documentos_faltantes_set = set(lista_faltantes)

    # Iterar sobre los archivos en la carpeta SOPs_Nuevos
    for archivo in os.listdir(carpeta_nuevos):
        # Obtener el nombre del archivo sin la extensión
        nombre_sin_extension = os.path.splitext(archivo)[0]
        
        # Si el nombre del archivo no está en la lista de documentos faltantes, eliminarlo
        if nombre_sin_extension not in documentos_faltantes_set:
            ruta_archivo = os.path.join(carpeta_nuevos, archivo)
            os.remove(ruta_archivo)  # Eliminar el archivo
            print(f"Eliminado: {archivo}")



def main():
    # Uso de la función
    carpeta_sops = 'SOPs'  # Cambia esto a la ruta de tu carpeta SOPs
    carpeta_nuevos = 'SOPs_Nuevos'  # Cambia esto a la ruta de tu carpeta SOPs_Nuevos

    documentos_no_encontrados = encontrar_documentos_nuevos(carpeta_sops, carpeta_nuevos)

    # Imprimir los resultados
    print("Documentos en SOPs_Nuevos pero no en SOPs:")
    for documento in documentos_no_encontrados:
        print(documento)

    # Exportar la lista a un archivo CSV
    df_documentos_faltantes = pd.DataFrame(documentos_no_encontrados, columns=['Documentos Faltantes'])
    df_documentos_faltantes.to_csv('documentos_faltantes_v2.csv', index=False)

    carpeta_nuevos = 'ruta/a/SOPs_Nuevos'  # Cambia esto a la ruta de tu carpeta SOPs_Nuevos
    documentos_no_encontrados = encontrar_documentos_nuevos(carpeta_sops, carpeta_nuevos)  # Asegúrate de que esta función esté definida

    eliminar_documentos_no_faltantes(carpeta_nuevos, documentos_no_encontrados)

    print("Documentos no faltantes han sido eliminados de SOPs_Nuevos.")
    return 0

main()