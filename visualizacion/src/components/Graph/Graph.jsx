import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { parseCSV } from '../../utils/dataUtils';
import './Graph.css';

function Graph( {file, onSopSelect, highlightedSops}) {
  const [graphData, setGraphData] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState(null);
  const [nameSop, setNameSop] = useState("");
  const [nameAuthor, setNameAuthor] = useState("")
  const [currentLayout, setCurrentLayout] = useState({
    title: 't-SNE Plot',
    xaxis: { title: 'Dimension 1' },
    yaxis: { title: 'Dimension 2' },
    hovermode: 'closest',
    width: 800,
    height: 600,
  });

  // Define distinct colors for each label
  const labelColors = {
    'A': '#FF0000', // Red
    'S': '#00FF00', // Green
    'C': '#0000FF', // Blue
    'P': '#FFA500', // Orange
    'G': '#800080'  // Purple
  };

  useEffect(() => {
    fetch(file)
      .then(response => response.text())
      .then(csv => {
        const parsedData = parseCSV(csv);
        setGraphData(parsedData);
        // Initialize selected labels with all labels
        const uniqueLabels = [...new Set(parsedData.map(d => d.label))];
        setSelectedLabels(uniqueLabels);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  const handlePointClick = (point) => {
    setSelectedPoint(point);
    onSopSelect(point.document);
    console.log('Selected point:', point);
  };

  const handleLabelToggle = (label) => {
    setSelectedLabels(prev => {
      if (prev.includes(label)) {
        return prev.filter(l => l !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  // First filter by labels
  const getFilteredByLabels = () => {
    if (!graphData || !selectedLabels) return null;
    return graphData.filter(d => selectedLabels.includes(d.label));
  };

  // Then filter by highlighted SOPs (if any)
  const getFilteredData = () => {
    const labelFiltered = getFilteredByLabels();
    if (!labelFiltered) return null;
    
    // If we have highlighted SOPs, filter to show only those
    if (highlightedSops && highlightedSops.length > 0) {
      return labelFiltered.filter(d => highlightedSops.includes(d.document));
    }
    
    // Otherwise show all label-filtered data
    return labelFiltered;
  };

  const filteredData = getFilteredData();

  const handleRelayout = (newLayout) => {
    setCurrentLayout(prevLayout => ({
      ...prevLayout,
      ...newLayout
    }));
  };

  return (
    <div className="container">
      <div className='filters'>
        <div className="label-filters">
          <h3>Filtrado por tipo</h3>
          {graphData && [...new Set(graphData.map(d => d.label))].map(label => (
            <div key={label} className="label-checkbox">
              <input
                type="checkbox"
                id={label}
                checked={selectedLabels?.includes(label)}
                onChange={() => handleLabelToggle(label)}
              />
              <label htmlFor={label} style={{ color: labelColors[label] }}>
                {label}
              </label>
            </div>
          ))}
        </div>
        <div className="selector">
          <label>Documento a buscar</label>
          <input
            type="text"
            value={nameSop}
            onChange={(e) => setNameSop(e.target.value)}
            placeholder="Escribe nombre de un SOP..."
          />
        </div>
        <div className='filter-authors'>
          <label>Filtrado por autores</label>
            <input
              type='text'
              value={nameAuthor}
              onChange={(e) => setNameAuthor(e.target.value)}
              placeholder="Filtar sops por Autor"
            />
        </div>
      </div>
      <main className='graph'>
        {filteredData && (
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'markers',
                x: filteredData.map(d => d['Dimension 1']),
                y: filteredData.map(d => d['Dimension 2']),
                text: filteredData.map(d => d.document),
                marker: {
                  color: filteredData.map(d => labelColors[d.label]),
                  line: { width: 1, color: 'black' },                  
                  size: nameSop.length > 2 || nameAuthor.length > 2 ? filteredData.map(d =>{
                    const filteredNameSops = d.document.startsWith(nameSop)
                    const filteredNameAuthors = d.autor.some(aut => aut.includes(nameAuthor))
                    return (filteredNameSops && filteredNameAuthors) ? 15 : 10
                  }
                  ) : 10,

                  opacity: nameSop.length > 2 || nameAuthor.length > 2 ? filteredData.map(d => {
                    const opacityNameSop = d.document.startsWith(nameSop)
                    const opacityNameAuthor = d.autor.some(aut => aut.includes(nameAuthor))
                    return (opacityNameSop && opacityNameAuthor) ? 0.8 : 0.2
                  }) : 0.8,
                  // symbol: nameAuthor.length > 2 ? (filteredData.map(d => d.autor.startsWith(nameAuthor) ? "diamond" : "cirlce")) : "cirlce",
                },
                hoverinfo: 'text',
                text: filteredData.map(d => {
                  return `Documento: ${d.document}<br>Label: ${d.label}`;
                }),
              }
            ]}
            layout={currentLayout}
            onClick={(event) => {
              if (event.points && event.points[0]) {
                handlePointClick(filteredData[event.points[0].pointIndex]);
              }
            }}
            onRelayout={handleRelayout}
          />
        )}
        {selectedPoint && (
          <div className="selected-point">
            <h3>Documento selccionado:</h3>
            <p>Documento: {selectedPoint.document}</p>
            <p>Tipo: {selectedPoint.label}</p>
            <p>Titulo: {selectedPoint.title}</p>
            <p>Autor: {selectedPoint.autor.join(" - ")}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Graph; 