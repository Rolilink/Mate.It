# Deleting an User Flows and Responses
Users are people that want to search or list properties.

## Flow 1 - Success Flow
This Flow is the happy day flow

DELETE /api/users/:id

Return:
Status Code: 200
Body:
```javascript
{
	user:{
		id: "29a1bd805c8c11e48ed60800200c9a66"
	}
} 
```

## Flow 2 - Error Flow: User not auntheticated

DELETE /api/users/:id


Return:
Status Code: 401


## Flow 3 - Error Flow: User is not authorized (same user or admin)

DELETE /api/users/:id


Return:
Status Code: 401