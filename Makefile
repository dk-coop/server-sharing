
SERVICE_NAME=imagesharingservice
IMAGE_TAG=$(SERVICE_NAME)-img

default: build run

build:
	docker build -t $(IMAGE_TAG) .

volume:
 	docker volume create \
    	--opt device=:/usr/src \
		assets
run: volume
	docker-compose up

run-web: volume
	docker-compose up \
		--build -d web

test:
	npm run test


