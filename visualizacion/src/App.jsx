import './App.css';
import Graph from './components/Graph/Graph';
import DocumentComparison from './components/DocumentComparison/DocumentComparison';
import Table from "./components/Table/Table"
import { useState } from 'react';


function App() {

  const [selectedSop, setSelectedSop] = useState("");
  
  // Handler function to update the state
  const handleSopSelection = (sopName) => {
    setSelectedSop(sopName);
  };

  return (
    <div className="app">
      <header>
        <h1>Analisis de documentos</h1>
      </header>
      <section className='doc-2-vec'>
        <h2>Doc2Vec</h2>
        <Graph 
          file={"Doc2Vec_con_autores_separador_corregido.csv"} 
          onSopSelect={handleSopSelection}
        />
        <Table
          file={'/simil_doc_doc2vec_cosine_sorted.csv'} 
          selectedSop={selectedSop}  
        />
        <DocumentComparison file={"/simil_doc_doc2vec_cosine.csv"} />
      </section>
    </div>
  );
}

export default App; 