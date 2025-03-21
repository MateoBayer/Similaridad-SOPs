import './App.css';
import Graph from './components/Graph/Graph';
import DocumentComparison from './components/DocumentComparison/DocumentComparison';
import Table from "./components/Table/Table"


function App() {
  return (
    <div className="app">
      <header>
        <h1>Analisis de documentos</h1>
      </header>
      <section className='doc-2-vec'>
        <h2>Doc2Vec</h2>
        {/*<Graph file={"Cosine_d2v 1.csv"} />*/}
        <Graph file={"Doc2Vec_con_autores_separador_corregido.csv"} />
        <DocumentComparison file={"/simil_doc_doc2vec_cosine.csv"} />
        <Table file={'/simil_doc_doc2vec_cosine_sorted.csv'} />
      </section>
    </div>
  );
}

export default App; 