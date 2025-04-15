import { useState, useEffect } from 'react';
import './Table.css';

const Table = ({file, selectedSop, onHighlightSop, highlightedSops, filteredAuthorSops}) => {
  const [similarityData, setSimilarityData] = useState([]);
  const [amount, setAmount] = useState(10);
  const [nameSop, setNameSop] = useState("");
  const [minSimilarity, setMinSimilarity] = useState(0)

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

  useEffect(() => {
    if (selectedSop) {
      setNameSop(selectedSop);
    }
  }, [selectedSop]); // Se ejecuta cada vez que selectedSop cambie

  const findSimilarity = (doc1, doc2) => {
    const match = similarityData.find(
      item => (item.doc1 === doc1 && item.doc2 === doc2) || 
              (item.doc1 === doc2 && item.doc2 === doc1)
    );
    return match ? match.similarity : null;
  };

  const handleResetFilters = () => {
    setAmount(10);
    setNameSop("");
    setMinSimilarity(0);
  };

  return (
    <div className="table-container">
      <div className="table-controls">
        <div className='amount-columns'>
          <label>
            Numero de columnas a mostrar:
            <input 
              type="number" 
              min="1" 
              max={similarityData.length} 
              value={amount} 
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </label>
        </div>
        <div className='searcher'>
          <label>
            Nombre de SOP a buscar
            <input
              type='text'
              value={nameSop}
              onChange={(e) => setNameSop(e.target.value)}
            />
          </label>
        </div>
        <div className='similarity-score'>
          <label>
            Minima similaridad
          </label>
          <input
            type='number'
            max={100}
            value={minSimilarity}
            onChange={(e) => setMinSimilarity(parseInt(e.target.value))}
          />
        </div>
        <div>
          <button
            className='reset-filters'
            onClick={handleResetFilters}
          >Restaurar Filtros</button>
        </div>
      </div>
      <table className='similarity-table'>
        <thead>
          <tr>
            <th>Documento 1</th>
            <th>Documento 2</th>
            <th>Similaridad</th>
          </tr>
        </thead>
        <tbody>
          {similarityData
            .filter(
              item => {
                const firstFilter = (item.similarity * 100) >= minSimilarity && 
                  (item.doc1.toLowerCase().startsWith(nameSop.toLowerCase()) || item.doc2.toLowerCase().startsWith(nameSop.toLowerCase()));
                
                  const meetsAuthorFilter = filteredAuthorSops.size > 2 ? 
                   filteredAuthorSops.has(item.doc1) || filteredAuthorSops.has(item.doc2) :
                   true
                return firstFilter && meetsAuthorFilter;
              })
            .slice(0, amount)
            .map((item, index) => (
              <tr key={index}>
                <td
                  onClick={() => onHighlightSop(item.doc1)} // Marcar como resaltado, para que aparezca en el grafico
                  className={highlightedSops.includes(item.doc1) ? "highlighted" : ""}
                >{item.doc1}</td>
                <td
                  onClick={() => onHighlightSop(item.doc2)}
                  className={highlightedSops.includes(item.doc2) ? "highlighted" : ""}
                >{item.doc2}</td>
                <td>{(item.similarity * 100).toFixed(2)}%</td>
              </tr>
            ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default Table;