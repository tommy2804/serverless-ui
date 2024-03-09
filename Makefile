.PHONY: dev lint complex coverage pre-commit yapf sort deploy destroy deps unit infra-tests integration e2e pipeline-tests docs lint-docs build
app-deps:
	cd serverless-ui/; \
		npm ci

cdk-deps:
	cd backend/; \
		npm ci

deps:
	make app-deps
	make cdk-deps

unit:
	pytest tests/unit  --cov-config=.coveragerc --cov=service --cov-report xml

app-build:
	cd serverless-ui/; \
		npm run build

cdk-build:
	cd backend/; \
		npm run build

build:
	make app-build
	make cdk-build

deploy:
	make build
	cd backend; \
		cdk deploy --require-approval=never --profile tommy-dev

destroy:
	cd backend/; \
		cdk destroy --force --profile tommy-dev

start: 
	cd serverless-ui/; \
		npm run dev
	
run-dev:
	docker-compose up
