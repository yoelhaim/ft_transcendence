FROM node:buster

RUN mkdir /home/back-end
COPY ./back-end/ /home/back-end/

COPY ./tools/script.sh /
RUN chmod 777 /script.sh

CMD ["./script.sh"]