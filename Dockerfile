# 第一阶段: 构建前端
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
# 禁用引擎检查以防止某些旧依赖报错，并安装依赖
RUN yarn install --frozen-lockfile --ignore-engines
COPY . .
RUN yarn build

# 第二阶段: 放入 Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
