import { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { parseCSV } from '../../utils/dataUtils';
import './Graph.css';

function Graph( {file, onSopSelect, highlightedSops, onFilteredAuthorSops}) {
  const [graphData, setGraphData] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState(null);
  const [nameSop, setNameSop] = useState("");
  const [nameAuthor, setNameAuthor] = useState("")
  const [titleName, setTitleName] = useState("")
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

  const obtainMatchedSops = (name) => {
    const matchingSops = filteredData.filter(d => {
      const filteredNameAuthors = d.autor.some(aut => aut.toLowerCase().includes(name.toLowerCase()));
      return filteredNameAuthors;
    })
    onFilteredAuthorSops(matchingSops);
  }

  const shouldHighlight = nameSop.length > 2 || nameAuthor.length > 2 || titleName.length > 2;

  const pointFilters = useMemo(() => {
    if (!filteredData) return [];
    
    return filteredData.map(d => {
      const matchesName = d.document.toLowerCase().startsWith(nameSop.toLowerCase());
      const matchesAuthor = d.autor.some(aut => aut.toLowerCase().includes(nameAuthor.toLowerCase()));
      const matchesTitle = d.title.toLowerCase().includes(titleName.toLowerCase());
      
      const isHighlighted = matchesName && matchesAuthor && matchesTitle;
      
      return {
        isHighlighted,
        color: labelColors[d.label]
      };
    });
  }, [filteredData, nameSop, nameAuthor, titleName, labelColors]);

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
        <div className="input-filter">
          <label>Documento a buscar</label>
          <input
            type="text"
            value={nameSop}
            onChange={(e) => {
              setNameSop(e.target.value);
              //if ( nameSop.length > 2) {
              //  obtainMatchedSops();
              //}
            }}
            placeholder="Escribe nombre de un SOP..."
          />
        </div>
        <div className="input-filter">
          <label>Filtrado por autores</label>
          <input
            type='text'
            value={nameAuthor}
            onChange={(e) => {
              setNameAuthor(e.target.value);
              // Me falta limpiar la lista cuando se limpia este valor
              obtainMatchedSops(e.target.value);
            }}
            placeholder="Escribe el nombre de un autor..."
          />
        </div>
        <div className="input-filter">
          <label>Filtrado por titulo</label>
          <input
            type='text'
            value={titleName}
            onChange={(e) => {
              setTitleName(e.target.value);
            }}
            placeholder="Escribe el titulo de un SOP..."
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
                  color: pointFilters.map(p => p.color),
                  line: { width: 1, color: 'black' },
                  size: shouldHighlight 
                    ? pointFilters.map(p => p.isHighlighted ? 15 : 10)
                    : 10,
                  opacity: shouldHighlight
                    ? pointFilters.map(p => p.isHighlighted ? 0.8 : 0.2)
                    : 0.8,
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