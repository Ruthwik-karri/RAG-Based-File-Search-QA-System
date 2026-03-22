
# 📂 RAG-Based File Search & QA System

> 🚀 A full-stack AI application that allows users to **upload documents and ask questions**, powered by **RAG (Retrieval-Augmented Generation)** and **Semantic Search**.
>
## UI 

<img width="1908" height="901" alt="image" src="https://github.com/user-attachments/assets/0e6614b8-0307-4209-82a5-606f3505a6c6" />


## 🔥 Features

- 📄 Upload documents (PDF, TXT, DOCX)
- 🤖 Ask questions like ChatGPT based on your files
- 🔍 **Semantic Search** (understands meaning, not just keywords)
- ⚡ Fast retrieval using **FAISS Vector Database**
- 🧠 LLM-powered answers using **Groq (LLaMA 3)**
- 💬 Chat-style UI with sidebar history
- 📁 Multi-file support

---

## 🧠 Core Concepts

### 🔹 RAG (Retrieval-Augmented Generation)
- Retriever → Finds relevant document chunks  
- LLM → Generates final answer  

### 🔹 Semantic Search
- Converts text into **embeddings (vectors)**  
- Finds **meaning-based matches**  

### 🔹 Vector Database (FAISS)
- Stores embeddings efficiently  
- Enables fast similarity search  

---

## 🏗️ Tech Stack

| Layer        | Technology |
|-------------|------------|
| Frontend     | React.js (Vite) |
| Backend      | FastAPI |
| Embeddings   | HuggingFace (`all-mpnet-base-v2`) |
| Vector Store | FAISS |
| LLM          | Groq (`llama-3.1-8b-instant`) |
| Framework    | LangChain |

---

## ⚙️ Project Structure

project-root/

├── backend/
│ ├── main.py
│ ├── Pdf_loader.py
│ ├── Text_split.py
│ ├── embedings_store.py
│ └── llm_creation.py

├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── Chat.jsx
│ │ ├── Sidebar.jsx
│ │ └── components/
│ └── package.json

└── README.md


---

## 🚀 Getting Started

### 1️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Set API key:
export GROQ_API_KEY="your_api_key_here"
---

### Frontend Setup
cd frontend
npm install
npm run dev
