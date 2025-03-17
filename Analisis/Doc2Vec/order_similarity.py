import pandas as pd

# Lee el archivo CSV
df = pd.read_csv('Doc2Vec/simil_doc_doc2vec_cosine.csv')

# Ordena el DataFrame por la columna 'Similarity' de mayor a menor
df_sorted = df.sort_values(by='Similarity', ascending=False)

df_sorted = df_sorted[df_sorted['Document 1'] != df_sorted['Document 2']]
# Crea una nueva columna que contenga los documentos en orden alfabético
df_sorted['Sorted Documents'] = df_sorted.apply(lambda row: tuple(sorted([row['Document 1'], row['Document 2']])), axis=1)

# Elimina las filas duplicadas basadas en la columna 'Sorted Documents'
df_filtered = df_sorted.drop_duplicates(subset='Sorted Documents')

# Elimina la columna auxiliar 'Sorted Documents'
df_filtered = df_filtered.drop(columns='Sorted Documents')



# Si deseas guardar el resultado en un nuevo archivo CSV
df_filtered.to_csv('archivo_filtrado.csv', index=False)

