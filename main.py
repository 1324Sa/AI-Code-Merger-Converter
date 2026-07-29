import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

app = FastAPI(title="AI Multi-Language Code Engine - Local")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تهيئة نموذج الذكاء الاصطناعي
llm = ChatOllama(
    model="qwen2.5-coder:7b",
    base_url="http://localhost:11434",
    temperature=0.1,
)

# نماذج الطلبات
class MergeRequest(BaseModel):
    existing_code: str
    incoming_code: str
    language: str = "javascript"

class ConvertRequest(BaseModel):
    source_code: str
    source_language: str
    target_language: str

# 1. API دمج الأكواد
@app.post("/api/merge")
async def process_code_merge(request: MergeRequest):
    prompt_template = ChatPromptTemplate.from_template(
        """You are an expert AI software engineer specialized in code merging in {language}.
        
        Analyze the following two source code inputs:
        ### EXISTING CODE:
        ```{existing_code}```
        
        ### INCOMING CODE TO MERGE:
        ```{incoming_code}```
        
        CRITICAL: Respond ONLY with a valid JSON object matching this structure:
        {{
            "can_merge": true or false,
            "conflicts": [
                {{
                    "reason": "Detailed explanation of conflict",
                    "line_or_function": "Function or line reference",
                    "suggestion": "How to resolve the conflict"
                }}
            ],
            "merged_code": "Complete merged code string if can_merge is true, otherwise empty"
        }}
        """
    )
    
    chain = prompt_template | llm.bind(format="json")
    
    try:
        response = chain.invoke({
            "existing_code": request.existing_code,
            "incoming_code": request.incoming_code,
            "language": request.language
        })
        return json.loads(response.content)
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Execution error: {str(err)}")

# 2. API تحويل اللغات البرمجية (Code Migration / Translation)
@app.post("/api/convert")
async def process_code_conversion(request: ConvertRequest):
    prompt_template = ChatPromptTemplate.from_template(
        """You are an expert compiler engineer and language migration specialist.
        Translate the following source code strictly from {source_language} to {target_language}.
        
        Rules to follow:
        1. Maintain idiomatic patterns and conventions of {target_language}.
        2. Handle type conversions, standard libraries, and memory management where applicable.
        3. Ensure functional equivalence.
        
        SOURCE CODE ({source_language}):
        ```{source_code}```
        
        CRITICAL: Respond ONLY with a valid JSON object matching this structure:
        {{
            "converted_code": "The fully converted code in target language",
            "notes": ["Key architectural/syntax adaptations made during translation"]
        }}
        """
    )
    
    chain = prompt_template | llm.bind(format="json")
    
    try:
        response = chain.invoke({
            "source_code": request.source_code,
            "source_language": request.source_language,
            "target_language": request.target_language
        })
        return json.loads(response.content)
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(err)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)