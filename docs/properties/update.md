# Updating a Property Flows and Responses
Properties are places where users stays

## Flow 1 - Success Flow
This Flow is the happy day flow

POST /api/properties/:id
```javascript
{
	property:{
		capacity: 3
	}
} 
```

Return:
Status Code: 200
Body:
```javascript
{
	response:{
		property:{
			id: "29a1bd805c8c11e48ed60800200c9a66",
			available: true,
			capacity: 3,
			address: "Cerro Viento, Calle 62",
			country: "Panama",
			roomType: "private",
			propertyType: "house",
			title: "This is a Title",
			description: "asdasdasdasdas sadasdasdasdas asdasdasdasdasdasd asdasdas",
			genderAllowed: 'both',
			amenities: ['kitchen','internet','wifi'],
			price: 300,
			loc: [9.066006, -79.448069]
		}
	}	
} 
```

## Flow 2 - Error Flow: Fields Validation Failed

POST /api/properties/:id
```javascript
{
	property:{
		capacity: 0
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
			type:"validation_err",
			field:"capacity"
		}
	]
} 
```

## Flow 3 - Error Flow: User is not owner or admin

POST /api/properties/:id
```javascript
{
	property:{
		capacity:3
	}
} 
```

Return:
Status Code: 401


## Flow 4 - Error Flow: User is not Authenticated

POST /api/properties/:id
```javascript
{
	property:{
		capacity:3
	}
} 
```

Return:
Status Code: 401

## Flow 5 - Error Flow: Property associated to user id dont exist

POST /api/properties/:id
```javascript
{
	property:{
		capacity:3
	}
} 
```

Return:
Status Code: 404