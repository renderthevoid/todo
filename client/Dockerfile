FROM node:20.13.1

WORKDIR /app


COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .  

# Запускаем dev-сервер
CMD ["yarn", "dev"]