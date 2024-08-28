FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /docker/nginx/spacex && \
  mkdir -p /docker/nginx/spacex/buckup && \
  mkdir -p /docker/nginx/account && \
  mkdir -p /docker/nginx/account/buckup
COPY ./nginx.conf /etc/nginx/conf.d
COPY ./proxy_params /etc/nginx
