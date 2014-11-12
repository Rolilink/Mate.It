# Updating a Comment Flows and Responses
Comments are opinions from user to properties


## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/comments/:id
```javascript
{
	comment:{
		content: "Best comment Ever 3"
	}
} 
```

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		comment:{
			id: "29a1bd805c8c11e48ed60800200c9a66",
			property: "89a1bd805c8c11e48ed60800200c9a66",
			creator: "29a1bd805c8c11e48ed60800200c9a66",
			content: "Best comment Ever 3"
		}
	}	
} 
```

## Flow 2 - Error Flow: Fields Validation Failed

POST /api/comments/:id
```javascript
{
	comment:{
		property: true
	}
} 
```
```

Return:
Status Code: 422
Body:
```javascript
{
	errors:[
		{
			type:"validation_err",
			field:"property"
		}
	]
} 
```

## Flow 3 - Error Flow: User is not owner or admin

POST /api/comments/:id
```javascript
{
	comment:{
		content: "Best comment Ever 3"
	}
} 
```

Return:
Status Code: 401


## Flow 4 - Error Flow: User is not Authenticated

POST /api/comments/:id
```javascript
{
	comment:{
		content: "Best comment Ever 3"
	}
} 
```

Return:
Status Code: 401

## Flow 5 - Error Flow: Comment associated to user id dont exist

POST /api/comments/:id
```javascript
{
	comment:{
		content: "Best comment Ever 3"
	}
} 
```

Return:
Status Code: 404