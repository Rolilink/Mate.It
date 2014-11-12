# Get an Users Flows and Responses
Users are people that want to search or list properties.

## Flow 1 - Success Flow
This Flow is the happy day flow

GET /api/users/:id

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		user:[
			{
				username:"rolilink",
				email:"me@rolilink.com",
				country: "Panama"
			}
		]
	}	
} 
```

## Flow 2 - Error Flow: User not auntheticated

GET /api/users/:id

Return:
Status Code: 401

## Flow 3 - Error Flow: User associated to id does not exist

POST /api/users/:id

Return:
Status Code: 404