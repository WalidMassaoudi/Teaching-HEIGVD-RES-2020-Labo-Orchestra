FROM node:8.0
RUN npm install
COPY src /opt/app/

#Expose the port 2205
EXPOSE 2205
ENTRYPOINT ["node", "/opt/app/serverMusician.js"]
