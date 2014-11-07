# Get an Users Flows and Responses
Users are people that want to search or list properties.

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/users/:id

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		users:[
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

POST /api/users/:id

Return:
Status Code: 401

## Flow 3 - Error Flow: User is not self or admin

POST /api/users/:id

Return:
Status Code: 401