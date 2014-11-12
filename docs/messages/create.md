# Creating a message Flows and Responses
Mesages are entities used by the email proxy for user comunication.

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/messages
```javascript
{
	message:{
		content:"Hey I want to ask you about that property, can I join?",
		to:"rea1bd805c8c11e48ed60800200c9a66"
	}
} 
```

Return:
Status Code: 201
Body:
```javascript
{
	response:{
		message:{
			id: "29a1bd805c8c11e48ed60800200c9a66",
			content:"Hey I want to ask you about that property, can I join?",
			sentBy:"usa1bd805c8c11e48ed60800200c9a66",
			to:"rea1bd805c8c11e48ed60800200c9a66"
		}
	}	
} 
```

## Flow 2 - Error Flow: User is not authenticated

POST /api/messages
```javascript
{
	message:{
		content:"Hey I want to ask you about that property, can I join?",
		to:"rea1bd805c8c11e48ed60800200c9a66"
	}
} 
```

Return:
Status Code: 401


## Flow 3 - Error Flow: Missing Required Fields

POST /api/messages
```javascript
{
	message:{
		content:"Hey I want to ask you about that property, can I join?"
	}
} 
```

Return:
Status Code: 422
Body:
```javascript
{
	errors:[
		{
			type:"field_missing"
			field:"to"
		}
	]
} 
```

## Flow 4 - Error Flow: Validation Errors

POST /api/messages
```javascript
{
	message:{
		id: "29a1bd805c8c11e48ed60800200c9a66",
		content:"Hey I want to ask you about that property, can I join?",
		to:true
	}
} 
```

Return:
Status Code: 422
Body:
```javascript
{
	errors:[
		{
			type:"validation_err"
			field:"to"
		}
	]
} 
```


