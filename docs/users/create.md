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
  errors:{ 
   	email:{
   		message: 'Path `email` is required.',
      name: 'ValidatorError',
      path: 'email',
      type: 'required',
      value: undefined 
    },
   	password:{ 
    	message: 'Path `password` is required.',
      name: 'ValidatorError',
      path: 'password',
      type: 'required',
      value: undefined 
    } 
   }
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
	errors:{ 
		username:{ 
      message: 'Invalid characters',
      name: 'ValidatorError',
      path: 'username',
      type: 'user defined',
      value: 'n'
    } 
  } 
}

```