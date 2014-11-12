# Deleting a Property Flows and Responses
Properties are places where users stays

## Flow 1 - Success Flow
This Flow is the happy day flow

DELETE /api/properties/:id

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		property:{
			id: "29a1bd805c8c11e48ed60800200c9a66"
		}
	}	
} 
```

## Flow 2 - Error Flow: User is not authenticated

DELETE /api/properties/:id

Return:
Status Code: 401


## Flow 3 - Error Flow: Property don't exist

DELETE /api/properties/:id


Return:
Status Code: 404

## Flow 4 - Error Flow: User is not owner or admin

DELETE /api/properties/:id


Return:
Status Code: 401