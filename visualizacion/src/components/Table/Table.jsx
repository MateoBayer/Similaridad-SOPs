import { useState, useEffect } from 'react';
import { parseSopCSV } from '../../utils/dataUtils';
import './Table.css';

const Table = ({file, selectedSop, onHighlightSop, highlightedSops, filteredAuthorSops,sopsFile}) => {
  const [similarityData, setSimilarityData] = useState([]);
  const [amount, setAmount] = useState(10);
  const [nameSop, setNameSop] = useState("");
  const [minSimilarity, setMinSimilarity] = useState(0)
  const [sopsData, setSopsData] = useState(null)

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
        /*const docs = new Set();
        data.forEach(item => {
          docs.add(item.doc1);
          docs.add(item.doc2);
        });
        setUniqueDocuments(Array.from(docs).sort());
        */
      });
  }, []);

  useEffect(() => {
      fetch(sopsFile)
        .then(response => response.text())
        .then(csv => {
          const parsedData = parseSopCSV(csv);
          setSopsData(parsedData);
          console.log("SOPs data: ", sopsData)
        })
        .catch(error => console.error('Error loading data:', error));
    }, []);

  useEffect(() => {
    if (selectedSop) {
      setNameSop(selectedSop);
    }
  }, [selectedSop]); // Se ejecuta cada vez que selectedSop cambie

  const handleResetFilters = () => {
    setAmount(10);
    setNameSop("");
    setMinSimilarity(0);
  };

  const convertToCsv = (array) => {
    const headersInCsv = ["Documento 1","Titulo", "Autor/es", "Documento 2","Titulo", "Autor/es", "Similaridad"]
    const headers = Object.keys(array[0])
    let csv = headersInCsv.join(';') + '\n'
    array.forEach(obj => {
      const row = headers.map(header => {
        // Handle special cases (commas, quotes, etc.)
        let value = obj[header] === null ? '' : obj[header].toString();
        return value;
      });
      
      csv += row.join(';') + '\n';
  
    });
    return csv
  }

  // Function to download CSV
  const downloadCSV = (csv, filename = 'exportedTable.csv') => {
    // Create CSV content
    if (!csv) return;

    const BOM = '\uFEFF';
    const csvContent = BOM + csv;

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create hidden download link and click it
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCsv = () => {
    const filteredData = similarityData
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
    console.log("filteredTableData: ", filteredData)
    // HERE I SHOULD JOIN THE DATA
    // Parse to csv
    if (filteredData.length == 0) return null;

    // Enrich data with document details
    const enrichedData = filteredData.map(item => {
      // Find document details in sopsData
      const doc1Details = sopsData.find(sop => sop.document === item.doc1) || {};
      const doc2Details = sopsData.find(sop => sop.document === item.doc2) || {};
      
      // Return enriched item with all details
      return {
        doc1: item.doc1,
        doc1_title: doc1Details.title || "Sin titulo",
        doc1_authors: Array.isArray(doc1Details.autor) 
          ? doc1Details.autor.join(" - ") 
          : doc1Details.autor || "Sin Autor",
        doc2: item.doc2,
        doc2_title: doc2Details.title || "Sin titulo",
        doc2_authors: Array.isArray(doc2Details.autor) 
          ? doc2Details.autor.join(" - ") 
          : doc2Details.autor || "Sin Autor",
        similarity: (item.similarity * 100).toFixed(2)
      };
    }); 
    
    const csvData = convertToCsv(enrichedData)
    downloadCSV(csvData)
    //console.log(csvData)
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
      <div>
        <button
          className='export-csv'
          onClick={handleExportCsv}
        >Exportar como csv</button>
      </div>
    </div>
  );
};

export default Table;