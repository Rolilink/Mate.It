# Creating a Comment Flows and Responses
Comments are opinions from user to properties

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/comments
```javascript
{
	comment:{
		content: "hello world this is a comment",
		creator: "29a1bd805c8c11e48ed60800200c9a66",
		property:"89a1bd805c8c11e48ed60800200c9a66"
	}
} 
```

Return:
Status Code: 201
Body:
```javascript
{
	response:{
		comment:{
			id: "29a1bd805c8c11e48ed60800200c9a66",
			content: "hello world this is a comment",
			creator: "29a1bd805c8c11e48ed60800200c9a66",
			property:"89a1bd805c8c11e48ed60800200c9a66"
		}
	}	
} 
```

## Flow 2 - Error Flow: User is not authenticated


POST /api/comments
```javascript
{
	comment:{
		content: "hello world this is a comment",
		creator: "29a1bd805c8c11e48ed60800200c9a66",
		property:"89a1bd805c8c11e48ed60800200c9a66"
	}
} 
```

Return:
Status Code: 401


## Flow 3 - Error Flow: Missing Required Fields


POST /api/comments
```javascript
{
	comment:{
		creator: "29a1bd805c8c11e48ed60800200c9a66"
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
			field:"content"
		},
		{
			type:"field_missing"
			field:"property"
		}
	]
} 
```

## Flow 4 - Error Flow: Validation Errors


POST /api/comments
```javascript
{
	comment:{
		content: "hello world this is a comment",
		creator: "29a1bd805c8c11e48ed60800200c9a66",
		property: true
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
			field:"property"
		}
	]
} 
```


