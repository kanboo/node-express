# 指定 node docker image
FROM node:14.17.6
# 建立一個 /usr/src/node-server 來放置檔案
RUN mkdir -p /usr/src/node-server
# 將初始工作環境設置在 /usr/src/node-server
WORKDIR /usr/src/node-server
# 將本機 package 相關檔案 拷貝到 image /usr/src/node-server 中
COPY package*.json /usr/src/node-server
# 安裝依賴
RUN npm install
