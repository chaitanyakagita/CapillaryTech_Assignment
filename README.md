# CapillaryTech Documentation Chatbot
This project is to built a chatbot that can assist developers and users by answering questions related to CapillaryTech documentation using an AI-powered Retrieval Augmented Generation (RAG) system.

## Technologies Used

- **Backend**: FastAPI, FAISS, SentenceTransformers, Langchain, Groq API
- **Frontend**: React.js + CSS
- **Scrapping**: JS, Cheerio, Node-fetch
- **LLM Model**: Qwen-2.5-32B via Groq API
- **Data Format**: JSON (for documentation storage)


## Features

1. **RAG-based Q&A System:**
    - Retrieves relevant document chunks and generates answers using a powerful LLM.

2. **Interactive Chat UI:**
    - Users can chat with the bot to get contextually accurate responses.

3. **Web Scraping Module:**
    - Automatically scrapes and extracts documentation content using Cheerio.


4. **Vector Search:**
    - Uses FAISS to perform efficient semantic search over document embeddings.
      

## How It Works

1. **Document Scraping:**
    - A Node.js scraper fetches articles from CapillaryTech docs and stores them in structured JSON format.

2. **Data Ingestion & Embedding:**
    - The backend loads the scraped JSON, splits it into chunks, embeds it using SentenceTransformers, and stores it in a FAISS vector database.


3. **Q&A via Chatbot:**
    - When the user asks a question, the backend retrieves relevant document chunks and queries the Groq LLM with a detailed prompt to generate an accurate answer.


## Video
I have recorded a video from my laptop demonstrating the features and functionality of the application. You can watch the video [https://drive.google.com/file/d/1nJqePZ7uRbkmhlGcfMbpDeLsamw08cJa/view?usp=sharing](https://drive.google.com/file/d/1nJqePZ7uRbkmhlGcfMbpDeLsamw08cJa/view?usp=sharing)

  
## Given Documentation Link
   [https://docs.capillarytech.com/](https://docs.capillarytech.com/)
    


    
## How to Run

1. Clone the repository:
    ```bash
    git clone https://github.com/chaitanyakagita/CapillaryTech_Assignment.git
    ```
   ```bash
    cd CapillaryTech_Assignment
    ```  

2. Run the "scrapper.js" file first
     ```bash
    cd scrapper
    ```  
    ```bash
    npm install
    ```
    ```bash
    node scrapper.js
    ```    

4. Backend Folder
    ```bash
    cd backend
    ```
    ```bash
    pip install -r requirements.txt 
    ```
   ```bash
    uvicorn app:app --reload 
    ```

5. Frontend Folder
    ```bash
    cd frontend
    ```
    ```bash
    npm install
    ```
    ```bash
    npm start
    ```
    
