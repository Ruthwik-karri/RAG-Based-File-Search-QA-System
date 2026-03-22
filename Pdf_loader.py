from langchain_community.document_loaders import PyPDFLoader

def load_single_pdf(file_path: str):
    """
    Load a single PDF file.
    """
    loader = PyPDFLoader(file_path)
    data = loader.load()
    print(f"Loaded {len(data)} documents from {file_path}")
    return data
