import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
import os

# Define the directory where your text files are located
path_dir = 'Analisis\SOPs txt'

def read_file(filename):
    path = os.path.join(path_dir, filename)  # Use os.path.join for cross-platform compatibility
    with open(path, 'r', encoding='utf-8') as f:  # Ensure UTF-8 encoding
        return f.read()

def cal_vec(df, model):
    X = []
    for i, s in enumerate(df.content.values):
        print(f"Encoding {i + 1}/{len(df)}: {s[:30]}...")  # Print a snippet of the content being encoded
        X.append(model.encode(s))
    X = np.array(X)
    cols = [f'v{i}' for i in range(X.shape[1])]
    df[cols] = X
    return df

# Load the multilingual sentence transformer model
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# List all files in the specified directory
filenames = os.listdir(path_dir)

# Define how to split the content into paragraphs
split_string = 'XXPARAGRAPH'

# Read the files and prepare the data
rows = [(filename[:-4], i, read_file(filename)) for i, filename in enumerate(filenames)]
rows2 = [(filename, i, j, content_paragraph) for j, (filename, i, content) in enumerate(rows)
         for j, content_paragraph in enumerate(content.split(split_string))]

# Create DataFrames
df = pd.DataFrame(rows, columns=['filename', 'idx_file', 'content'])
df2 = pd.DataFrame(rows2, columns=['filename', 'idx_file', 'idx_paragraph', 'content'])

# Replace the split string with new lines for better formatting
df.content = df.content.str.replace(split_string, '\n\n', regex=False)

# Calculate the vector representations of the content
df = cal_vec(df, model)

# Print the resulting DataFrame
print(df)

# Save the DataFrame to a CSV file
df.to_csv('df_files03.csv', sep=',', index=False)  # Avoid writing row indices to the CSV

# Uncomment the following lines if you want to process paragraphs as well
# df2 = cal_vec(df2, model)
# print(df2)
# df2.to_csv('df_paragraphs2.csv', sep=',', index=False)