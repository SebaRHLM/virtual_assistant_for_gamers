from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI(title="ZeroAI - Servicio de IA")

class Prompt(BaseModel):
    prompt: str

# Cargar modelo local
print("Cargando modelo Phi-3 Mini localmente...")
model_name = "./model/phi3-mini"  # Ruta local del modelo
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
print("Modelo cargado correctamente")

@app.post("/inference")
def inference(data: Prompt):
    prompt = data.prompt
    print(f"Prompt recibido: {prompt}")

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=200, temperature=0.7)
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    print(f"🤖 Respuesta generada: {text[:100]}...")
    return {"response": text}
