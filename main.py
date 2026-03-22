from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain.schema import HumanMessage
from pydantic import BaseModel
from typing import Optional, List
import os
import shutil

# ------------------ APP INIT ------------------
app = FastAPI()

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ ENV ------------------
os.environ["GROQ_API_KEY"] = "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"

# ------------------ LLM ------------------
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)

# Imports for processing
from Pdf_loader import load_single_pdf
from Text_split import split_documents
from embedings_store import create_or_update_vectorstore, get_retriever

# ------------------ CHAT API ------------------
@app.post("/chat")
async def chat(
    query: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None)
):
    if not query or not query.strip():
        raise HTTPException(status_code=422, detail="Query text is required")

    try:
        # -------- Process uploaded files --------
        if files:
            os.makedirs("temp", exist_ok=True)
            for file in files:
                if file.size == 0 or not file.filename.lower().endswith('.pdf'):
                    continue
                file_path = f"temp/{file.filename}"
                with open(file_path, "wb") as f:
                    content = await file.read()
                    if not content:
                        continue
                    f.write(content)
                data = load_single_pdf(file_path)
                texts = split_documents(data)
                if texts:
                    create_or_update_vectorstore(texts)
                os.remove(file_path)  # Clean up

        # -------- RAG with fallback --------
        try:
            retriever = get_retriever()
            qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                retriever=retriever,
                return_source_documents=True
            )
            result = qa_chain.invoke({"query": query})
            sources = [doc.metadata.get("source", "unknown") for doc in result.get("source_documents", [])]
            answer = result["result"]
        except ValueError as e:
            if "no documents" in str(e).lower() or "no vectorstore" in str(e).lower():
                print("No vectorstore, using plain LLM")
                result = llm.invoke([HumanMessage(content=query)])
                answer = result.content
                sources = []
            else:
                raise
        return {
            "answer": answer,
            "sources": sources
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = f"temp/{file.filename}"
        os.makedirs("temp", exist_ok=True)
        with open(file_location, "wb") as f:
            f.write(await file.read())
        return {"message": "File uploaded successfully", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "RAG Backend Running 🚀"}

