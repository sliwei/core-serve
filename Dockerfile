FROM node:14.17.1-alpine

COPY dist /www
COPY node_modules /www/node_modules

#设置变量
ENV DATABASE=""
ENV USERNAME=""
ENV PASSWORD=""
ENV HOST=""
ENV PORT=""

WORKDIR /www

EXPOSE 3004

RUN ["chmod", "+x", "./start.sh"]

CMD ./start.sh

