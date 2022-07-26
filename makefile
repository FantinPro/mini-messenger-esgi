.PHONY: setup start stop restart client server migrate fixtures install production run cl sr

setup:
	docker-compose up --detach node nginx postgres mongodb adminer certbot

start:
	docker-compose up --detach node nginx postgres mongodb adminer

stop:
	docker-compose down --remove-orphans --timeout 0

restart: stop start

install: start
	docker-compose exec node npm install

client:
	docker-compose exec node npm --workspace client run development

server:
	docker-compose exec node npm --workspace server run development

cl:
	docker-compose exec node npm --workspace client run development

sr:
	docker-compose exec node npm --workspace server run development

migrate: start
	docker-compose exec node npm --workspace server run migrate

fixtures: migrate
	docker-compose exec node npm --workspace server run fixtures

production: install
	docker-compose exec node npm --workspaces run production

run: production
	docker-compose exec node npm start
