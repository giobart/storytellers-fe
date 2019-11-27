FROM python:3.6-alpine

RUN mkdir -p /usr/src/app

ADD . /usr/src/app
WORKDIR /usr/src/app

ENV PYTHONPATH .

RUN pip install -r requirements.txt

EXPOSE 8080

CMD [ "python", "app.py" ]