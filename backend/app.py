from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_operations import RAGSystem
from groq import Groq
from config import Config

app = FastAPI()
rag = RAGSystem()
groq_client = Groq(api_key=Config.GROQ_API_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionInput(BaseModel):
    question: str

@app.on_event("startup")
async def startup():
    chunks = rag.preprocess_data()
    embeddings = rag.generate_embeddings(chunks)
    rag.populate_vector_db(chunks, embeddings)

@app.post("/ask")
async def ask_question(data: QuestionInput):
    question = data.question
    context_chunks = rag.query(question)

    context = "\n\n".join(
        f"From {chunk['metadata']['section']} > {chunk['metadata']['title']} ({chunk['metadata']['url']}):\n{chunk['content']}"
        for chunk in context_chunks
    )

    
    system_prompt = f"""
        You are a helpful, accurate assistant for CapillaryTech documentation.
        Only use the following context to answer the user's question. Do NOT use any external knowledge or make assumptions.
        If the context doesn't contain the answer, respond with: "I'm sorry, I couldn't find relevant information in the documentation."
        Context: {context}
        Always:
        - Answer concisely and clearly
        - Use bullet points or short paragraphs if helpful
        - Mention relevant API names, parameters, or sections when available
        - If possible, include specific UI or API paths to help the user locate the functionality easily.
        """



    response = groq_client.chat.completions.create(
        messages=[
            { "role": "system", "content": system_prompt },
            { "role": "user", "content": question }
        ],
        model="qwen-2.5-32b",
        temperature=0.3
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": [chunk['metadata'] for chunk in context_chunks]
    }
