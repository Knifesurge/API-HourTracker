# Save docker images for offline development if not present
if [ ! -f ".postgres_16_alpine.tar.gz" ]; then
    docker save postgres_16_alpine | gzip > .postgres_16_alpine.tar.gz
fi

if [ ! -f ".docker-backend_api.tar.gz" ]; then
    docker save docker-backend_api | gzip > .docker-backend_api.tar.gz
fi

if [ ! -f ".docker-frontend_client.tar.gz" ]; then
    docker save docker-frontend_client | gzip > .docker-frontend_client.tar.gz
fi

# Load offline image assets
docker load < .postgres_16_alpine.tar.gz
docker load < .docker-backend_api.tar.gz
docker load < .docker-frontend_client.tar.gz

docker compose -f docker/docker-compose.yml --env-file .env build --pull=false

docker compose -f docker/docker-compose.yml --env-file .env up