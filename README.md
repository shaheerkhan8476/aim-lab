# team-corewell-capstone-2025

How to run frontend:

1. cd to frontend folder in vscode
2. npm i
3. npm start

How to run backend:

1. cd to backend folder in vscode
2. go run .

How to run flask:

1. Create .env file in /flask-llm/.env, add OPENAI_API_KEY="key goes here"
2. cd to main directory (team-corewell-capstone-2025)
3. docker-compose -f docker-compose.yml -p flask-llm up
4. Open docker desktop
5. Run docker container with image

Make request to LLM microservice:

1. Run go backend
2. Run docker image
3. Open postman, make a POST request to [http://localhost:8060/messageRequest](http://localhost:8060/messageRequest)
4. Add the following to the body of the request:

```json
    {
        "message" : "Your message here"
    }
```

5. Send request through postman, check go backend terminal to ensure response was received

<br />

