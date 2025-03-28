import './App.css';
import Graph from './components/Graph/Graph';
import DocumentComparison from './components/DocumentComparison/DocumentComparison';
import Table from "./components/Table/Table"
import { useState, useEffect } from 'react';


function App() {

  const [selectedSop, setSelectedSop] = useState("");
  const [highlightedSops, setHighlightedSops] = useState([])
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

  return (
    <div className="app">
      <header>
        <h1>Analisis de documentos SOP</h1>
      </header>
      <section className='doc-2-vec'>
        <h2>Doc2Vec</h2>
        <Graph 
          file={"Doc2Vec_con_autores_separador_corregido.csv"} 
          onSopSelect={handleSopSelection}
          highlightedSops={highlightedSops}
        />
        <Table
          file={'/simil_doc_doc2vec_cosine_sorted.csv'} 
          selectedSop={selectedSop}  
          onHighlightSop={handleHighlightedSop}
          highlightedSops={highlightedSops} // Para resaltar los que ya estan resaltados
        />
        <DocumentComparison file={"/simil_doc_doc2vec_cosine.csv"} />
      </section>
    </div>
  );
}

export default App; 