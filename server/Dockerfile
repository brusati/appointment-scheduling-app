FROM python:3.9
WORKDIR /code/
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./app /code/server/app
CMD ["uvicorn", "server.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

EXPOSE 8000