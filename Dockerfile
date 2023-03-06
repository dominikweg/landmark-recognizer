FROM python:3.7-slim-buster
RUN pip3 install --upgrade pip
COPY ./ app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "main.py"]