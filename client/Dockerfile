FROM node:20.13.1

WORKDIR /app


COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .  


EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0"]