FROM node:8


COPY src /opt/app/
WORKDIR /opt/app/
RUN npm install

EXPOSE 2205

ENTRYPOINT ["node", "/opt/app/serverAuditor.js"]