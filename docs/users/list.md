# List Users Flows and Responses
Users are people that want to search or list properties.

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/users/list
```javascript
{
	query:{
		country: "Panama",
		active: true
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
		users:[
			{
				username:"rolilink",
				email:"me@rolilink.com",
				country: "Panama"
			},
			{
				username:"rolilink2",
				email:"me2@rolilink.com",
				country: "Panama"
			}
		]
	}	
} 
```

## Flow 2 - Error Flow: User is not auntheticated

POST /api/users/list
```javascript
{
	query:{
		country: "Panama",
		active: true
	},
	limit: 2,
	page: 1
} 


Return:
Status Code: 401