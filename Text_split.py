from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_documents(data):
    """
    Split documents into chunks.
    """
    # Filter out empty pages
    data = [doc for doc in data if doc.page_content.strip()]
    if not data:
        print("Warning: No text content found in PDF")
        return []
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=[
            "\n\n",
            "\n",
            " ",
            ".",
            ","
        ]
    )
    texts = text_splitter.split_documents(data)
    print(f"Split into {len(texts)} chunks")
    if len(texts) == 0:
        print("Warning: Splitter produced 0 chunks - PDF may have insufficient text")
    return texts

