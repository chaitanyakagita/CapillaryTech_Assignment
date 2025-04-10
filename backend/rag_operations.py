import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config import Config

class RAGSystem:
    def __init__(self):
        self.embedder = SentenceTransformer(Config.EMBEDDING_MODEL)
        self.index = None  
        self.documents = [] 
        self.metadatas = []  

    def preprocess_data(self):
        with open('documentation.json', encoding="utf-8") as f:
            data = json.load(f)

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

        chunks = []
        for section in data['sections']:
            for article in section['articles']:
                texts = splitter.split_text(article['content'])
                chunks.extend([{
                    'text': text,
                    'metadata': {
                        'section': section['title'],
                        'title': article['title'],
                        'url': article['url']
                    }
                } for text in texts])

        return chunks

    def generate_embeddings(self, chunks):
        embeddings = self.embedder.encode(
            [chunk['text'] for chunk in chunks],
            show_progress_bar=True
        )
        return embeddings

    def populate_vector_db(self, chunks, embeddings):
        embeddings_np = np.array(embeddings).astype("float32")

        self.index = faiss.IndexFlatL2(embeddings_np.shape[1])
        self.index.add(embeddings_np)

        self.documents = [chunk['text'] for chunk in chunks]
        self.metadatas = [chunk['metadata'] for chunk in chunks]

    def query(self, question, n_results=3):
        query_embedding = self.embedder.encode([question]).astype("float32")
        distances, indices = self.index.search(query_embedding, n_results)

        return [
            {
                'content': self.documents[i],
                'metadata': self.metadatas[i]
            }
            for i in indices[0]
        ]
