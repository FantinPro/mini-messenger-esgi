.PHONY: start stop restart client server migrate fixtures install production run

start:
	docker-compose up --detach

stop:
	docker-compose down --remove-orphans --volumes --timeout 0

restart: stop start

install: start
	docker-compose exec node npm install

client:
	docker-compose exec node npm --workspace client run development

server:
	docker-compose exec node npm --workspace server run development

migrate: start
	docker-compose exec node npm --workspace server run migrate

fixtures: start
	docker-compose exec node npm --workspace server run fixtures

production: install
	docker-compose exec node npm --workspaces run production

run: production
	docker-compose exec node npm start
