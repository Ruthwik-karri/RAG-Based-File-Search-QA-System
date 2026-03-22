from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

def get_or_create_vectorstore():
    """
    Load existing vectorstore or return None if not exists.
    """
    if os.path.exists("faiss_index"):
        vectorstore = FAISS.load_local(
            "faiss_index",
            embeddings,
            allow_dangerous_deserialization=True
        )
        print("FAISS index loaded")
        return vectorstore
    else:
        print("No FAISS index found, creating new when adding docs")
        return None

def create_or_update_vectorstore(texts):
    """
    Create new or add to vectorstore and save.
    """
    if not texts:
        print("No texts provided - skipping vectorstore update")
        return
    vectorstore = get_or_create_vectorstore()
    if vectorstore is None:
        vectorstore = FAISS.from_documents(texts, embeddings)
    else:
        vectorstore.add_documents(texts)
    vectorstore.save_local("faiss_index")
    print("FAISS index updated and saved")

def get_retriever():
    """
    Get retriever from vectorstore (raises if none).
    """
    vectorstore = get_or_create_vectorstore()
    if vectorstore is None:
        raise ValueError("No documents in vectorstore. Please upload PDFs with sufficient text first.")
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 2})
    return retriever

