# Deleting a Comment Flows and Responses
Comments are opinions from user to properties

# Flow 1 - Success Flow
This Flow is the happy day flow

DELETE /api/comments/:id

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		comment:{
			id: "29a1bd805c8c11e48ed60800200c9a66"
		}
	}	
} 
```

## Flow 2 - Error Flow: User not auntheticated

DELETE /api/comments/:id


Return:
Status Code: 401


## Flow 3 - Error Flow: User don't exist

DELETE /api/comments/:id


Return:
Status Code: 404


## Flow 4 - Error Flow: User is not authorized (message owner or admin)

DELETE /api/comments/:id


Return:
Status Code: 401