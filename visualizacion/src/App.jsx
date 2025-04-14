import './App.css';
import Graph from './components/Graph/Graph';
import DocumentComparison from './components/DocumentComparison/DocumentComparison';
import Table from "./components/Table/Table"
import { useState, useEffect } from 'react';


function App() {

  const [selectedSop, setSelectedSop] = useState("");
  const [highlightedSops, setHighlightedSops] = useState([])
  const [filteredAuthorSops, setFilteredAuthorSops] = useState(new Set())
  // Handler function to update the state
  const handleSopSelection = (sopName) => {
    setSelectedSop(sopName);
  };

  const handleHighlightedSop = (sopName) => {
    setHighlightedSops(prev => {
      if (prev.includes(sopName)) {
        return prev.filter(sop => sop != sopName);
      } else {
        return [...prev, sopName];
      }
    });
  };

  // Add the name of the sops to filter them in the Table
  const handleFilteredAuthorSelection = (namesFilteredAuthorSops) => {
    const nameSops = new Set()
    namesFilteredAuthorSops.forEach(sop => {
      nameSops.add(sop.document)
    });
    setFilteredAuthorSops(nameSops);
  }

  return (
    <div className="app">
      <header>
        <h1>Analisis de documentos SOP</h1>
      </header>
      <section className='doc-2-vec'>
        <h2>Doc2Vec</h2>
        <Graph
          file={"graph_data.csv"} 
          onSopSelect={handleSopSelection}
          highlightedSops={highlightedSops}
          onFilteredAuthorSops={handleFilteredAuthorSelection}
        />
        <Table
          file={'table_data.csv'} 
          selectedSop={selectedSop}  
          onHighlightSop={handleHighlightedSop}
          highlightedSops={highlightedSops} // Para resaltar los que ya estan resaltados
          filteredAuthorSops={filteredAuthorSops}
        />
        <DocumentComparison file={"comparison_data.csv"} />
      </section>
    </div>
  );
}

export default App; 