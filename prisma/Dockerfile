FROM node:14
RUN openssl version -v
RUN uname -a
RUN echo $DATABASE_URL

WORKDIR /app

# Install prisma for the migration
RUN npm i -g prisma --unsafe-perm
# Copy schema and migration folder
ADD ./ ./prisma/
# RUN prisma migrate deploy
# RUN prisma db seed
CMD ["prisma", "migrate", "deploy"]