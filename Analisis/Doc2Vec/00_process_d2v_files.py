import numpy as np
import pandas as pd
import os
import smart_open
import gensim
from gensim import utils
from gensim.models import Doc2Vec, KeyedVectors
from sklearn.model_selection import train_test_split

dir = os.getcwd()

print("Directorio: ", dir)

model = KeyedVectors.load_word2vec_format("doc_tensor_cosine.w2v", binary=False)

vectors_file = "auxFolder/cosine/vectors_c.tsv"
metadata_file = "auxFolder/cosine/metadata_c.tsv"

with utils.open(vectors_file, 'wb') as v, utils.open(metadata_file, 'wb') as m:
    for word in model.index_to_key:
        m.write(gensim.utils.to_utf8(word)+gensim.utils.to_utf8('\n'))
        vector_row = '\t'.join(str(x) for x in model[word])
        v.write(gensim.utils.to_utf8(vector_row)+gensim.utils.to_utf8('\n'))