# builtin

# external
from fastapi import FastAPI

# internal


app: FastAPI = FastAPI()


@app.get("/")
def root():
    return {"message" : "Hello world!"}