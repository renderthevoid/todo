FROM node:20.13.1

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]

