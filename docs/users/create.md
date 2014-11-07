# Creating an User Flows and Responses
Users are people that want to search or list properties.

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/users
```javascript
{
	user:{
		username:"rolilink",
		email:"me@rolilink.com",
		password:"12345678"
	}
} 
```

Return:
Status Code: 201
Body:
```javascript
{
	response:{
		user:{
			id: "29a1bd805c8c11e48ed60800200c9a66",
			email: "me@rolilink.com",
			username: "Rolilink"
		}
	}	
} 
```
## Flow 2 - Error Flow: Missing Required Fields

POST /api/users
```javascript
{
	user:{
		password:"12345678"
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
			field:"email"
		},
		{
			type:"field_missing"
			field:"username"
		}
	]
} 
```

## Flow 3 - Error Flow: Fields Validation Failed

POST /api/users
```javascript
{
	user:{
		username:"roli",
		email:"merolilink.com",
		password:"12345678"
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
			field:"email",
			message:"not a valid email format"
		},
		{
			type:"validation_err"
			field:"username",
			message:"username min length is 6 characters"
		}
	]
} 
```

## Flow 4 - Error Flow: User Trying to create another User

POST /api/users
```javascript
{
	user:{
		username:"rolilink",
		email:"me@rolilink.com",
		password:"12345678"
	}
} 
```

Return:
Status Code: 401
