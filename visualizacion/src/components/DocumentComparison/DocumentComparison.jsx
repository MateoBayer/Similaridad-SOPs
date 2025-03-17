import { useState, useEffect } from 'react';
import './DocumentComparison.css';

const DocumentComparison = ({file}) => {
  const [similarityData, setSimilarityData] = useState([]);
  const [uniqueDocuments, setUniqueDocuments] = useState([]);
  const [doc1, setDoc1] = useState('');
  const [doc2, setDoc2] = useState('');
  const [similarity, setSimilarity] = useState(null);

  useEffect(() => {
    fetch(file)
      .then(response => response.text())
      .then(csv => {
        const lines = csv.split('\n').filter(line => line.trim());
        const data = lines.slice(1).map(line => {
          const [doc1, doc2, similarity] = line.split(',');
          return {
            doc1: doc1.trim(),
            doc2: doc2.trim(),
            similarity: parseFloat(similarity)
          };
        });
        setSimilarityData(data);

        // Get unique documents
        const docs = new Set();
        data.forEach(item => {
          docs.add(item.doc1);
          docs.add(item.doc2);
        });
        setUniqueDocuments(Array.from(docs).sort());
      });
  }, []);

  const findSimilarity = (doc1, doc2) => {
    const match = similarityData.find(
      item => (item.doc1 === doc1 && item.doc2 === doc2) || 
              (item.doc1 === doc2 && item.doc2 === doc1)
    );
    return match ? match.similarity : null;
  };

  const handleCompare = () => {
    if (doc1 && doc2) {
      const similarityValue = findSimilarity(doc1, doc2);
      setSimilarity(similarityValue);
    }
  };

  return (
    <div className="document-comparison">
      <h2>Compara documentos</h2>
      <div className="comparison-container">
        <div className="document-selectors">
          <div className="selector">
            <label>Documento 1:</label>
            <select 
              value={doc1} 
              onChange={(e) => setDoc1(e.target.value)}
            >
              <option value="">Selecciona un documento...</option>
              {uniqueDocuments.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
          </div>
          <div className="selector">
            <label>Documento 2:</label>
            <select 
              value={doc2} 
              onChange={(e) => setDoc2(e.target.value)}
            >
              <option value="">Selecciona un documento...</option>
              {uniqueDocuments.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleCompare}
            disabled={!doc1 || !doc2 || doc1 === doc2}
          >
            Compará
          </button>
        </div>
        {similarity !== null && (
          <div className="similarity-result">
            <h3>Similaridad:</h3>
            <div className="score">
              {(similarity * 100).toFixed(2)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentComparison;