
SERVICE_NAME=imagesharingservice
IMAGE_TAG=$(SERVICE_NAME)-img

default: build run

build-app:
	npm run build

build: build-app
	docker build --no-cache -t $(IMAGE_TAG) .

volume:
 	docker volume create \
    	--opt device=:/usr/src/app \
		assets
run: volume
	docker-compose \
		-f docker-compose.yaml \
		up web mongodb

run-web: volume
	docker-compose \
		-f docker-compose.yaml \
		up --build -d web

test:
	npm run test

clean:
	docker stop $(SERVICE_NAME) || echo ""
	docker system prune -f || echo ""