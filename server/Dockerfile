# Используем официальный образ Deno
FROM denoland/deno:1.45.2

WORKDIR /app

# Изменим владельца рабочей директории на deno
RUN chown -R deno:deno /app
USER deno

COPY . ./

RUN deno cache src/main.ts

EXPOSE 3000

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--unstable", "src/main.ts"]