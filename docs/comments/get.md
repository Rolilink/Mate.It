# Get an Specific Comment Flows and Responses
Comments are opinions from user to properties

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/comments/:id

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		comments:[
			{
				id: "32a1bd805c8c11e48ed60800200c9a66",
				property: "89a1bd805c8c11e48ed60800200c9a66"
				creator: "29a1bd805c8c11e48ed60800200c9a66",
				content: "Best Property Ever"
			}
		]
	}	
} 
```

## Flow 2 - Error Flow: User not auntheticated

POST /api/comments/:id

Return:
Status Code: 401
