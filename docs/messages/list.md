# Listing Messages Flows and Responses
Mesages are entities used by the email proxy for user comunication.

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/messages/list
```javascript
{
	query:{
		sentBy: "89a1bd805c8c11e48ed60800200c9a66"
	},
	limit: 2,
	page: 1
} 
```

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		messages:[
			{
				id: "29a1bd805c8c11e48ed60800200c9a66",
				content:"Hey I want to ask you about that property, can I join?",
				sentBy:"usa1bd805c8c11e48ed60800200c9a66",
				to:"rea1bd805c8c11e48ed60800200c9a66"
			},
			{
				id: "29a1bd805c8c11e48ed60800200c9a66",
				content:"Hey I want to ask you about that property, can I join?",
				sentBy:"usa1bd805c8c11e48ed60800200c9a66",
				to:"rea1bd805c8c11e48ed60800200c9a66"
			}
		]
	}	
} 
```

## Flow 2 - Error Flow: User not auntheticated

POST /api/messages/list
```javascript
{
	query:{
		sentBy: "89a1bd805c8c11e48ed60800200c9a66"
	},
	limit: 2,
	page: 1
} 
```


Return:
Status Code: 401

## Flow 3 - Error Flow: User is not sender or recipient

POST /api/messages/list
```javascript
{
	query:{
		sentBy: "89a1bd805c8c11e48ed60800200c9a66"
	},
	limit: 2,
	page: 1
} 
```


Return:
Status Code: 401